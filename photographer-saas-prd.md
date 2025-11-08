# Product Requirements Document (PRD)
## Solo Photographer Management SaaS Platform

**Version:** 1.0  
**Date:** November 2025  
**Status:** MVP Planning  
**Target Users:** Solo photographers & small photography teams

---

## 1. Product Vision & Goals

### 1.1 Vision Statement
Build an all-in-one SaaS platform that empowers solo photographers and small teams to efficiently manage their photography business—from scheduling shoots to portfolio management—with a focus on simplicity, automation, and professional presentation.

### 1.2 Core Problems We're Solving
- **Scattered workflow:** Photographers juggle calendar apps, cloud storage, client management separately
- **Portfolio management pain:** Manual process to curate and showcase best work
- **Client delivery friction:** No unified way to share albums with clients securely
- **Business visibility:** No central place to track shows, revenue, and client relationships
- **Professional presence:** Limited ability to showcase portfolio to potential clients

### 1.3 Success Metrics (MVP Phase)
- **User Adoption:** 50+ photographers using platform within 3 months
- **Feature Usage:** 80%+ of active users create at least 1 show per week
- **Portfolio Engagement:** Average 5+ portfolio images per photographer
- **Client Delivery:** 100% of completed shows have a shareable album link
- **Retention:** 70%+ monthly active retention rate

---

## 2. User Personas

### Persona 1: Solo Wedding Photographer
- **Name:** Sarah
- **Background:** Freelance wedding photographer with 5+ years experience
- **Pain Points:** 
  - Managing multiple wedding bookings across different platforms
  - Time-consuming to organize and curate best shots for portfolio
  - Manually creating delivery folders for each client
- **Goals:** 
  - Streamline booking & show management
  - Showcase best work to attract new clients
  - Reduce client delivery time

### Persona 2: Small Photography Team Lead
- **Name:** Mike
- **Background:** Runs a small team of 3-4 photographers doing events & commercial shoots
- **Pain Points:**
  - Need to coordinate shows across team members
  - Inconsistent portfolio presentation
  - Complex cloud storage management with team
- **Goals:**
  - Centralized team calendar & show management
  - Unified portfolio with team's best work
  - Flexible storage options (Google Drive + S3)

### Persona 3: Content Creator/Lifestyle Photographer
- **Name:** Lisa
- **Background:** Lifestyle & brand photographer, active on social media
- **Pain Points:**
  - Frequently curating shots for portfolio/social
  - Need public presence to attract brand collaborations
  - Client galleries scattered across different services
- **Goals:**
  - Quick portfolio updates
  - Professional public portfolio website
  - Easy client album sharing with branding

---

## 3. Core Features (MVP Phase 1)

### 3.1 Show Management & Calendar

**Feature:** Calendar-based show booking and management interface

**User Stories:**
- As a photographer, I want to create a new show with client details, pricing, and location so I can track all my bookings
- As a photographer, I want to see all my shows in a calendar view to visualize my schedule
- As a photographer, I want to receive notifications 1 day and 1 hour before a show to prepare

**Key Attributes per Show:**
- Show title/name
- Client name & contact info
- Shoot type (Wedding, Portrait, Product, Commercial, etc.)
- Location/address
- Date & time (start/end)
- Pricing/rate
- Status (Pending, Confirmed, Completed, Delivered)
- Notes/special requirements
- Team members assigned (for team accounts)

**Workflow:**
1. Photographer creates show with all details
2. System automatically sets reminders (1 day & 1 hour before)
3. Photographer updates status as show progresses
4. Once show is completed, status moves to "Completed"
5. Flow waits for photographer to upload images

**Additional Interactions:**
- Edit existing shows
- Delete/archive past shows
- Bulk status updates (if needed)
- Filter by status, date range, show type

---

### 3.2 Image Upload & Portfolio Management

**Feature:** Upload, review, organize, and approve images for portfolio

**User Stories:**
- As a photographer, I want to upload images from a show and review them in a gallery interface
- As a photographer, I want to select and tag best images to add to my portfolio
- As a photographer, I want to organize portfolio images by categories and tags for easy discovery
- As a photographer, I want clients to approve images before they appear in my public portfolio

**Workflow - Upload & Review:**
1. Photographer selects show and uploads images (batch or individual)
2. System stores images in configured cloud storage
3. Photographer reviews images in gallery view with filtering/sorting
4. Photographer marks images as "For Portfolio" or "Archive"

**Workflow - Approval Process:**
1. Images marked "For Portfolio" enter "Pending Approval" state
2. System sends approval link to client (via email/dashboard)
3. Client reviews and approves/rejects images
4. Once approved, images move to "Published" state
5. Published images appear in:
   - Photographer's public portfolio
   - Client's private album
   - Portfolio page (if client approved)

**Organization System:**
- **Categories:** Wedding, Portrait, Commercial, Lifestyle, etc.
- **Tags:** By location, by technique, by season, custom tags
- **Metadata:** ISO, aperture, focal length (if available in EXIF)

**UI Interactions:**
- Thumbnail grid with selection
- Lightbox view for detailed review
- Bulk tagging/organization
- Undo/batch operations
- Search by tags & metadata

---

### 3.3 Client Album & Private Sharing

**Feature:** Generate secure, shareable links for clients to access their completed albums

**User Stories:**
- As a photographer, I want to create a private link for each client's album with customizable access
- As a photographer, I want to set expiration dates on client album links for security
- As a client, I want to view, download, and provide feedback on my photos through a private link

**Workflow:**
1. Photographer selects approved images from a show
2. System generates a unique, secure album link
3. Photographer can customize:
   - Access permissions (view-only or download)
   - Expiration date (e.g., 30 days from creation, custom date)
   - Link visibility (active/inactive toggle)
4. Photographer shares link with client (copy/email)
5. Client accesses album via link without login
6. Client can:
   - View images in gallery
   - Download selected or all images
   - Leave ratings & feedback on the album
   - Add comments/notes (optional for Phase 2)

**Link Settings:**
- Expiration date (calendar picker)
- Download allowed (Yes/No toggle)
- Password protection (optional for Phase 2)
- Watermark on images (optional for Phase 2)

**Client Experience:**
- Clean, distraction-free gallery view
- Easy batch download
- Simple rating system (1-5 stars or thumbs up/down)
- Feedback form (text area for comments)

---

### 3.4 Public Portfolio Website

**Feature:** Professional portfolio page for showcasing photographer's best work

**User Stories:**
- As a photographer, I want a professional portfolio website with my name/brand at a custom subdomain
- As a photographer, I want to customize my portfolio's theme, colors, and branding
- As a potential client, I want to visit a photographer's portfolio page and see their best work

**Subdomain Setup:**
- Format: `photographername.yourplatform.com`
- Custom domain support (Phase 2)
- One portfolio per photographer/team account

**Portfolio Content:**
- Hero section with photographer name/bio
- Portfolio grid showing approved/published images
- Category/filter navigation
- Individual image lightbox view
- Contact CTA (simple contact form or email link)

**Customization Options (MVP):**
- Theme selection (3-5 pre-designed themes)
- Primary color picker
- Accent color picker
- Logo/profile image upload
- Bio/about text section
- Social media links
- Contact information display

**SEO (Basic - Phase 1):**
- Meta title & description (auto-generated or custom)
- Open Graph tags for social sharing
- Sitemap generation
- Mobile-responsive design
- Basic SEO-friendly URL structure

**Advanced SEO (Phase 2):**
- Schema markup for portfolio
- Structured data for images
- Canonical tags
- Robots.txt configuration

---

### 3.5 Cloud Storage Integration

**Feature:** Flexible cloud storage configuration for photographers

**User Stories:**
- As a photographer team admin, I want to configure cloud storage options (Google Drive, S3, R2) once during setup
- As a photographer, I want images to automatically sync to my configured storage backend
- As a team, we want flexibility to use individual or shared storage based on our subscription plan

**Storage Options Supported (MVP):**
1. **Google Drive**
   - Simplest integration
   - Good for solo photographers
   - Free tier available

2. **AWS S3**
   - Scalable
   - Good for teams with higher volume
   - Requires AWS credentials setup

3. **Cloudflare R2**
   - Cost-effective alternative to S3
   - Lower egress costs
   - Good balance for growing teams

4. **NAS (Network Attached Storage)**
   - On-premise option
   - Self-hosted via API endpoint
   - Admin-level configuration

**Configuration Model:**
- **Individual Storage:** Each photographer configures their own storage (for solo plans)
- **Team Storage:** Shared storage per team with role-based access (for team plans)
- **Hybrid:** Mix of individual + shared storage (e.g., portfolio images on shared S3, backup on personal Google Drive)

**Admin Panel:**
- Storage configuration wizard
- Test connection button
- Usage monitoring (storage used/quota)
- Switch storage backend (with migration options)

**Technical Flow:**
1. Admin configures storage credentials (encrypted)
2. Photographer uploads images via web interface
3. System routes to configured storage backend
4. System maintains metadata in local database
5. Images served from storage (with CDN for performance)

---

## 4. Phase 2 Features (Future Roadmap)

These features are deprioritized for MVP but planned for Phase 2:

### Phase 2 Scope:
- **Equipment Management:** Inventory tracking for cameras, lenses, lighting gear
- **Advanced Reminders:** Customizable reminder scheduling (already scaffolded for Phase 2)
- **Client Feedback & Comments:** Detailed comment system on client albums
- **Team Collaboration:** Advanced team permissions and role management
- **Analytics & Reporting:** Revenue tracking, show analytics, client metrics
- **Advanced Customization:** Custom domains, advanced branding, design builder
- **Advanced Storage:** NAS, SFTP, Backblaze B2 support
- **Watermarking:** Auto-watermark on downloads/preview
- **Password-Protected Links:** Additional security for client albums
- **Email Notifications:** Transactional emails for clients & photographers
- **Mobile App:** Native iOS/Android app

---

## 5. User Workflows & Interactions

### 5.1 Complete Show Lifecycle

```
Step 1: Create Show
├─ Input: Client info, shoot type, pricing, location, date/time
├─ Output: Show created with Pending status
└─ Notifications: Set to trigger 1 day & 1 hour before

Step 2: Pre-Show
├─ View show in calendar
├─ Receive automated reminder 1 day before
├─ Receive automated reminder 1 hour before
└─ Status: Pending/Confirmed

Step 3: Complete Show
├─ Update show status to Completed
└─ Ready for image upload (manual trigger by photographer)

Step 4: Upload Images
├─ Select show from dropdown
├─ Batch upload images or drag-and-drop
├─ System stores to configured cloud storage
└─ Status: Images uploaded, pending review

Step 5: Review & Select
├─ Browse uploaded images in gallery
├─ Mark images for portfolio
├─ Add tags & categories
└─ Status: Images pending approval

Step 6: Client Approval
├─ System creates approval link
├─ Send to client (email/message)
├─ Client reviews & approves/rejects
└─ Photographer sees approval status in real-time

Step 7: Create Album Link
├─ Select approved images
├─ Generate private share link
├─ Set expiration & permissions
├─ Copy link or send to client
└─ Status: Show moved to Delivered

Step 8: Client Access & Feedback
├─ Client opens private link
├─ Views gallery, downloads images
├─ Leaves rating/feedback
└─ Photographer sees feedback in dashboard

Step 9: Portfolio Publication
├─ Approved images auto-appear on public portfolio
├─ Organized by category/tags
├─ Visible on portfolio website at subdomain
└─ Can be used for marketing/promotion
```

### 5.2 Portfolio Management Workflow

```
Step 1: Access Portfolio Section
└─ View all published images from all shows

Step 2: Organize Portfolio
├─ View by category/tag
├─ Bulk edit tags
├─ Reorder images
└─ Archive old images

Step 3: Customize Public Portfolio
├─ Select theme & colors
├─ Upload logo/bio
├─ Add social media links
├─ Preview portfolio site
└─ Publish changes (live instantly)

Step 4: Monitor Portfolio
├─ View portfolio performance (Phase 2: analytics)
├─ Track client feedback
└─ Update regularly for freshness
```

### 5.3 Team Workflow (for team accounts)

```
Step 1: Invite Team Members
├─ Admin invites photographers via email
├─ Set roles (Photographer, Editor, Viewer)
└─ Assign storage permissions

Step 2: Show Assignment
├─ Admin or lead photographer creates show
├─ Assign team members to show
├─ Set responsibilities (shooter, editor, etc.)
└─ Team members notified of assignment

Step 3: Collaborative Upload & Review
├─ Any assigned member can upload images
├─ All team members can review in shared view
├─ Lead photographer approves for portfolio
└─ Shared portfolio curated by team

Step 4: Portfolio Presentation
└─ Single shared portfolio showcasing team's best work
```

---

## 6. Technical Architecture & Stack Recommendations

### 6.1 Recommended Tech Stack

**Frontend:**
- Framework: Next.js 15 (React)
- UI Components: Shadcn/UI
- Styling: Tailwind CSS
- State Management: React Query / Zustand
- Image Gallery: React Photo Album / Lightbox
- Calendar: React Calendar or FullCalendar
- Forms: React Hook Form + Zod

**Backend:**
- Framework: Hono (lightweight, modern) or Next.js API Routes
- Language: TypeScript
- Database: PostgreSQL (with Prisma ORM)
- Cache: Redis
- Job Queue: Bull (for async uploads, notifications)

**Cloud & Storage:**
- Authentication: Better-Auth or Supabase Auth
- Cloud Storage SDK:
  - Google Drive API
  - AWS SDK (for S3/R2)
  - Cloudflare R2 API
  - Custom NAS client library
- File Processing: Sharp (image optimization)
- CDN: Cloudflare or AWS CloudFront

**Infrastructure:**
- Hosting: Vercel (frontend) + Railway/Render (backend)
- Database: Managed PostgreSQL (Supabase/Railway)
- Object Storage: S3/R2 for scalability
- Email: SendGrid or Resend (Phase 2)

### 6.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Web Browser)                      │
│          Next.js 15 + React + Shadcn/UI + Tailwind         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway / CDN                          │
│                   (Cloudflare / Vercel)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Auth Layer  │ │ Backend API  │ │   Webhooks   │
│(Better-Auth) │ │  (Hono/Node) │ │   Handler    │
└──────────────┘ └──────────────┘ └──────────────┘
        │              │
        └──────────────┼──────────────┐
                       │              ▼
                   ┌────────────┐ ┌──────────────────┐
                   │ PostgreSQL │ │  Cache (Redis)   │
                   │ (Database) │ │  Job Queue (Bull)│
                   └────────────┘ └──────────────────┘

┌──────────────────────────────────────────────────────────────┐
│            Cloud Storage & Integrations Layer               │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ Google Drive │ │  AWS S3/R2   │ │    NAS       │          │
│ │   (OAuth)    │ │  (API Keys)  │ │  (Endpoint)  │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│        │                │                │                   │
│        └────────────────┼────────────────┘                   │
│                         ▼                                     │
│                  File Service Layer                           │
│            (Abstraction for multi-storage)                    │
└──────────────────────────────────────────────────────────────┘
```

### 6.3 Database Schema (High-Level)

```sql
-- Users & Authentication
users (id, email, name, auth_id, created_at, updated_at)
user_settings (user_id, theme, bio, social_links, storage_config)

-- Shows/Bookings
shows (id, user_id/team_id, title, client_name, shoot_type, 
       location, date_start, date_end, pricing, status, notes, created_at)

-- Images & Media
images (id, show_id, storage_path, filename, url, 
        file_size, width, height, exif_data, created_at)
image_tags (id, image_id, tag_name, category)
image_approvals (id, image_id, status, client_approved_at)

-- Portfolio Management
portfolio_images (id, user_id, image_id, category, tags, 
                 position, published_at)

-- Client Albums & Sharing
client_albums (id, show_id, user_id, created_at)
client_album_links (id, album_id, token, expiration_date, 
                   allow_download, created_at, accessed_count)
client_feedback (id, link_id, rating, feedback_text, created_at)

-- Teams (for Phase 2)
teams (id, name, owner_id, created_at)
team_members (id, team_id, user_id, role, joined_at)

-- Storage Configuration
storage_configs (id, user_id/team_id, provider_type, 
                credentials_encrypted, is_active)

-- Notifications & Reminders (for Phase 2)
notifications (id, user_id, type, content, scheduled_at, sent_at)
reminders (id, show_id, trigger_type, trigger_time, sent)
```

### 6.4 Security Considerations

**Authentication & Authorization:**
- Use Better-Auth with multi-factor authentication option
- Role-based access control (Admin, Editor, Viewer for teams)
- Session management with secure cookies

**Data Protection:**
- Encrypt storage credentials at rest
- HTTPS for all communications
- Rate limiting on API endpoints
- Input validation & sanitization

**File Security:**
- Secure file upload handling (verify file types)
- Scan uploads for malware (Phase 2)
- Secure deletion of archived files
- Access control lists for private album links

**Compliance:**
- GDPR compliance (data export, deletion)
- Terms of Service & Privacy Policy
- Secure password requirements

---

## 7. API Endpoints (MVP Scope)

### 7.1 Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me
```

### 7.2 Shows Management
```
POST   /api/shows                    # Create show
GET    /api/shows                    # List shows (with filters)
GET    /api/shows/:id                # Get show details
PUT    /api/shows/:id                # Update show
DELETE /api/shows/:id                # Delete show
PUT    /api/shows/:id/status         # Update show status
GET    /api/shows/calendar           # Calendar view data
```

### 7.3 Image Upload & Management
```
POST   /api/images/upload            # Upload images (batch)
GET    /api/shows/:id/images         # Get images for a show
PUT    /api/images/:id               # Update image metadata
PUT    /api/images/:id/tags          # Add/update tags
DELETE /api/images/:id               # Delete image
POST   /api/images/:id/approve       # Mark for portfolio
```

### 7.4 Portfolio Management
```
GET    /api/portfolio                # Get portfolio images
PUT    /api/portfolio/organize       # Reorder/organize
GET    /api/portfolio/categories     # Get categories/tags
POST   /api/portfolio/publish        # Publish to public portfolio
DELETE /api/portfolio/:id            # Archive from portfolio
```

### 7.5 Client Albums & Sharing
```
POST   /api/albums                   # Create album from show
GET    /api/albums/:id               # Get album details
POST   /api/albums/:id/links         # Generate share link
GET    /api/albums/links/:token      # Access album (public)
PUT    /api/albums/links/:token/rating  # Submit rating/feedback
GET    /api/albums/links/:token/images  # Get album images
POST   /api/albums/links/:token/download # Batch download
```

### 7.6 Portfolio Website
```
GET    /api/portfolio/public/:subdomain  # Get public portfolio data
GET    /:subdomain                       # Serve portfolio page (public)
PUT    /api/portfolio/settings          # Update portfolio customization
GET    /api/portfolio/settings          # Get portfolio settings
```

### 7.7 Storage Configuration
```
POST   /api/storage/config           # Set storage configuration
GET    /api/storage/config           # Get current config
POST   /api/storage/test             # Test connection
DELETE /api/storage/config           # Remove storage
GET    /api/storage/usage            # Get storage usage stats
```

### 7.8 Admin & Settings
```
GET    /api/settings                 # Get user/team settings
PUT    /api/settings                 # Update settings
GET    /api/notifications            # Get notifications (Phase 2)
```

---

## 8. UI/UX Considerations

### 8.1 Core User Interfaces

**Dashboard/Home:**
- Welcome section with quick actions
- Upcoming shows widget (next 7 days)
- Recent portfolio additions
- Quick stats (shows this month, portfolio images, etc.)

**Calendar View:**
- Month/week/day view options
- Show details on click
- Color-coded by status (Pending/Confirmed/Completed)
- Drag-to-reschedule (optional for Phase 2)

**Show Details Page:**
- All show information in editable form
- Linked images gallery
- Status timeline
- Team members assigned (if applicable)
- Action buttons (Edit, Delete, Upload Images, Create Album)

**Image Gallery/Review:**
- Thumbnail grid with infinite scroll
- Multi-select for bulk tagging
- Lightbox view for detailed inspection
- Quick filter by status (For Portfolio / Archive / All)
- Search by tags/metadata

**Portfolio Customization:**
- Theme selector with preview
- Color picker (primary/accent)
- Logo & bio editor
- Social media input fields
- Live preview of subdomain

**Client Album Page (Public):**
- Clean, distraction-free gallery
- Image count display
- Download buttons (individual or batch)
- Rating/feedback form at bottom
- No header/navigation (minimal UI)

### 8.2 Responsive Design
- Mobile-first approach
- Touch-friendly controls
- Swipe gestures for gallery navigation
- Optimized image sizes for different devices

### 8.3 Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Alt text for all images
- Clear visual hierarchy
- Sufficient color contrast

---

## 9. Success Metrics & KPIs

### 9.1 Engagement Metrics
- **Daily Active Users (DAU):** Target 30% of monthly active users
- **Weekly Active Users (WAU):** Target 60% of monthly active users
- **Show Creation Rate:** Average 3 shows per photographer per month
- **Portfolio Updates:** 80%+ of active users update portfolio monthly
- **Album Sharing:** 100% of completed shows have at least 1 shared album link

### 9.2 Retention Metrics
- **Monthly Active Retention:** 70%+ (return in next month)
- **Churn Rate:** <5% per month
- **Feature Adoption:** 90% using at least 3 core features

### 9.3 Business Metrics
- **User Acquisition Cost (UAC):** <$30 per photographer
- **Lifetime Value (LTV):** Target >$500 per user
- **Monthly Recurring Revenue (MRR):** Projected based on plan tiers

### 9.4 Quality Metrics
- **API Uptime:** 99.9%
- **Page Load Time:** <2 seconds on average
- **Image Processing Time:** <10 seconds for batch upload
- **Bug Report Rate:** <1 critical bug per 1000 MAU

---

## 10. Implementation Timeline & Roadmap

### Phase 1: MVP (Weeks 1-12)

**Sprint 1-2: Foundation & Authentication**
- User registration & login system
- Database setup & schema
- Basic project scaffolding
- Storage credential encryption

**Sprint 3-4: Show Management**
- Create/edit/delete shows
- Calendar view implementation
- Show status workflow
- Notifications setup (scheduled for Phase 2 sending)

**Sprint 5-6: Image Upload & Storage**
- Image upload UI & validation
- Multi-storage backend integration (Google Drive, S3/R2)
- Image organization & tagging
- Gallery grid display

**Sprint 7-8: Portfolio & Client Approval**
- Portfolio gallery interface
- Image selection & categorization
- Client approval workflow
- Email link generation for approvals (mock Phase 2)

**Sprint 9-10: Client Album & Sharing**
- Private album link generation
- Expiration date logic
- Client gallery interface (public)
- Download & feedback features

**Sprint 11-12: Public Portfolio Website**
- Portfolio theme customization
- Subdomain routing setup
- Public portfolio page rendering
- SEO basics (meta tags, sitemap)

### Phase 2: Enhancement & Scaling (Post-MVP)
- Advanced team collaboration
- Equipment management
- Analytics & reporting
- Advanced customization (custom domains, design builder)
- Email notification system
- Mobile app
- Advanced storage integrations (NAS, SFTP, B2)
- Password-protected links & watermarking

---

## 11. Risks & Mitigation

### 11.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Multi-storage integration complexity | High | High | Use mature libraries (AWS SDK, googleapis), extensive testing |
| Large file upload handling | Medium | High | Implement chunked uploads, progress tracking, retry logic |
| Image processing performance | Medium | Medium | Use serverless functions, queue jobs, optimize with Sharp |
| Subdomain routing at scale | Low | High | Use DNS management tools, implement caching strategy |

### 11.2 Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Low user adoption | Medium | High | Start with target audience (wedding photographers), gather feedback early |
| Feature complexity discouraging users | Medium | Medium | Simplify MVP scope, focus on core workflows, provide onboarding |
| Client confusion on album access | Medium | Medium | Clear UI, email instructions, help docs |

### 11.3 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Competing products in space | High | Medium | Focus on UX, target niche (solo photographers), build community |
| Difficulty pricing/monetizing | Medium | High | Research competitor pricing, test free/paid tiers, gather feedback |
| Storage cost overruns | Medium | Medium | Implement usage monitoring, set storage limits, optimize uploads |

---

## 12. Pricing Strategy (Phase 2 Planning)

### Recommended Model: Freemium + Tiered Subscription

**Free Tier:**
- Up to 10 shows per month
- Up to 500 portfolio images
- 5 client album links (30-day expiration)
- Google Drive storage only
- Basic portfolio website (limited customization)

**Professional Tier ($29-39/month):**
- Unlimited shows
- Unlimited portfolio images
- Unlimited client album links
- Multi-storage support (Google Drive + S3/R2)
- Advanced portfolio customization
- Priority support

**Team Tier ($79-99/month):**
- Everything in Professional
- Up to 5 team members
- Shared storage & resources
- Team collaboration features
- Advanced analytics

---

## 13. Dependencies & Assumptions

### 13.1 External Dependencies
- Google Drive API availability and rate limits
- AWS S3/Cloudflare R2 service reliability
- Subdomain DNS configuration (for public portfolio)
- Email service for notifications (Phase 2)

### 13.2 Assumptions
- Photographers have existing cloud storage accounts (Google Drive, AWS, etc.)
- Client albums will be accessed primarily on desktop (mobile optimization Phase 2)
- Initial user base will be 100-500 photographers (for pricing discussion)
- Storage will scale with user growth (need monitoring & scaling plan)

---

## 14. Open Questions & Decisions Pending

1. **Notification Delivery:** SMS vs Email for reminders in Phase 2?
2. **Image Processing:** Automatic thumbnail generation size/quality standards?
3. **Client Feedback:** Simple rating vs detailed comments? Both or either?
4. **Pricing:** Freemium or pure paid subscription? Subscription duration (monthly/annual)?
5. **Support:** In-app chat, email support, or community forum?
6. **Branding:** White-label option for agencies?
7. **Payment Processing:** Stripe, Paddle, or other gateway?

---

## 15. Glossary

- **Show:** Photography session/booking (wedding, portrait session, etc.)
- **Portfolio:** Collection of best/selected images displayed publicly
- **Album Link:** Secure, shareable link for client to access their photos
- **Expiration Date:** Date after which an album link becomes inaccessible
- **Subdomain:** Custom URL like `photographername.yourplatform.com`
- **Cloud Storage:** External storage service (Google Drive, S3, R2, NAS)
- **EXIF Data:** Metadata embedded in image files (camera settings, date, GPS)
- **MVP (Minimum Viable Product):** Core features needed for initial launch
- **SaaS (Software as a Service):** Cloud-based software subscription model

---

## 16. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2025 | Product Team | Initial MVP PRD |

---

## Appendix: User Flow Diagrams

### A1. Show Management Flow
```
┌─────────────────────┐
│   Create Show       │
│  (Client, Type,     │
│   Price, Date)      │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │   Pending    │
    │   Status     │
    └──────┬───────┘
           │
    ┌──────▼──────────┐
    │ Set Reminders:  │
    │ • 1 day before  │
    │ • 1 hour before │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │  Show Date      │
    │  Photographer   │
    │  Updates Status │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │  Completed      │
    │  Status         │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Upload Images   │
    │ (Batch or       │
    │  Gradual)       │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Review & Tag    │
    │ Images          │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Client Approves │
    │ Images          │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Generate Album  │
    │ Link            │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Delivered       │
    │ Status          │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Portfolio Auto  │
    │ Publish         │
    └──────────────────┘
```

### A2. Portfolio Publishing Flow
```
┌──────────────────┐
│  Photographer    │
│  Reviews Images  │
└────────┬─────────┘
         │
    ┌────▼────┐
    │ Select  │
    │ Portfolio
    │ Images  │
    └────┬────┘
         │
    ┌────▼──────────┐
    │ Add Tags &    │
    │ Categories    │
    └────┬──────────┘
         │
    ┌────▼──────────────┐
    │ Generate Client   │
    │ Approval Link     │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Client Reviews &  │
    │ Approves          │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Approved Images   │
    │ Auto-Publish to   │
    │ Portfolio         │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Appear on Public  │
    │ Portfolio Site    │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Organized by      │
    │ Category/Tags     │
    └──────────────────┘
```

---

**End of Document**
