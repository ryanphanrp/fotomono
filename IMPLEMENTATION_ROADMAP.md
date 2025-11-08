# Implementation Roadmap
## Photographer SaaS Platform - Phased Development Plan

**Based on:** photographer-saas-prd.md
**Tech Stack:** Better-T-Stack (Next.js 15, Hono, Prisma, Supabase)
**Timeline:** 12 weeks MVP + Phase 2 enhancements
**Generated:** November 2025

---

## 🎯 MVP PHASES (12 Weeks)

### **PHASE 1: Foundation & Authentication** (Weeks 1-2)

#### **Sprint Goals**
- Set up monorepo infrastructure
- Implement authentication system
- Database schema & migrations
- Storage credential encryption

#### **Detailed Tasks**

##### 1.1 Project Setup & Infrastructure
- [ ] **Task 1.1.1:** Verify Turborepo structure for fotomono monorepo
  - Ensure `apps/web`, `apps/server`, `packages/api`, `packages/auth`, `packages/db` exist
  - Validate bun workspace configuration
  - **Location:** Root `package.json`, `turbo.json`

- [ ] **Task 1.1.2:** Configure environment variables for all apps
  - Create `.env.example` files in `apps/web` and `apps/server`
  - Document required vars: DATABASE_URL, SUPABASE_URL, AUTH_SECRET, R2_*, UPSTASH_*
  - **Location:** `apps/web/.env.example`, `apps/server/.env.example`

- [ ] **Task 1.1.3:** Set up Supabase PostgreSQL connection
  - Create Supabase project
  - Configure connection pooling
  - Test connection from `packages/db`
  - **Location:** `packages/db/src/index.ts`

- [ ] **Task 1.1.4:** Initialize Sentry for error tracking
  - Configure Sentry in both web and server apps
  - Set up source maps for better debugging
  - **Location:** `apps/web/next.config.js`, `apps/server/src/index.ts`

##### 1.2 Database Schema Design
- [ ] **Task 1.2.1:** Create Prisma schema for users & authentication
  ```sql
  -- Tables: users, sessions, accounts, verification_tokens
  ```
  - **Location:** `packages/db/src/schema/schema.prisma`

- [ ] **Task 1.2.2:** Create Prisma schema for shows
  ```sql
  -- Table: shows (id, user_id, title, client_name, shoot_type, location,
  --              date_start, date_end, pricing, status, notes, created_at)
  ```
  - **Location:** `packages/db/src/schema/schema.prisma`

- [ ] **Task 1.2.3:** Create Prisma schema for images & media
  ```sql
  -- Tables: images, image_tags, image_approvals
  ```
  - **Location:** `packages/db/src/schema/schema.prisma`

- [ ] **Task 1.2.4:** Create Prisma schema for portfolio & albums
  ```sql
  -- Tables: portfolio_images, client_albums, client_album_links, client_feedback
  ```
  - **Location:** `packages/db/src/schema/schema.prisma`

- [ ] **Task 1.2.5:** Create Prisma schema for storage configuration
  ```sql
  -- Table: storage_configs (encrypted credentials)
  ```
  - **Location:** `packages/db/src/schema/schema.prisma`

- [ ] **Task 1.2.6:** Run initial Prisma migration
  ```bash
  bun run db:push
  bun run db:generate
  ```
  - **Location:** `packages/db/`

##### 1.3 Authentication Implementation
- [ ] **Task 1.3.1:** Configure Better-Auth in packages/auth
  - Set up email/password provider
  - Configure session management
  - Add CSRF protection
  - **Location:** `packages/auth/src/index.ts`

- [ ] **Task 1.3.2:** Create auth tRPC procedures
  - `auth.register` - User registration
  - `auth.login` - User login
  - `auth.logout` - User logout
  - `auth.me` - Get current user
  - `auth.refreshToken` - Refresh session
  - **Location:** `packages/api/src/routers/auth.ts`

- [ ] **Task 1.3.3:** Build registration page UI
  - Email/password form with validation (Zod)
  - Error handling & loading states
  - **Location:** `apps/web/app/(auth)/register/page.tsx`

- [ ] **Task 1.3.4:** Build login page UI
  - Email/password form
  - "Remember me" option
  - **Location:** `apps/web/app/(auth)/login/page.tsx`

- [ ] **Task 1.3.5:** Implement auth middleware for protected routes
  - Check session validity
  - Redirect unauthorized users
  - **Location:** `apps/web/middleware.ts`

- [ ] **Task 1.3.6:** Create auth context & hooks for client components
  - `useAuth()` hook
  - `useSession()` hook
  - **Location:** `apps/web/hooks/useAuth.ts`

##### 1.4 Storage Credential Encryption
- [ ] **Task 1.4.1:** Set up encryption utility for storage credentials
  - Use Node crypto module or libsodium
  - Encrypt/decrypt functions
  - **Location:** `packages/api/src/utils/encryption.ts`

- [ ] **Task 1.4.2:** Create storage config data model
  - Fields: provider_type (google_drive, s3, r2, nas), credentials_encrypted
  - **Location:** Already in Prisma schema from 1.2.5

##### 1.5 Testing & QA
- [ ] **Task 1.5.1:** Write unit tests for auth procedures
  - Test registration, login, logout flows
  - **Location:** `packages/api/src/routers/__tests__/auth.test.ts`

- [ ] **Task 1.5.2:** Test database migrations
  - Ensure all tables created correctly
  - Test rollback scenarios

- [ ] **Task 1.5.3:** Manual QA for auth flow
  - Register new user
  - Login/logout
  - Protected route access

#### **Phase 1 Deliverables**
✅ Working authentication system
✅ Database schema fully migrated
✅ Encrypted storage config ready
✅ Protected route middleware
✅ User registration & login UI

---

### **PHASE 2: Show Management & Calendar** (Weeks 3-4)

#### **Sprint Goals**
- Build show CRUD operations
- Implement calendar view
- Show status workflow
- Notification scheduling infrastructure

#### **Detailed Tasks**

##### 2.1 Show Management Backend
- [ ] **Task 2.1.1:** Create tRPC procedures for shows
  - `shows.create` - Create new show
  - `shows.list` - List shows with filters (date range, status, shoot_type)
  - `shows.getById` - Get show details
  - `shows.update` - Update show
  - `shows.delete` - Delete show
  - `shows.updateStatus` - Update show status
  - **Location:** `packages/api/src/routers/shows.ts`

- [ ] **Task 2.1.2:** Define Zod schemas for show input validation
  - CreateShowInput, UpdateShowInput, ShowFilters
  - **Location:** `packages/api/src/schemas/show.ts`

- [ ] **Task 2.1.3:** Implement show business logic
  - Status transitions (Pending → Confirmed → Completed → Delivered)
  - Validation rules (date in future for new shows, etc.)
  - **Location:** `packages/api/src/services/showService.ts`

##### 2.2 Calendar View Implementation
- [ ] **Task 2.2.1:** Choose calendar library
  - Evaluate: FullCalendar, React Big Calendar, or custom with date-fns
  - Install chosen library
  - **Location:** `apps/web/package.json`

- [ ] **Task 2.2.2:** Create calendar tRPC procedure
  - `shows.calendar` - Get shows formatted for calendar (month/week/day view)
  - **Location:** `packages/api/src/routers/shows.ts`

- [ ] **Task 2.2.3:** Build Calendar component
  - Month/week/day view toggle
  - Show details on click
  - Color-coded by status
  - **Location:** `apps/web/components/calendar/Calendar.tsx`

- [ ] **Task 2.2.4:** Integrate calendar with show data
  - Fetch shows via React Query + tRPC
  - Display on calendar
  - **Location:** `apps/web/app/dashboard/calendar/page.tsx`

##### 2.3 Show Management UI
- [ ] **Task 2.3.1:** Create Show form component
  - Fields: title, client_name, shoot_type, location, date_start, date_end, pricing, notes
  - Use React Hook Form + Zod validation
  - **Location:** `apps/web/components/shows/ShowForm.tsx`

- [ ] **Task 2.3.2:** Build Create Show page
  - Form with submit handler
  - Success/error notifications
  - **Location:** `apps/web/app/dashboard/shows/new/page.tsx`

- [ ] **Task 2.3.3:** Build Show List view
  - Table or card grid showing all shows
  - Filters: status, date range, shoot type
  - Sort by date/status
  - **Location:** `apps/web/app/dashboard/shows/page.tsx`

- [ ] **Task 2.3.4:** Build Show Detail page
  - Display all show information
  - Edit button → opens modal or navigates to edit page
  - Delete button with confirmation
  - Status update dropdown
  - **Location:** `apps/web/app/dashboard/shows/[id]/page.tsx`

- [ ] **Task 2.3.5:** Build Edit Show page
  - Pre-populate form with existing data
  - Update on submit
  - **Location:** `apps/web/app/dashboard/shows/[id]/edit/page.tsx`

##### 2.4 Notification Scheduling (Infrastructure only - Phase 1)
- [ ] **Task 2.4.1:** Set up Upstash Redis for job queue
  - Configure Redis connection
  - **Location:** `packages/api/src/services/redis.ts`

- [ ] **Task 2.4.2:** Create notification job types
  - ReminderJob (1 day before, 1 hour before)
  - **Location:** `packages/api/src/jobs/reminderJob.ts`

- [ ] **Task 2.4.3:** Schedule reminders on show creation
  - When show is created, enqueue 2 jobs (1 day, 1 hour)
  - **Location:** `packages/api/src/services/showService.ts`

- [ ] **Task 2.4.4:** Create job processor (for Phase 2 - email sending)
  - Scaffold job worker that will send emails later
  - For now, just log reminder to console
  - **Location:** `packages/api/src/workers/reminderWorker.ts`

##### 2.5 Testing & QA
- [ ] **Task 2.5.1:** Write unit tests for show procedures
  - Test CRUD operations
  - Test status transitions
  - **Location:** `packages/api/src/routers/__tests__/shows.test.ts`

- [ ] **Task 2.5.2:** Integration test for calendar view
  - Create shows, fetch calendar data
  - Verify correct formatting

- [ ] **Task 2.5.3:** Manual QA for show management
  - Create, edit, delete shows
  - Test calendar views
  - Verify status updates

#### **Phase 2 Deliverables**
✅ Full show CRUD operations
✅ Calendar view (month/week/day)
✅ Show status workflow
✅ Notification scheduling infrastructure
✅ Filters & search for shows

---

### **PHASE 3: Image Upload & Multi-Storage Integration** (Weeks 5-6)

#### **Sprint Goals**
- Implement image upload with validation
- Integrate Google Drive, AWS S3, Cloudflare R2 storage
- Build gallery UI for image organization
- Tagging & categorization system

#### **Detailed Tasks**

##### 3.1 Storage Backend Integration
- [ ] **Task 3.1.1:** Create storage abstraction layer
  - Interface: `IStorageProvider` with upload/download/delete methods
  - **Location:** `packages/api/src/storage/IStorageProvider.ts`

- [ ] **Task 3.1.2:** Implement Google Drive provider
  - Use googleapis npm package
  - OAuth2 authentication
  - Upload, download, delete methods
  - **Location:** `packages/api/src/storage/providers/GoogleDriveProvider.ts`

- [ ] **Task 3.1.3:** Implement AWS S3 provider
  - Use @aws-sdk/client-s3
  - Upload, download, delete, presigned URL generation
  - **Location:** `packages/api/src/storage/providers/S3Provider.ts`

- [ ] **Task 3.1.4:** Implement Cloudflare R2 provider
  - R2 is S3-compatible, use same SDK
  - Configure endpoint for R2
  - **Location:** `packages/api/src/storage/providers/R2Provider.ts`

- [ ] **Task 3.1.5:** Implement NAS provider (basic scaffolding for Phase 2)
  - HTTP endpoint-based upload/download
  - **Location:** `packages/api/src/storage/providers/NASProvider.ts`

- [ ] **Task 3.1.6:** Create storage factory
  - Based on user's storage_config, return correct provider instance
  - **Location:** `packages/api/src/storage/StorageFactory.ts`

##### 3.2 Storage Configuration UI
- [ ] **Task 3.2.1:** Create tRPC procedures for storage config
  - `storage.setConfig` - Save storage configuration
  - `storage.getConfig` - Get current config
  - `storage.testConnection` - Test storage connection
  - `storage.getUsage` - Get storage usage stats (Phase 2)
  - **Location:** `packages/api/src/routers/storage.ts`

- [ ] **Task 3.2.2:** Build Storage Configuration page
  - Radio buttons for provider selection (Google Drive, S3, R2, NAS)
  - Conditional form fields based on provider
  - Test connection button
  - **Location:** `apps/web/app/dashboard/settings/storage/page.tsx`

- [ ] **Task 3.2.3:** Implement OAuth2 flow for Google Drive
  - Redirect to Google OAuth consent screen
  - Handle callback and store tokens (encrypted)
  - **Location:** `apps/web/app/api/auth/google-drive/callback/route.ts`

##### 3.3 Image Upload Backend
- [ ] **Task 3.3.1:** Create tRPC procedures for image upload
  - `images.upload` - Upload images (batch)
  - `images.getByShow` - Get images for a show
  - `images.update` - Update image metadata
  - `images.updateTags` - Add/update tags
  - `images.delete` - Delete image
  - `images.markForPortfolio` - Mark image for portfolio
  - **Location:** `packages/api/src/routers/images.ts`

- [ ] **Task 3.3.2:** Implement image validation
  - Validate file types (JPEG, PNG, WEBP, HEIC)
  - Max file size check (e.g., 50MB per image)
  - Extract EXIF data (camera, lens, ISO, aperture, focal length)
  - **Location:** `packages/api/src/services/imageService.ts`

- [ ] **Task 3.3.3:** Implement image processing with Sharp
  - Generate thumbnails (small: 300px, medium: 800px, large: 1920px)
  - Optimize file size
  - **Location:** `packages/api/src/services/imageProcessing.ts`

- [ ] **Task 3.3.4:** Upload workflow logic
  - Accept image file
  - Validate & extract EXIF
  - Process (generate thumbnails)
  - Upload original + thumbnails to storage provider
  - Save metadata to database (images table)
  - **Location:** `packages/api/src/services/imageService.ts`

##### 3.4 Image Upload UI
- [ ] **Task 3.4.1:** Create image upload component
  - Drag-and-drop zone
  - File input for batch upload
  - Progress indicator
  - **Location:** `apps/web/components/images/ImageUpload.tsx`

- [ ] **Task 3.4.2:** Build Upload Images page
  - Dropdown to select show
  - Upload component
  - Preview uploaded images
  - **Location:** `apps/web/app/dashboard/images/upload/page.tsx`

- [ ] **Task 3.4.3:** Handle chunked upload for large files
  - Split large files into chunks
  - Upload chunks sequentially or in parallel
  - Combine on server or use multipart upload (S3)
  - **Location:** `apps/web/components/images/ImageUpload.tsx`

##### 3.5 Gallery & Organization UI
- [ ] **Task 3.5.1:** Create Gallery component
  - Thumbnail grid with lazy loading
  - Lightbox view for full image
  - Multi-select for bulk operations
  - **Location:** `apps/web/components/images/Gallery.tsx`

- [ ] **Task 3.5.2:** Build Show Images page
  - Gallery showing all images for a show
  - Filter by status (All, For Portfolio, Archive)
  - Sort by date uploaded, file name
  - **Location:** `apps/web/app/dashboard/shows/[id]/images/page.tsx`

- [ ] **Task 3.5.3:** Implement tagging UI
  - Tag input field (autocomplete with existing tags)
  - Bulk tag application
  - Tag filtering
  - **Location:** `apps/web/components/images/TagInput.tsx`

- [ ] **Task 3.5.4:** Implement category assignment
  - Dropdown for category selection (Wedding, Portrait, Commercial, etc.)
  - Bulk category assignment
  - **Location:** `apps/web/components/images/CategorySelect.tsx`

##### 3.6 Testing & QA
- [ ] **Task 3.6.1:** Test each storage provider integration
  - Upload, download, delete operations
  - Test with sample images

- [ ] **Task 3.6.2:** Test image processing
  - Verify thumbnail generation
  - Check EXIF extraction

- [ ] **Task 3.6.3:** Manual QA for image upload flow
  - Upload single image
  - Upload batch of images
  - Test progress indicator
  - Verify images appear in gallery

- [ ] **Task 3.6.4:** Test error handling
  - Invalid file type
  - File too large
  - Storage provider errors

#### **Phase 3 Deliverables**
✅ Multi-storage support (Google Drive, S3, R2)
✅ Image upload with validation & processing
✅ Thumbnail generation
✅ Gallery UI with lightbox
✅ Tagging & categorization system
✅ EXIF data extraction

---

### **PHASE 4: Portfolio Management & Client Approval** (Weeks 7-8)

#### **Sprint Goals**
- Build portfolio management interface
- Implement client approval workflow
- Portfolio organization (categories/tags)
- Approval link generation (email placeholder for Phase 2)

#### **Detailed Tasks**

##### 4.1 Portfolio Backend
- [ ] **Task 4.1.1:** Create tRPC procedures for portfolio
  - `portfolio.list` - Get all portfolio images
  - `portfolio.addImage` - Add image to portfolio
  - `portfolio.removeImage` - Remove from portfolio
  - `portfolio.organize` - Reorder images
  - `portfolio.getCategories` - Get all categories/tags
  - **Location:** `packages/api/src/routers/portfolio.ts`

- [ ] **Task 4.1.2:** Implement portfolio organization logic
  - Sort by category, date, custom order
  - Filter by tags
  - **Location:** `packages/api/src/services/portfolioService.ts`

##### 4.2 Client Approval Workflow
- [ ] **Task 4.2.1:** Create approval link system
  - Generate unique token for approval
  - Store in image_approvals table
  - **Location:** `packages/api/src/services/approvalService.ts`

- [ ] **Task 4.2.2:** Create tRPC procedures for approval
  - `approval.createLink` - Generate approval link for images
  - `approval.getByToken` - Get images pending approval (public access)
  - `approval.approve` - Client approves images
  - `approval.reject` - Client rejects images
  - **Location:** `packages/api/src/routers/approval.ts`

- [ ] **Task 4.2.3:** Implement approval status workflow
  - States: Pending → Approved → Published OR Rejected
  - Once approved, auto-add to portfolio
  - **Location:** `packages/api/src/services/approvalService.ts`

##### 4.3 Portfolio Management UI
- [ ] **Task 4.3.1:** Build Portfolio page
  - Gallery showing all portfolio images
  - Filter by category/tag
  - Sort by date, category, custom order
  - **Location:** `apps/web/app/dashboard/portfolio/page.tsx`

- [ ] **Task 4.3.2:** Create "Add to Portfolio" workflow
  - From Show Images page, select images
  - Click "Add to Portfolio" button
  - Choose category & tags
  - **Location:** `apps/web/components/images/AddToPortfolioButton.tsx`

- [ ] **Task 4.3.3:** Implement drag-and-drop reordering
  - Use dnd-kit or react-beautiful-dnd
  - Save custom order to database
  - **Location:** `apps/web/components/portfolio/PortfolioReorder.tsx`

- [ ] **Task 4.3.4:** Build Category management UI
  - Add/edit/delete categories
  - Assign categories to images
  - **Location:** `apps/web/app/dashboard/portfolio/categories/page.tsx`

##### 4.4 Client Approval UI
- [ ] **Task 4.4.1:** Create approval link generation UI
  - From Show Images page, select images
  - Click "Request Approval" button
  - Generate link and display (copy to clipboard)
  - **Location:** `apps/web/components/approval/CreateApprovalLink.tsx`

- [ ] **Task 4.4.2:** Build public approval page (no login required)
  - Access via token: `/approval/[token]`
  - Display images pending approval
  - Approve/reject buttons for each image
  - Submit approval
  - **Location:** `apps/web/app/approval/[token]/page.tsx`

- [ ] **Task 4.4.3:** Create approval status indicator
  - Show approval status on Show Images page
  - Icons: Pending (clock), Approved (checkmark), Rejected (X)
  - **Location:** `apps/web/components/images/ApprovalStatus.tsx`

- [ ] **Task 4.4.4:** Email notification placeholder (for Phase 2)
  - When approval link is created, show message to copy link
  - In Phase 2, will send email automatically
  - **Location:** `apps/web/components/approval/ApprovalLinkCreated.tsx`

##### 4.5 Testing & QA
- [ ] **Task 4.5.1:** Test portfolio CRUD operations
  - Add images to portfolio
  - Remove images
  - Reorder images

- [ ] **Task 4.5.2:** Test approval workflow
  - Generate approval link
  - Access link (no login)
  - Approve/reject images
  - Verify approved images appear in portfolio

- [ ] **Task 4.5.3:** Manual QA for portfolio organization
  - Filter by category
  - Filter by tag
  - Sort by different criteria

#### **Phase 4 Deliverables**
✅ Portfolio management interface
✅ Client approval workflow
✅ Approval link generation
✅ Public approval page
✅ Category & tag management
✅ Drag-and-drop reordering

---

### **PHASE 5: Client Album & Private Sharing** (Weeks 9-10)

#### **Sprint Goals**
- Build client album system
- Secure shareable links with expiration
- Client gallery interface (public)
- Download & feedback features

#### **Detailed Tasks**

##### 5.1 Client Album Backend
- [ ] **Task 5.1.1:** Create tRPC procedures for albums
  - `albums.create` - Create album from show
  - `albums.getById` - Get album details
  - `albums.addImages` - Add images to album
  - `albums.removeImages` - Remove images from album
  - **Location:** `packages/api/src/routers/albums.ts`

- [ ] **Task 5.1.2:** Create tRPC procedures for album links
  - `albumLinks.create` - Generate shareable link
  - `albumLinks.getByToken` - Access album (public)
  - `albumLinks.update` - Update link settings (expiration, permissions)
  - `albumLinks.delete` - Deactivate link
  - **Location:** `packages/api/src/routers/albumLinks.ts`

- [ ] **Task 5.1.3:** Implement link token generation
  - Generate secure random token (UUID or nanoid)
  - Store in client_album_links table
  - **Location:** `packages/api/src/services/albumService.ts`

- [ ] **Task 5.1.4:** Implement expiration logic
  - Check expiration date on access
  - Return 410 Gone if expired
  - **Location:** `packages/api/src/services/albumService.ts`

- [ ] **Task 5.1.5:** Implement download permissions
  - Check allow_download flag
  - If true, generate presigned URLs for download
  - If false, return error on download attempt
  - **Location:** `packages/api/src/services/albumService.ts`

##### 5.2 Client Feedback System
- [ ] **Task 5.2.1:** Create tRPC procedure for feedback
  - `albumLinks.submitFeedback` - Submit rating & feedback (public)
  - `albumLinks.getFeedback` - Get feedback for album (photographer only)
  - **Location:** `packages/api/src/routers/albumLinks.ts`

- [ ] **Task 5.2.2:** Implement rating system
  - Simple 1-5 stars or thumbs up/down
  - Store in client_feedback table
  - **Location:** `packages/api/src/services/feedbackService.ts`

##### 5.3 Album Management UI (Photographer)
- [ ] **Task 5.3.1:** Build Create Album page
  - Select show
  - Select images to include
  - Album name/description
  - **Location:** `apps/web/app/dashboard/albums/new/page.tsx`

- [ ] **Task 5.3.2:** Build Album List page
  - List all albums
  - Show album details (# of images, # of links)
  - **Location:** `apps/web/app/dashboard/albums/page.tsx`

- [ ] **Task 5.3.3:** Build Album Detail page
  - View album images
  - Generate shareable link button
  - Manage existing links (list, edit, delete)
  - **Location:** `apps/web/app/dashboard/albums/[id]/page.tsx`

- [ ] **Task 5.3.4:** Create shareable link modal
  - Set expiration date (calendar picker)
  - Toggle allow_download
  - Generate link button
  - Copy link to clipboard
  - **Location:** `apps/web/components/albums/CreateLinkModal.tsx`

- [ ] **Task 5.3.5:** Build link management UI
  - List all links for album
  - Show expiration status (active/expired)
  - Edit link settings
  - Delete/deactivate link
  - **Location:** `apps/web/components/albums/LinkManagement.tsx`

##### 5.4 Client Album UI (Public)
- [ ] **Task 5.4.1:** Build public album page
  - Access via: `/album/[token]`
  - Check expiration before rendering
  - **Location:** `apps/web/app/album/[token]/page.tsx`

- [ ] **Task 5.4.2:** Create client gallery component
  - Clean, minimal design
  - Thumbnail grid
  - Lightbox for full view
  - Image count display
  - **Location:** `apps/web/components/albums/ClientGallery.tsx`

- [ ] **Task 5.4.3:** Implement download functionality
  - Individual image download button
  - Batch download button (download all)
  - Check allow_download permission
  - **Location:** `apps/web/components/albums/DownloadButtons.tsx`

- [ ] **Task 5.4.4:** Create feedback form
  - Star rating (1-5)
  - Text area for comments
  - Submit button
  - Thank you message after submission
  - **Location:** `apps/web/components/albums/FeedbackForm.tsx`

- [ ] **Task 5.4.5:** Add expired link page
  - Display friendly message when link is expired
  - Contact photographer CTA
  - **Location:** `apps/web/app/album/expired/page.tsx`

##### 5.5 Testing & QA
- [ ] **Task 5.5.1:** Test album creation & management
  - Create album
  - Add/remove images
  - Generate link

- [ ] **Task 5.5.2:** Test shareable link functionality
  - Generate link with expiration
  - Access link before/after expiration
  - Test download permissions

- [ ] **Task 5.5.3:** Test client feedback
  - Submit rating & comments
  - Verify feedback appears in photographer dashboard

- [ ] **Task 5.5.4:** Test batch download
  - Download all images in album
  - Verify download as ZIP file

#### **Phase 5 Deliverables**
✅ Client album system
✅ Secure shareable links with expiration
✅ Download permissions
✅ Public client gallery
✅ Rating & feedback system
✅ Batch download functionality

---

### **PHASE 6: Public Portfolio Website** (Weeks 11-12)

#### **Sprint Goals**
- Build public portfolio page system
- Subdomain routing
- Portfolio customization UI
- SEO optimization

#### **Detailed Tasks**

##### 6.1 Portfolio Website Backend
- [ ] **Task 6.1.1:** Create tRPC procedures for portfolio settings
  - `portfolio.getSettings` - Get portfolio customization settings
  - `portfolio.updateSettings` - Update theme, colors, bio, social links
  - `portfolio.getPublicData` - Get public portfolio data (for public pages)
  - **Location:** `packages/api/src/routers/portfolio.ts`

- [ ] **Task 6.1.2:** Implement subdomain routing logic
  - Parse subdomain from request hostname
  - Look up user by subdomain
  - Return 404 if not found
  - **Location:** `apps/web/app/[subdomain]/page.tsx` OR middleware

- [ ] **Task 6.1.3:** Create portfolio themes
  - Define 3-5 pre-designed themes
  - Theme structure: layout, typography, spacing
  - Store as JSON or React components
  - **Location:** `apps/web/themes/` directory

##### 6.2 Portfolio Customization UI
- [ ] **Task 6.2.1:** Build Portfolio Settings page
  - Subdomain input (photographer name)
  - Theme selector with preview thumbnails
  - Color pickers (primary, accent)
  - **Location:** `apps/web/app/dashboard/portfolio/settings/page.tsx`

- [ ] **Task 6.2.2:** Create profile section editor
  - Upload logo/profile image
  - Bio text area (rich text or plain)
  - Social media links (Instagram, Facebook, Twitter, etc.)
  - Contact email/phone
  - **Location:** `apps/web/components/portfolio/ProfileEditor.tsx`

- [ ] **Task 6.2.3:** Add live preview
  - Show preview of portfolio site in iframe or separate window
  - Update in real-time as settings change
  - **Location:** `apps/web/components/portfolio/LivePreview.tsx`

- [ ] **Task 6.2.4:** Implement theme customization
  - Primary color picker → updates theme CSS variables
  - Accent color picker → updates theme CSS variables
  - Apply changes to preview
  - **Location:** `apps/web/components/portfolio/ThemeCustomizer.tsx`

##### 6.3 Public Portfolio Page
- [ ] **Task 6.3.1:** Set up subdomain routing in Next.js
  - Use middleware to detect subdomain
  - Rewrite to dynamic route: `/[subdomain]`
  - **Location:** `apps/web/middleware.ts`

- [ ] **Task 6.3.2:** Build public portfolio page
  - Hero section with photographer name/bio
  - Portfolio grid showing published images
  - Category/tag filter navigation
  - Lightbox for full image view
  - **Location:** `apps/web/app/[subdomain]/page.tsx`

- [ ] **Task 6.3.3:** Apply user's theme & customization
  - Fetch portfolio settings by subdomain
  - Apply selected theme
  - Apply custom colors (CSS variables)
  - Display logo & bio
  - **Location:** `apps/web/app/[subdomain]/layout.tsx`

- [ ] **Task 6.3.4:** Create contact section
  - Simple contact form OR email link
  - Social media icons (links to photographer's accounts)
  - **Location:** `apps/web/components/portfolio/ContactSection.tsx`

- [ ] **Task 6.3.5:** Build 404 page for invalid subdomains
  - Friendly message: "Portfolio not found"
  - Link to main site
  - **Location:** `apps/web/app/[subdomain]/not-found.tsx`

##### 6.4 SEO Optimization
- [ ] **Task 6.4.1:** Implement Next.js metadata API
  - Dynamic meta title: "[Photographer Name] - Portfolio"
  - Dynamic meta description: Bio or default description
  - **Location:** `apps/web/app/[subdomain]/layout.tsx`

- [ ] **Task 6.4.2:** Add Open Graph tags
  - og:title, og:description, og:image (logo or featured portfolio image)
  - og:url (subdomain URL)
  - **Location:** `apps/web/app/[subdomain]/layout.tsx`

- [ ] **Task 6.4.3:** Generate sitemap
  - Include all portfolio pages
  - Update on portfolio changes
  - **Location:** `apps/web/app/sitemap.ts`

- [ ] **Task 6.4.4:** Add robots.txt
  - Allow all pages (unless user opts out in settings)
  - **Location:** `apps/web/app/robots.ts`

- [ ] **Task 6.4.5:** Implement structured data (JSON-LD)
  - Person schema for photographer
  - ImageObject schema for portfolio images (Phase 2)
  - **Location:** `apps/web/components/portfolio/StructuredData.tsx`

##### 6.5 Performance Optimization
- [ ] **Task 6.5.1:** Implement CDN for images
  - Serve images via Cloudflare CDN or Vercel Image Optimization
  - **Location:** `apps/web/next.config.js`

- [ ] **Task 6.5.2:** Optimize image loading
  - Use Next.js Image component with lazy loading
  - Set proper image sizes & srcset
  - **Location:** `apps/web/components/portfolio/PortfolioImage.tsx`

- [ ] **Task 6.5.3:** Implement caching strategy
  - Cache portfolio data in Redis for fast access
  - TTL: 5-10 minutes
  - **Location:** `packages/api/src/services/portfolioService.ts`

##### 6.6 Testing & QA
- [ ] **Task 6.6.1:** Test subdomain routing
  - Access valid subdomain
  - Access invalid subdomain (should 404)
  - Test on localhost (use /etc/hosts or subdomain simulator)

- [ ] **Task 6.6.2:** Test portfolio customization
  - Change theme
  - Change colors
  - Update bio & social links
  - Verify changes on public page

- [ ] **Task 6.6.3:** Test SEO
  - Check meta tags with browser inspector
  - Validate Open Graph with Facebook/Twitter debugger
  - Verify sitemap generation

- [ ] **Task 6.6.4:** Performance testing
  - Measure page load time (Lighthouse)
  - Test image loading on slow connections
  - Verify CDN is serving images

- [ ] **Task 6.6.5:** Responsive testing
  - Test on mobile, tablet, desktop
  - Verify gallery grid responsiveness
  - Test lightbox on touch devices

#### **Phase 6 Deliverables**
✅ Public portfolio website with subdomain routing
✅ Portfolio customization (themes, colors, bio)
✅ SEO optimization (meta tags, sitemap, Open Graph)
✅ Responsive design
✅ CDN-backed image serving
✅ Contact section with social links

---

## 🚀 PHASE 2: Post-MVP Enhancements (Future)

### **Phase 2.1: Advanced Features**
- [ ] Equipment management inventory
- [ ] Advanced reminders (customizable scheduling)
- [ ] Client comments on albums (threaded discussions)
- [ ] Team collaboration (role management, permissions)
- [ ] Analytics & reporting dashboard
- [ ] Custom domains for portfolio
- [ ] Watermarking on downloads/preview
- [ ] Password-protected album links

### **Phase 2.2: Notifications & Email**
- [ ] Email notification system (SendGrid or Resend)
- [ ] Transactional emails:
  - Show reminders (1 day, 1 hour before)
  - Approval request emails to clients
  - Album link delivery emails
  - Feedback notification to photographers
- [ ] SMS notifications (Twilio integration)

### **Phase 2.3: Advanced Storage**
- [ ] NAS full implementation (SFTP, WebDAV)
- [ ] Backblaze B2 integration
- [ ] Storage migration tool (move between providers)
- [ ] Automatic backup to secondary storage

### **Phase 2.4: Mobile App**
- [ ] React Native mobile app (iOS/Android)
- [ ] Mobile-optimized photo upload
- [ ] Push notifications
- [ ] Offline mode for gallery viewing

### **Phase 2.5: Analytics & Business Metrics**
- [ ] Revenue tracking per show
- [ ] Client metrics (repeat clients, referrals)
- [ ] Portfolio performance (views, engagement)
- [ ] Storage usage analytics
- [ ] Show completion rate

---

## 📊 TECHNICAL IMPLEMENTATION NOTES

### **Architecture Decisions**

#### **Monorepo Structure**
```
fotomono/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── server/       # Hono API (optional, can use Next.js API routes)
├── packages/
│   ├── api/          # tRPC procedures & business logic
│   ├── auth/         # Better-Auth configuration
│   ├── db/           # Prisma schema & database client
│   └── ui/           # Shared UI components (shadcn/ui)
```

#### **Data Flow**
```
Frontend (Next.js)
  → React Query + tRPC
  → API (Hono/Next.js API Routes)
  → Business Logic (packages/api)
  → Database (Prisma + PostgreSQL)
  → Storage (Google Drive/S3/R2)
```

#### **Authentication Flow**
- Better-Auth with email/password
- Session-based auth with secure cookies
- Middleware protection for dashboard routes
- Public routes for client album & portfolio

#### **Storage Architecture**
```
User uploads image
  → Validate & extract EXIF
  → Process with Sharp (generate thumbnails)
  → Upload to configured storage provider
  → Save metadata to database
  → Serve via CDN
```

### **Security Best Practices**
- [ ] Encrypt storage credentials at rest
- [ ] Use HTTPS for all communications
- [ ] Rate limiting on API endpoints (especially upload & public routes)
- [ ] Input validation with Zod
- [ ] CSRF protection for mutations
- [ ] Secure album token generation (cryptographically random)
- [ ] Expiration checks on all album link accesses
- [ ] Access control: photographers can only access their own data

### **Performance Optimizations**
- [ ] Redis caching for frequently accessed data (portfolio, album links)
- [ ] CDN for image serving (Cloudflare)
- [ ] Next.js Image Optimization
- [ ] Database indexing on frequently queried fields (user_id, show_id, status, date)
- [ ] Lazy loading & infinite scroll for galleries
- [ ] Job queue for async tasks (image processing, notifications)

### **Monitoring & Observability**
- [ ] Sentry for error tracking
- [ ] Application metrics (response times, API endpoint usage)
- [ ] Database query performance monitoring
- [ ] Storage usage monitoring

---

## 📈 SUCCESS METRICS & KPIs

### **MVP Phase Targets (Months 1-3)**
- [ ] **User Adoption:** 50+ photographers
- [ ] **Feature Usage:** 80%+ create ≥1 show per week
- [ ] **Portfolio Engagement:** Average 5+ portfolio images per photographer
- [ ] **Client Delivery:** 100% of completed shows have shareable album link
- [ ] **Retention:** 70%+ monthly active retention

### **Quality Metrics**
- [ ] **API Uptime:** 99.9%
- [ ] **Page Load Time:** <2 seconds
- [ ] **Image Processing:** <10 seconds for batch upload
- [ ] **Bug Report Rate:** <1 critical bug per 1000 MAU

---

## 🎯 NEXT STEPS

### **Immediate Actions**
1. ✅ Review this roadmap with team/stakeholders
2. [ ] Set up project management tool (Jira, Linear, GitHub Projects)
3. [ ] Create tickets for Phase 1 tasks
4. [ ] Assign Phase 1 tasks to developers
5. [ ] Start Sprint 1: Foundation & Authentication

### **Sprint Planning**
- **Sprint Duration:** 2 weeks
- **Sprint Ceremonies:**
  - Sprint Planning (Day 1)
  - Daily Standups
  - Sprint Review (Last day)
  - Sprint Retrospective (Last day)

### **Communication**
- **Daily Standups:** 15 minutes, sync on progress & blockers
- **Weekly Demo:** Show working features to stakeholders
- **Bi-weekly Retrospective:** Improve team process

---

## 📚 RESOURCES & DOCUMENTATION

### **Technical Documentation**
- [ ] Set up Storybook for UI components
- [ ] Create API documentation (tRPC automatically generates types)
- [ ] Database schema diagram (use dbdiagram.io or similar)
- [ ] Architecture decision records (ADRs)

### **User Documentation (Phase 2)**
- [ ] User guide for photographers
- [ ] Video tutorials for common workflows
- [ ] FAQ section
- [ ] Client guide for accessing albums

---

**END OF ROADMAP**
