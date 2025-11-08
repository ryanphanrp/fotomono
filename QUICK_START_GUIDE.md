# Quick Start Guide
## Photographer SaaS Platform - Getting Started

**📖 Full Details:** See `IMPLEMENTATION_ROADMAP.md` for complete breakdown
**📋 Original PRD:** See `photographer-saas-prd.md`

---

## 🎯 MVP Overview (12 Weeks)

### **Phase 1: Foundation** (Weeks 1-2)
✅ User authentication & registration
✅ Database schema & migrations
✅ Storage credential encryption

**Key Files to Create:**
- `packages/db/src/schema/schema.prisma` - Database schema
- `packages/auth/src/index.ts` - Better-Auth config
- `packages/api/src/routers/auth.ts` - Auth tRPC procedures
- `apps/web/app/(auth)/login/page.tsx` - Login UI
- `apps/web/app/(auth)/register/page.tsx` - Register UI

---

### **Phase 2: Shows & Calendar** (Weeks 3-4)
✅ Show CRUD operations
✅ Calendar view (month/week/day)
✅ Status workflow & reminders

**Key Files to Create:**
- `packages/api/src/routers/shows.ts` - Show tRPC procedures
- `packages/api/src/schemas/show.ts` - Zod validation schemas
- `apps/web/components/calendar/Calendar.tsx` - Calendar component
- `apps/web/app/dashboard/shows/page.tsx` - Show list
- `apps/web/app/dashboard/shows/new/page.tsx` - Create show

---

### **Phase 3: Image Upload & Storage** (Weeks 5-6)
✅ Multi-storage integration (Google Drive, S3, R2)
✅ Image upload with validation
✅ Gallery UI & tagging

**Key Files to Create:**
- `packages/api/src/storage/IStorageProvider.ts` - Storage interface
- `packages/api/src/storage/providers/GoogleDriveProvider.ts`
- `packages/api/src/storage/providers/S3Provider.ts`
- `packages/api/src/storage/providers/R2Provider.ts`
- `packages/api/src/routers/images.ts` - Image tRPC procedures
- `apps/web/components/images/ImageUpload.tsx` - Upload UI
- `apps/web/components/images/Gallery.tsx` - Gallery UI

---

### **Phase 4: Portfolio & Approval** (Weeks 7-8)
✅ Portfolio management
✅ Client approval workflow
✅ Category & tag organization

**Key Files to Create:**
- `packages/api/src/routers/portfolio.ts` - Portfolio procedures
- `packages/api/src/routers/approval.ts` - Approval procedures
- `apps/web/app/dashboard/portfolio/page.tsx` - Portfolio management
- `apps/web/app/approval/[token]/page.tsx` - Public approval page
- `apps/web/components/portfolio/PortfolioReorder.tsx` - Drag & drop

---

### **Phase 5: Client Albums** (Weeks 9-10)
✅ Album creation & management
✅ Shareable links with expiration
✅ Client gallery & feedback

**Key Files to Create:**
- `packages/api/src/routers/albums.ts` - Album procedures
- `packages/api/src/routers/albumLinks.ts` - Link procedures
- `apps/web/app/dashboard/albums/page.tsx` - Album management
- `apps/web/app/album/[token]/page.tsx` - Public client gallery
- `apps/web/components/albums/FeedbackForm.tsx` - Rating system

---

### **Phase 6: Public Portfolio** (Weeks 11-12)
✅ Portfolio website with subdomain routing
✅ Theme customization
✅ SEO optimization

**Key Files to Create:**
- `apps/web/app/[subdomain]/page.tsx` - Public portfolio page
- `apps/web/middleware.ts` - Subdomain routing
- `apps/web/components/portfolio/ThemeCustomizer.tsx` - Customization UI
- `apps/web/app/dashboard/portfolio/settings/page.tsx` - Settings page
- `apps/web/themes/` - Portfolio themes

---

## 🚀 Getting Started NOW

### **Step 1: Environment Setup**
```bash
# Install dependencies
bun install

# Configure environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env

# Fill in:
# - DATABASE_URL (Supabase PostgreSQL)
# - SUPABASE_URL, SUPABASE_ANON_KEY
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - R2_* (Cloudflare R2 credentials)
# - UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN
# - SENTRY_DSN (optional for now)
```

### **Step 2: Database Setup**
```bash
# Create Prisma schema (see IMPLEMENTATION_ROADMAP.md Phase 1)
cd packages/db

# Push schema to database
bun run db:push

# Generate Prisma Client
bun run db:generate

# Open database studio to verify
bun run db:studio
```

### **Step 3: Start Development**
```bash
# Start all apps
bun run dev

# OR start individually:
bun run dev:web    # Frontend (http://localhost:3001)
bun run dev:server # Backend (http://localhost:3000)
```

### **Step 4: Start Phase 1 Development**
Follow tasks in `IMPLEMENTATION_ROADMAP.md` → **Phase 1: Foundation & Authentication**

Begin with:
1. Task 1.2.1 - Create Prisma schema for users
2. Task 1.3.1 - Configure Better-Auth
3. Task 1.3.3 - Build registration page

---

## 📋 Database Schema (Quick Reference)

### **Phase 1 Tables**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  shows            Show[]
  portfolioImages  PortfolioImage[]
  albums           ClientAlbum[]
  storageConfigs   StorageConfig[]
}

model Show {
  id         String   @id @default(cuid())
  userId     String
  title      String
  clientName String
  shootType  String   // Wedding, Portrait, Commercial, etc.
  location   String?
  dateStart  DateTime
  dateEnd    DateTime
  pricing    Decimal?
  status     String   @default("pending") // pending, confirmed, completed, delivered
  notes      String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  images Image[]
  albums ClientAlbum[]
}

model Image {
  id          String   @id @default(cuid())
  showId      String
  storagePath String
  filename    String
  url         String
  fileSize    Int
  width       Int?
  height      Int?
  exifData    Json?
  createdAt   DateTime @default(now())

  show              Show             @relation(fields: [showId], references: [id], onDelete: Cascade)
  tags              ImageTag[]
  approval          ImageApproval?
  portfolioImage    PortfolioImage?
  albumImages       ClientAlbumImage[]
}

model ImageTag {
  id       String @id @default(cuid())
  imageId  String
  tagName  String
  category String?

  image Image @relation(fields: [imageId], references: [id], onDelete: Cascade)
}

model ImageApproval {
  id                String    @id @default(cuid())
  imageId           String    @unique
  status            String    @default("pending") // pending, approved, rejected
  clientApprovedAt  DateTime?

  image Image @relation(fields: [imageId], references: [id], onDelete: Cascade)
}

model PortfolioImage {
  id          String   @id @default(cuid())
  userId      String
  imageId     String   @unique
  category    String?
  tags        String[] // Array of tag names
  position    Int      @default(0)
  publishedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  image Image @relation(fields: [imageId], references: [id], onDelete: Cascade)
}

model ClientAlbum {
  id        String   @id @default(cuid())
  showId    String
  userId    String
  name      String?
  createdAt DateTime @default(now())

  show   Show   @relation(fields: [showId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  links  ClientAlbumLink[]
  images ClientAlbumImage[]
}

model ClientAlbumImage {
  id      String @id @default(cuid())
  albumId String
  imageId String

  album ClientAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)
  image Image       @relation(fields: [imageId], references: [id], onDelete: Cascade)
}

model ClientAlbumLink {
  id             String    @id @default(cuid())
  albumId        String
  token          String    @unique
  expirationDate DateTime?
  allowDownload  Boolean   @default(true)
  accessedCount  Int       @default(0)
  createdAt      DateTime  @default(now())

  album    ClientAlbum      @relation(fields: [albumId], references: [id], onDelete: Cascade)
  feedback ClientFeedback[]
}

model ClientFeedback {
  id           String   @id @default(cuid())
  linkId       String
  rating       Int?     // 1-5 stars
  feedbackText String?
  createdAt    DateTime @default(now())

  link ClientAlbumLink @relation(fields: [linkId], references: [id], onDelete: Cascade)
}

model StorageConfig {
  id                   String  @id @default(cuid())
  userId               String
  providerType         String  // google_drive, s3, r2, nas
  credentialsEncrypted String  // Encrypted JSON
  isActive             Boolean @default(true)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PortfolioSettings {
  id           String   @id @default(cuid())
  userId       String   @unique
  subdomain    String   @unique
  theme        String   @default("default")
  primaryColor String   @default("#000000")
  accentColor  String   @default("#FF6B6B")
  bio          String?
  logoUrl      String?
  socialLinks  Json?    // { instagram: "...", facebook: "...", etc. }
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 🔧 Essential Commands

### **Development**
```bash
bun run dev              # Start all apps
bun run dev:web          # Frontend only
bun run dev:server       # Backend only
bun run check            # Run Biome lint/format
bun run check-types      # TypeScript type checking
```

### **Database**
```bash
bun run db:push          # Push schema changes (dev)
bun run db:migrate       # Create migration (prod)
bun run db:generate      # Generate Prisma Client
bun run db:studio        # Open Drizzle Studio
```

### **Code Quality**
```bash
npx ultracite fix        # Auto-fix lint/format issues
npx ultracite check      # Check for issues
npx ultracite doctor     # Diagnose setup
```

---

## 📦 Key Dependencies to Install (as needed)

### **Phase 1**
```bash
# Already installed in Better-T-Stack
bun add better-auth
bun add @prisma/client
```

### **Phase 2**
```bash
# Calendar
bun add react-big-calendar date-fns
# OR
bun add @fullcalendar/react @fullcalendar/daygrid
```

### **Phase 3**
```bash
# Storage providers
bun add googleapis @google-cloud/storage
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
# Image processing
bun add sharp
# File upload
bun add formidable
```

### **Phase 4**
```bash
# Drag & drop
bun add @dnd-kit/core @dnd-kit/sortable
# OR
bun add @hello-pangea/dnd
```

### **Phase 5**
```bash
# ZIP generation for batch download
bun add jszip
```

### **Phase 6**
```bash
# Already using Next.js metadata API
# No additional deps needed
```

---

## 🎨 UI Components (shadcn/ui)

Install as needed:
```bash
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add calendar
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add toast
```

---

## ✅ Success Checklist

### **Phase 1 Complete**
- [ ] Users can register & login
- [ ] Protected routes require authentication
- [ ] Database schema created & migrated
- [ ] Storage credentials can be encrypted

### **Phase 2 Complete**
- [ ] Shows can be created, edited, deleted
- [ ] Calendar displays shows correctly
- [ ] Show status can be updated
- [ ] Reminders are scheduled (logged to console)

### **Phase 3 Complete**
- [ ] Images can be uploaded to configured storage
- [ ] Thumbnails are generated automatically
- [ ] Gallery displays uploaded images
- [ ] Images can be tagged & categorized

### **Phase 4 Complete**
- [ ] Images can be added to portfolio
- [ ] Client approval links can be generated
- [ ] Clients can approve/reject images
- [ ] Approved images appear in portfolio

### **Phase 5 Complete**
- [ ] Albums can be created from shows
- [ ] Shareable links can be generated
- [ ] Links respect expiration dates
- [ ] Clients can view, download, and rate albums

### **Phase 6 Complete**
- [ ] Portfolio accessible via subdomain
- [ ] Theme & colors can be customized
- [ ] SEO tags are present
- [ ] Portfolio is mobile-responsive

---

## 🆘 Common Issues & Solutions

### **Issue: Database connection error**
```bash
# Check DATABASE_URL in .env
# Verify Supabase project is active
# Test connection with:
bun run db:studio
```

### **Issue: Storage upload failing**
```bash
# Check storage credentials in .env
# Test connection with storage.testConnection procedure
# Verify bucket/folder permissions
```

### **Issue: Subdomain routing not working locally**
```bash
# Edit /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
# Add: 127.0.0.1 photographername.localhost
# Access: http://photographername.localhost:3001
```

### **Issue: TypeScript errors**
```bash
# Regenerate Prisma Client
bun run db:generate

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📞 Next Steps

1. **Review** `IMPLEMENTATION_ROADMAP.md` for full task details
2. **Set up** environment variables (Step 1 above)
3. **Create** Prisma schema (Phase 1, Task 1.2)
4. **Start** with authentication (Phase 1, Task 1.3)
5. **Deploy** MVP after Phase 6 completion

---

**Good luck building! 🚀**
