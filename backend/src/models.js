import mongoose from 'mongoose'

const { Schema, model } = mongoose

const appointmentSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  service: { type: String, required: true, trim: true, maxlength: 100 },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true, trim: true, maxlength: 40 },
  message: { type: String, trim: true, maxlength: 2000, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

const serviceSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  icon: { type: String, default: 'Smile' },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

const dentistSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, required: true, trim: true, maxlength: 120 },
  bio: { type: String, required: true, trim: true, maxlength: 1000 },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

const reviewSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  detail: { type: String, trim: true, maxlength: 120, default: 'Patient' },
  quote: { type: String, required: true, trim: true, maxlength: 1500 },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  published: { type: Boolean, default: true },
}, { timestamps: true })

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

const contactInquirySchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true })

export const Appointment = model('Appointment', appointmentSchema)
export const Service = model('Service', serviceSchema)
export const Dentist = model('Dentist', dentistSchema)
export const Review = model('Review', reviewSchema)
export const Admin = model('Admin', adminSchema)
export const ContactInquiry = model('ContactInquiry', contactInquirySchema)
