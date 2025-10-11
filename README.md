# CI2P Research Lab

> **Computational Intelligence, Innovation & Performance**  
> University of Jinan - Key Laboratory of Intelligent Computing Technology

A modern, full-stack research lab website built with Next.js 15, TypeScript, and Prisma. Features comprehensive content management, authentication, and resource booking systems.

## 🎬 Demo

![Hero Section](public/hero.gif)

### Screenshots

<div align="center">
  <img src="public/about.png" alt="About Section" width="45%" />
  <img src="public/reserch_focus_area.png" alt="Research Focus Areas" width="45%" />
</div>

<div align="center">
  <img src="public/research_in_action_0.png" alt="Research in Action" width="45%" />
  <img src="public/nn_flow.png" alt="Neural Network Flow" width="45%" />
</div>

## 🚀 Features

### Public-Facing

- **Homepage**: Video hero section with lab metrics, featured research, and team showcase
- **Research Publications**: Searchable database with filters, citations, and PDF downloads
- **Projects**: Active and completed projects with team member integration
- **News & Updates**: Blog-style news feed with categories and tags
- **Team Directory**: Researcher profiles with publications and project listings
- **Resource Booking**: Lab equipment and facility reservation system

### Content Management

- **Admin Dashboard**: Full CRUD operations for all content types
- **Rich Text Editor**: Markdown-based content editing with preview
- **File Management**: Secure file uploads with validation
- **Featured Content**: Pin and feature important publications/projects
- **View Tracking**: Automatic analytics for papers, projects, and news

### Technical Features

- **Authentication**: JWT-based auth with role-based access control (SUPER_ADMIN, RESEARCHER, STUDENT, GUEST)
- **Database**: PostgreSQL with Prisma ORM
- **API Routes**: RESTful APIs with proper error handling and validation
- **Responsive Design**: Mobile-first, fully responsive UI with Tailwind CSS
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: Server-side rendering, static generation, and optimized images

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL with [Prisma ORM](https://prisma.io)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + shadcn/ui components
- **Authentication**: JWT with bcrypt password hashing
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: Custom Markdown editor with live preview
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
ci2p/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main public routes
│   ├── (auth)/            # Authentication routes (login, register)
│   ├── (public)/          # Public content routes
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── papers/        # Publications CRUD
│   │   ├── projects/      # Projects CRUD
│   │   ├── news/          # News CRUD
│   │   ├── resources/     # Resource booking system
│   │   └── ...
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Navigation, footer, etc.
│   ├── sections/         # Homepage sections
│   ├── editor/           # Rich text editor
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── auth.ts           # JWT utilities
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helpers
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database models
│   └── seed.ts           # Seed data
└── types/                # TypeScript type definitions

```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm/yarn/pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Hetawk/ci2p.git
cd ci2p
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your database and JWT secret:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ci2p"
JWT_SECRET="your-secret-key-here"
```

4. **Set up the database**

```bash
# Run migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Example Login (After Seeding)

After running the seed script, you can login with the credentials configured in your `.env` file:

- **Email**: `your-admin-email@example.com`
- **Password**: Set via `SEED_PASSWORD` environment variable

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user profile

### Publications

- `GET /api/papers` - List publications (with filters)
- `POST /api/papers` - Create publication (admin)
- `GET /api/papers/[id]` - Get single publication
- `PUT /api/papers/[id]` - Update publication (admin)
- `DELETE /api/papers/[id]` - Delete publication (admin)
- `PATCH /api/papers/[id]` - Toggle featured/published status (admin)

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (admin)
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project (admin)
- `DELETE /api/projects/[id]` - Delete project (admin)

### Resources & Bookings

- `GET /api/resources` - List available resources
- `POST /api/resources` - Create resource (admin)
- `GET /api/resources/bookings` - List bookings (filtered by user)
- `POST /api/resources/bookings` - Create booking request
- `PATCH /api/resources/bookings/[id]` - Approve/reject booking (admin)

Full API documentation available in `/zdir/API_Documentation.md`

## 🔐 User Roles & Registration Flow

### User Roles

- **SUPER_ADMIN**: Full system access, user management
- **RESEARCHER**: Create/edit own content, view analytics
- **STUDENT**: Limited content creation, resource booking
- **GUEST**: View public content only

### Registration Process

1. **User Registration**: Prospective researchers/students submit registration form with personal information
2. **Admin Review**: Registration requests appear in admin dashboard for approval
3. **Approval & Account Creation**: Admin/Super Admin reviews and approves, system generates temporary password
4. **First Login**: User receives temporary credentials and must change password on first login
5. **Access Granted**: User can now access system with their chosen secure password

This ensures proper vetting of all lab members and maintains security standards.

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t ci2p .
docker run -p 3000:3000 ci2p
```

## 📝 Recent Updates

### Phase 2 Complete (October 2025)

- ✅ Fixed all Next.js 15 async params errors
- ✅ Fixed auth API schema mismatches
- ✅ Implemented Resources & Bookings API system
- ✅ Added conflict detection for bookings
- ✅ Admin approval workflow for reservations
- ✅ Resolved routing conflicts
- ✅ Zero TypeScript compilation errors

### Phase 1 Complete

- ✅ Papers detail page with view tracking
- ✅ Projects detail page with member integration
- ✅ News detail page with related posts
- ✅ Full CRUD APIs for all content types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for CI2P Research Lab.

## 📧 Contact

**CI2P Research Lab**  
**Prof. Sijie Niu - Lab Director**  
School of Information Science and Engineering  
University of Jinan  
No. 336 West Road of Nan Xinzhuang  
Jinan, Shandong 250022, China

📧 Email: sjniu@hotmail.com | ise_niusj@ujn.edu.cn  
📞 Phone: 0531-82767569  
🔬 Google Scholar: [Prof. Sijie Niu](https://scholar.google.com.hk/citations?user=tRi0nMcAAAAJ&hl=zh-en)  
🔗 ORCID: [0000-0002-1401-9859](https://orcid.org/0000-0002-1401-9859)

---

Built with ❤️ by the CI2P Development Team
