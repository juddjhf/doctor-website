# SmileCraft Dental Studio

A premium, responsive dental-practice website portfolio demo built with React, Vite, Tailwind CSS, React Router, Framer Motion, and Lucide. The API is a separate Express/Mongoose application with JWT-protected administration.

All clinic contact details, dentists, and patient reviews are fictional demo content. The booking form sends a request for follow-up; it does not confirm or schedule an appointment. Form submissions are stored in the configured MongoDB database.

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB Community Server or a MongoDB Atlas connection

## Setup

Install frontend and API dependencies from the repository root:

```sh
npm install
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`. Set a MongoDB connection string, a unique JWT secret of at least 32 characters, and an admin email/password (the password must be at least 12 characters). The API creates the first admin account and demo content when it connects to an empty database.

Start the API and frontend in separate terminals:

```sh
# Terminal 1, from backend/
npm run dev

# Terminal 2, from the repository root
npm run dev
```

The website runs at `http://localhost:5173`, the API at `http://localhost:5000`, and the admin dashboard at `http://localhost:5173/admin/login`. The Vite development server proxies API and uploaded-image requests to port 5000. For a deployed frontend, set `VITE_API_URL` to the API base URL and configure `CLIENT_ORIGIN` in the backend.

## Available commands

From the repository root:

```sh
npm run dev
npm run build
npm run lint
```

From `backend/`:

```sh
npm run dev
npm start
```

## Website pages

- `/` — home, services, team preview, sample testimonials, FAQ, and appointment CTA
- `/about` — practice story and care approach
- `/services` and `/services/:slug` — service directory and details
- `/team` — fictional dentist profiles (`/doctors` redirects here)
- `/contact` — fictional contact details and backend-connected inquiry form
- `/book-appointment` — backend-connected appointment inquiry form
- `/privacy-policy` — demo disclosure and sample privacy information
- `/admin/login` — admin sign-in
- `/admin` — dashboard overview, appointments, services, dentists, and review management

## API overview

Public: `GET /api/services`, `GET /api/services/:slug`, `GET /api/dentists`, `GET /api/reviews`, `POST /api/appointments`, and `POST /api/contact`.

Admin (JWT required): `POST /api/admin/login`, `GET /api/admin/dashboard`, appointment listing/status/deletion, service CRUD, dentist CRUD, review CRUD, and `POST /api/admin/uploads` for JPG, PNG, or WebP images up to 5 MB.

The demo API does not send emails or SMS. Appointment inquiries remain pending until an administrator updates their status, and a clinic must contact the requester to confirm availability.
