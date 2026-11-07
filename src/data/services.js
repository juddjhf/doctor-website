import {
  AlignCenter,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
} from 'lucide-react'

export const services = [
  {
    title: 'General Dentistry',
    slug: 'general-dentistry',
    description: 'Routine exams, cleanings, and checkups to keep your teeth and gums in great shape.',
    icon: Stethoscope,
    number: '01',
  },
  {
    title: 'Cosmetic Dentistry',
    slug: 'cosmetic-dentistry',
    description: 'Thoughtful smile enhancements tailored to your goals and natural features.',
    icon: Sparkles,
    number: '02',
  },
  {
    title: 'Teeth Whitening',
    slug: 'teeth-whitening',
    description: 'A brighter smile with dentist-guided whitening options.',
    icon: Sparkles,
    number: '03',
  },
  {
    title: 'Dental Implants',
    slug: 'dental-implants',
    description: 'Natural-looking tooth replacement planned around your needs.',
    icon: Syringe,
    number: '04',
  },
  {
    title: 'Invisalign Consultation',
    slug: 'invisalign-consultation',
    description: 'Explore clear aligner options and a treatment plan for your smile.',
    icon: AlignCenter,
    number: '05',
  },
  {
    title: 'Preventive Dental Care',
    slug: 'preventive-dental-care',
    description: 'Personalized prevention and ongoing care for a healthier smile.',
    icon: ShieldCheck,
    number: '06',
  },
]
