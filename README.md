Group Members:

Edwin Saba (EdwinSaba)

# Freelance Hub

A full-stack freelance marketplace built with Next.js, Prisma, and Neon PostgreSQL.

## Features

- User authentication (Freelancer/Client)
- Post jobs and submit proposals
- Accept/deny proposals
- Dark mode toggle
- Responsive UI with custom color palette
- Real-time updates

## Stack

- **Frontend:** Next.js (React)
- **Backend:** Next.js API routes
- **Database:** Neon PostgreSQL (via Prisma ORM)
- **Images:** Unsplash API

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/freelance-hub.git
   cd freelance-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your database:
   - Create a Neon PostgreSQL project ([neon.tech](https://neon.tech))
   - Copy your connection string into `.env`:
     ```
     DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
     ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the app:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## License
