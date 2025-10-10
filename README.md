# CI2P Research Lab

> **Computational Intelligence, Innovation & Performance**  
> University of Jinan - Key Laboratory of Intelligent Computing Technology

A modern, full-stack research lab website built with Next.js 15, TypeScript, and Prisma. Features comprehensive content management, authentication, and resource booking systems.

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

### Default Admin Account

After seeding, you can login with:

- **Email**: admin@ci2p.com
- **Password**: (set during seed)

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

## 🔐 User Roles

- **SUPER_ADMIN**: Full system access, user management
- **RESEARCHER**: Create/edit own content, view analytics
- **STUDENT**: Limited content creation, resource booking
- **GUEST**: View public content only

## 🗂️ Database Schema

Key models:

- **User**: Authentication and authorization
- **Profile**: User profile information
- **Publication**: Research papers and publications
- **Project**: Research projects
- **News**: Lab news and updates
- **Resource**: Bookable lab resources
- **Booking**: Resource reservation system

See `prisma/schema.prisma` for complete schema.

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
University of Jinan  
Email: contact@ci2p.edu.cn  
Website: https://ci2p.ujn.edu.cn

---

Built with ❤️ by the CI2P Development Team
