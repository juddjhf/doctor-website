import 'dotenv/config'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, param, validationResult } from 'express-validator'
import { Admin, Appointment, ContactInquiry, Dentist, Review, Service } from './models.js'

const app = express()
const port = Number(process.env.PORT) || 5000
const dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDirectory = path.resolve(dirname, '../uploads')
const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 80, standardHeaders: true, legacyHeaders: false })
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false })
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) || ['http://localhost:5173'],
  credentials: false,
}))
app.use(express.json({ limit: '100kb' }))
app.use('/uploads', express.static(uploadDirectory))
app.use('/api/appointments', publicLimiter)
app.use('/api/contact', publicLimiter)

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Please check the submitted information.', errors: errors.array() })
  return next()
}

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Sign in to continue.' })
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
  }
}
const adminRouter = express.Router()
adminRouter.use(auth)

const seeds = {
  services: [
    ['General Dentistry', 'Routine exams, cleanings, and checkups to keep your teeth and gums in great shape.', 'Stethoscope'],
    ['Cosmetic Dentistry', 'Thoughtful smile enhancements tailored to your goals and natural features.', 'Sparkles'],
    ['Teeth Whitening', 'A brighter smile with dentist-guided whitening options.', 'Sparkles'],
    ['Dental Implants', 'Natural-looking tooth replacement planned around your needs.', 'HeartPulse'],
    ['Invisalign Consultation', 'Explore clear aligner options and a treatment plan for your smile.', 'AlignCenter'],
    ['Preventive Dental Care', 'Personalized prevention and ongoing care for a healthier smile.', 'ShieldCheck'],
  ],
  dentists: [
    ['Dr. Olivia Bennett', 'General & Cosmetic Dentistry', 'A fictional demo profile focused on attentive, patient-first care.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85'],
    ['Dr. Ethan Miller', 'Restorative Dentistry', 'A fictional demo profile who enjoys helping patients understand their options.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=85'],
    ['Dr. Sophia Chen', 'Clear Aligner Consultations', 'A fictional demo profile committed to comfortable, collaborative visits.', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=85'],
  ],
  reviews: [
    ['Maya Thompson', 'Sample demo review', 'The team made me feel heard and comfortable from the moment I walked in.'],
    ['James Wilson', 'Sample demo review', 'Everything was explained clearly, and I never felt rushed.'],
    ['Priya Sharma', 'Sample demo review', 'A calm clinic and a team that truly cares.'],
  ],
}

async function seedPublicContent() {
  if (await Service.countDocuments() === 0) {
    await Service.insertMany(seeds.services.map(([title, description, icon]) => ({ title, description, icon, slug: slugify(title) })))
  }
  if (await Dentist.countDocuments() === 0) {
    await Dentist.insertMany(seeds.dentists.map(([name, role, bio, image]) => ({ name, role, bio, image })))
  }
  if (await Review.countDocuments() === 0) {
    await Review.insertMany(seeds.reviews.map(([name, detail, quote]) => ({ name, detail, quote, rating: 5 })))
  }
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (email && password && password !== 'change-this-before-running' && password.length >= 12) {
    const existing = await Admin.findOne({ email })
    if (!existing) await Admin.create({ email, passwordHash: await bcrypt.hash(password, 12) })
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/services', asyncRoute(async (req, res) => {
  res.json(await Service.find({ active: true }).sort({ createdAt: 1 }).lean())
}))
app.get('/api/services/:slug', param('slug').isSlug(), validate, asyncRoute(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, active: true }).lean()
  if (!service) return res.status(404).json({ message: 'Service not found.' })
  return res.json(service)
}))
app.get('/api/dentists', asyncRoute(async (req, res) => res.json(await Dentist.find({ active: true }).sort({ createdAt: 1 }).lean())))
app.get('/api/reviews', asyncRoute(async (req, res) => res.json(await Review.find({ published: true }).sort({ createdAt: -1 }).lean())))

app.post('/api/appointments', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().matches(/^[0-9+\s().-]{7,30}$/),
  body('service').trim().isLength({ min: 2, max: 100 }),
  body('preferredDate').isISO8601().toDate(),
  body('preferredTime').trim().isLength({ min: 2, max: 40 }),
  body('message').optional().trim().isLength({ max: 2000 }),
], validate, asyncRoute(async (req, res) => {
  if (req.body.preferredDate.toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10)) return res.status(400).json({ message: 'Please select a date that is today or later.' })
  const serviceExists = await Service.exists({ title: req.body.service, active: true })
  if (!serviceExists) return res.status(400).json({ message: 'Please select an available service.' })
  const appointment = await Appointment.create(req.body)
  return res.status(201).json({ message: 'Your request was received. The clinic will contact you to confirm a time.', appointment: { id: appointment.id } })
}))

app.post('/api/contact', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().matches(/^[0-9+\s().-]{7,30}$/),
  body('message').trim().isLength({ min: 10, max: 2000 }),
], validate, asyncRoute(async (req, res) => {
  await ContactInquiry.create(req.body)
  return res.status(201).json({ message: 'Your message was received.' })
}))

app.post('/api/admin/login', loginLimiter, [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 1, max: 200 }),
], validate, asyncRoute(async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email })
  if (!admin || !(await bcrypt.compare(req.body.password, admin.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' })
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(500).json({ message: 'Admin authentication is not configured securely.' })
  const token = jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' })
  return res.json({ token, admin: { email: admin.email } })
}))

adminRouter.get('/dashboard', asyncRoute(async (req, res) => {
  const [total, pending, confirmed, recent] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])
  res.json({ totalAppointments: total, pendingAppointments: pending, confirmedAppointments: confirmed, recentAppointments: recent })
}))
adminRouter.get('/appointments', asyncRoute(async (req, res) => res.json(await Appointment.find().sort({ createdAt: -1 }).lean())))
adminRouter.patch('/appointments/:id', param('id').isMongoId(), body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']), validate, asyncRoute(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true })
  if (!appointment) return res.status(404).json({ message: 'Appointment not found.' })
  return res.json(appointment)
}))
adminRouter.delete('/appointments/:id', param('id').isMongoId(), validate, asyncRoute(async (req, res) => {
  const deleted = await Appointment.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ message: 'Appointment not found.' })
  return res.status(204).end()
}))

adminRouter.get('/services', asyncRoute(async (req, res) => res.json(await Service.find().sort({ createdAt: 1 }).lean())))
adminRouter.post('/services', [
  body('title').trim().isLength({ min: 2, max: 100 }),
  body('description').trim().isLength({ min: 5, max: 1000 }),
  body('icon').optional().trim().isLength({ max: 40 }),
  body('image').optional().trim().isLength({ max: 500 }),
], validate, asyncRoute(async (req, res) => {
  const service = await Service.create({ ...req.body, slug: slugify(req.body.title) })
  return res.status(201).json(service)
}))
adminRouter.put('/services/:id', param('id').isMongoId(), body('title').trim().isLength({ min: 2, max: 100 }), body('description').trim().isLength({ min: 5, max: 1000 }), validate, asyncRoute(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { ...req.body, slug: slugify(req.body.title) }, { new: true, runValidators: true })
  if (!service) return res.status(404).json({ message: 'Service not found.' })
  return res.json(service)
}))
adminRouter.delete('/services/:id', param('id').isMongoId(), validate, asyncRoute(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id)
  if (!service) return res.status(404).json({ message: 'Service not found.' })
  return res.status(204).end()
}))

adminRouter.get('/dentists', asyncRoute(async (req, res) => res.json(await Dentist.find().sort({ createdAt: 1 }).lean())))
adminRouter.post('/dentists', body('name').trim().isLength({ min: 2, max: 100 }), body('role').trim().isLength({ min: 2, max: 120 }), body('bio').trim().isLength({ min: 5, max: 1000 }), validate, asyncRoute(async (req, res) => res.status(201).json(await Dentist.create(req.body))))
adminRouter.put('/dentists/:id', param('id').isMongoId(), body('name').trim().isLength({ min: 2, max: 100 }), body('role').trim().isLength({ min: 2, max: 120 }), body('bio').trim().isLength({ min: 5, max: 1000 }), validate, asyncRoute(async (req, res) => {
  const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!dentist) return res.status(404).json({ message: 'Dentist not found.' })
  return res.json(dentist)
}))
adminRouter.delete('/dentists/:id', param('id').isMongoId(), validate, asyncRoute(async (req, res) => {
  const dentist = await Dentist.findByIdAndDelete(req.params.id)
  if (!dentist) return res.status(404).json({ message: 'Dentist not found.' })
  return res.status(204).end()
}))

adminRouter.get('/reviews', asyncRoute(async (req, res) => res.json(await Review.find().sort({ createdAt: -1 }).lean())))
adminRouter.post('/reviews', body('name').trim().isLength({ min: 2, max: 100 }), body('quote').trim().isLength({ min: 5, max: 1500 }), body('rating').optional().isInt({ min: 1, max: 5 }), validate, asyncRoute(async (req, res) => res.status(201).json(await Review.create(req.body))))
adminRouter.put('/reviews/:id', param('id').isMongoId(), body('name').trim().isLength({ min: 2, max: 100 }), body('quote').trim().isLength({ min: 5, max: 1500 }), validate, asyncRoute(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!review) return res.status(404).json({ message: 'Review not found.' })
  return res.json(review)
}))
adminRouter.delete('/reviews/:id', param('id').isMongoId(), validate, asyncRoute(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) return res.status(404).json({ message: 'Review not found.' })
  return res.status(204).end()
}))

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return callback(new Error('Upload a JPG, PNG, or WebP image.'))
    return callback(null, true)
  },
})
adminRouter.post('/uploads', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' })
  return res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

app.use('/api/admin', adminRouter)
app.use((req, res) => res.status(404).json({ message: 'The requested resource was not found.' }))
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  if (error.code === 11000) return res.status(409).json({ message: 'That record already exists.' })
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message })
  if (error instanceof multer.MulterError) return res.status(400).json({ message: error.message })
  if (error.message === 'Upload a JPG, PNG, or WebP image.') return res.status(400).json({ message: error.message })
  console.error(error)
  return res.status(500).json({ message: 'An unexpected server error occurred.' })
})

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be set in backend/.env.')
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === 'replace-with-a-long-random-secret') {
    throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters.')
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12 || process.env.ADMIN_PASSWORD === 'change-this-before-running') {
    throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.')
  }
  await mongoose.connect(process.env.MONGODB_URI)
  await seedPublicContent()
  app.listen(port, () => console.log(`SmileCraft API listening on http://localhost:${port}`))
}

start().catch((error) => {
  console.error('Unable to start SmileCraft API:', error.message)
  process.exitCode = 1
})
