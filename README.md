# EduFind — College Discovery Platform

EduFind is a modern, full-stack college discovery platform built for students to search, compare, and save colleges across India with clarity and confidence. This repository serves as the final submission for the assessment.

## 🚀 Features
- **Discovery Engine:** Search colleges by state, filter by fees, and sort by ratings.
- **Detailed Profiles:** View comprehensive placement stats, course offerings, and student reviews.
- **Side-by-Side Comparison:** Compare up to 3 colleges simultaneously across key metrics.
- **Authentication & Personalization:** Create an account to save favorite colleges and persist custom comparisons.

## 🛠️ Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + Plus Jakarta Sans
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (v5 Beta)
- **Deployment:** Vercel (Web), Supabase (Database + Transaction Pooler)

## 💻 Local Development Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/rudrapratapp07/-college-discovery-mvp.git
   cd college-discovery-mvp
   npm install
   ```

2. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and configure your keys:
   ```env
   # Make sure to use your Supabase Direct Connection or Pooler URL
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
   AUTH_SECRET="your-secure-random-string-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Initialize the Database:**
   Push the Prisma schema to your remote database and run the seed script to populate the initial 40 colleges:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## ☁️ Deployment (Vercel)

1. Import the repository into your Vercel dashboard.
2. Under **Environment Variables**, add:
   - `DATABASE_URL` (Must be the Supabase **Transaction Pooler** string with port `6543`)
   - `AUTH_SECRET`
3. Click **Deploy**. Vercel will automatically run `prisma generate` and `next build`.

## 📂 Project Architecture
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components (Colleges, Compare, Auth, Layout)
- `/src/lib` - Utility functions, Prisma client setup, and NextAuth configuration
- `/prisma/schema.prisma` - Database schema definition

---
*Built with ❤️ for students making informed decisions.*
