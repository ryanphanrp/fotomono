# Phase 5: Client Albums & Sharing - Task Tracker

**Status:** 🚧 In Progress
**Branch:** `claude/phase5-client-albums-011CV16xQkYWQby4NcBXW764`
**Started:** 2025-11-14

---

## Phase 5 Overview

Build a complete client album delivery system with secure shareable links, download functionality, and client feedback collection.

### Key Features
- ✅ Create albums from shows
- ✅ Add/remove images to albums
- ✅ Generate secure shareable links with expiration
- ✅ Download permissions (enable/disable)
- ✅ Public client gallery (no login required)
- ✅ Client feedback & rating system
- ✅ Batch download as ZIP

---

## 5.1 Client Album Backend

- [ ] **Task 5.1.1:** Create album service with CRUD operations
  - Create album from show
  - Get album by ID with images
  - Update album details (name, description)
  - Delete album
  - Add/remove images to album
  - Reorder images in album
  - **Location:** `packages/api/src/services/albumService.ts`

- [ ] **Task 5.1.2:** Create tRPC procedures for albums
  - `albums.create` - Create album from show
  - `albums.list` - List all albums for user
  - `albums.getById` - Get album details with images
  - `albums.update` - Update album name/description
  - `albums.delete` - Delete album
  - `albums.addImages` - Add images to album
  - `albums.removeImages` - Remove images from album
  - `albums.reorderImages` - Change image order
  - **Location:** `packages/api/src/routers/albums.ts`

- [ ] **Task 5.1.3:** Create Zod schemas for albums
  - createAlbumSchema
  - updateAlbumSchema
  - addImagesToAlbumSchema
  - removeImagesFromAlbumSchema
  - reorderAlbumImagesSchema
  - **Location:** `packages/api/src/schemas/album.ts`

---

## 5.2 Shareable Link System

- [ ] **Task 5.2.1:** Create album link service
  - Generate secure token (nanoid 32 chars)
  - Create link with expiration & permissions
  - Get album by token (public access)
  - Update link settings (expiration, download permission)
  - Deactivate link
  - Track access analytics (count, last accessed)
  - Check expiration logic
  - **Location:** `packages/api/src/services/albumLinkService.ts`

- [ ] **Task 5.2.2:** Create tRPC procedures for album links
  - `albumLinks.create` - Generate shareable link (protected)
  - `albumLinks.getByToken` - Access album via token (public)
  - `albumLinks.list` - List all links for album (protected)
  - `albumLinks.update` - Update link settings (protected)
  - `albumLinks.delete` - Deactivate link (protected)
  - `albumLinks.getStats` - Get access analytics (protected)
  - **Location:** `packages/api/src/routers/albumLinks.ts`

- [ ] **Task 5.2.3:** Create Zod schemas for album links
  - createAlbumLinkSchema
  - getByTokenSchema
  - updateAlbumLinkSchema
  - **Location:** `packages/api/src/schemas/albumLink.ts`

- [ ] **Task 5.2.4:** Implement download URL generation
  - Generate presigned URLs for download (if allowed)
  - Create ZIP download for batch download
  - Check download permissions before generating URLs
  - **Location:** `packages/api/src/services/albumLinkService.ts`

---

## 5.3 Client Feedback System

- [ ] **Task 5.3.1:** Create feedback service
  - Submit rating (1-5 stars)
  - Submit text feedback
  - Optional client name/email
  - Get feedback for album (photographer only)
  - **Location:** `packages/api/src/services/feedbackService.ts`

- [ ] **Task 5.3.2:** Create tRPC procedures for feedback
  - `feedback.submit` - Submit rating & feedback (public)
  - `feedback.getByAlbum` - Get feedback for album (protected)
  - **Location:** `packages/api/src/routers/feedback.ts`

- [ ] **Task 5.3.3:** Create Zod schemas for feedback
  - submitFeedbackSchema
  - getFeedbackSchema
  - **Location:** `packages/api/src/schemas/feedback.ts`

---

## 5.4 Album Management UI (Photographer)

- [ ] **Task 5.4.1:** Build Albums List page
  - List all albums with thumbnails
  - Show album stats (# images, # links, feedback count)
  - Create new album button
  - Delete album action
  - **Location:** `apps/web/src/app/dashboard/albums/page.tsx`

- [ ] **Task 5.4.2:** Build Create Album page
  - Select show dropdown
  - Album name input
  - Album description textarea
  - Select images from show (checkbox grid)
  - Create button
  - **Location:** `apps/web/src/app/dashboard/albums/new/page.tsx`

- [ ] **Task 5.4.3:** Build Album Detail page
  - Display album info (name, description, show)
  - Gallery of images in album
  - Add more images button
  - Remove images action
  - Drag-and-drop reordering
  - Generate link button
  - List of existing links
  - **Location:** `apps/web/src/app/dashboard/albums/[id]/page.tsx`

- [ ] **Task 5.4.4:** Create "Generate Link" modal
  - Set expiration date (date picker)
  - Toggle allow download checkbox
  - Generate button
  - Display generated link with copy button
  - **Location:** `apps/web/src/components/albums/GenerateLinkModal.tsx`

- [ ] **Task 5.4.5:** Build Link Management component
  - List all links for album in table
  - Show status (active/expired)
  - Show access count & last accessed
  - Edit link settings (expiration, download)
  - Deactivate link button
  - Copy link button
  - **Location:** `apps/web/src/components/albums/LinkManagement.tsx`

- [ ] **Task 5.4.6:** Build Feedback Viewer component
  - Display client ratings (stars)
  - Display feedback text
  - Show client name/email if provided
  - Filter by rating
  - **Location:** `apps/web/src/components/albums/FeedbackViewer.tsx`

---

## 5.5 Client Album UI (Public)

- [ ] **Task 5.5.1:** Build public album page
  - Access via: `/album/[token]`
  - Validate token & check expiration
  - Show expired page if link expired
  - Track access analytics
  - **Location:** `apps/web/src/app/album/[token]/page.tsx`

- [ ] **Task 5.5.2:** Create ClientGallery component
  - Clean, minimal design for client viewing
  - Responsive thumbnail grid
  - Lightbox for full-size viewing
  - Image counter (e.g., "1 of 24")
  - Navigation arrows in lightbox
  - **Location:** `apps/web/src/components/albums/ClientGallery.tsx`

- [ ] **Task 5.5.3:** Implement download functionality
  - Individual image download button
  - "Download All" button (creates ZIP)
  - Check download permission before showing buttons
  - Progress indicator for ZIP download
  - **Location:** `apps/web/src/components/albums/DownloadButtons.tsx`

- [ ] **Task 5.5.4:** Create Feedback Form component
  - Star rating selector (1-5 stars)
  - Text area for comments (optional)
  - Optional client name input
  - Optional client email input
  - Submit button
  - Thank you message after submission
  - **Location:** `apps/web/src/components/albums/ClientFeedbackForm.tsx`

- [ ] **Task 5.5.5:** Build Expired Link page
  - Friendly message explaining link expired
  - Contact photographer CTA
  - Suggest requesting new link
  - **Location:** `apps/web/src/app/album/expired/page.tsx`

---

## 5.6 Download System

- [ ] **Task 5.6.1:** Implement single image download
  - Generate presigned URL from storage provider
  - Trigger browser download
  - **Location:** `packages/api/src/services/albumLinkService.ts`

- [ ] **Task 5.6.2:** Implement batch ZIP download
  - Create ZIP archive of all images in album
  - Use streaming ZIP library (e.g., archiver, jszip)
  - Stream to client to avoid memory issues
  - Show progress indicator
  - **Location:** `packages/api/src/services/downloadService.ts`

- [ ] **Task 5.6.3:** Create download tRPC procedures
  - `download.image` - Get download URL for single image (public)
  - `download.album` - Get ZIP download stream for album (public)
  - Both check token validity and download permission
  - **Location:** `packages/api/src/routers/download.ts`

---

## 5.7 Testing & QA

- [ ] **Task 5.7.1:** Test album CRUD operations
  - Create album from show
  - Add/remove images
  - Update album details
  - Delete album

- [ ] **Task 5.7.2:** Test shareable link functionality
  - Generate link with expiration
  - Access link before expiration (should work)
  - Access link after expiration (should show expired page)
  - Test download permission toggle

- [ ] **Task 5.7.3:** Test client gallery
  - View images in grid
  - Open lightbox
  - Navigate between images
  - Download single image
  - Download all as ZIP

- [ ] **Task 5.7.4:** Test feedback system
  - Submit rating & feedback
  - View feedback in photographer dashboard
  - Test optional client info fields

- [ ] **Task 5.7.5:** Test analytics tracking
  - Verify access count increments
  - Verify last accessed timestamp updates

---

## Phase 5 Deliverables

- [ ] Client album creation & management
- [ ] Secure shareable links with expiration
- [ ] Download permissions (enable/disable)
- [ ] Public client gallery (no login)
- [ ] Client feedback & rating system
- [ ] Single image download
- [ ] Batch download as ZIP
- [ ] Access analytics tracking
- [ ] Link management (edit, deactivate)

---

## Database Schema (Already Exists)

✅ **clientAlbum** - Album details (name, description, showId, userId)
✅ **clientAlbumImage** - Junction table (albumId, imageId, position)
✅ **clientAlbumLink** - Shareable links (token, expiration, permissions, analytics)
✅ **clientFeedback** - Client ratings & feedback (linkId, rating, feedback, client info)

---

## Architecture Notes

### Backend Services
1. **AlbumService** - Album CRUD, image management
2. **AlbumLinkService** - Link generation, token validation, access tracking
3. **FeedbackService** - Feedback submission & retrieval
4. **DownloadService** - Single & batch download functionality

### Frontend Pages
1. **Photographer Dashboard:**
   - `/dashboard/albums` - List albums
   - `/dashboard/albums/new` - Create album
   - `/dashboard/albums/[id]` - Album details & management

2. **Public Client Access:**
   - `/album/[token]` - Public gallery
   - `/album/expired` - Expired link message

### Key Features
- **Token-based access** - No login required for clients
- **Expiration management** - Automatic expiration checking
- **Download control** - Per-link download permissions
- **Analytics** - Track access count & last accessed time
- **Feedback collection** - Optional client ratings & comments

---

## Implementation Strategy

### Phase 5A: Backend Foundation (Tasks 5.1-5.3)
1. Create album service & tRPC procedures
2. Create album link service with token generation
3. Create feedback service
4. Register all routers in main tRPC router

### Phase 5B: Photographer UI (Task 5.4)
1. Build album list & create pages
2. Build album detail page with link management
3. Build feedback viewer

### Phase 5C: Client Gallery (Task 5.5)
1. Build public album page with token validation
2. Create client gallery component with lightbox
3. Implement feedback form

### Phase 5D: Downloads (Task 5.6)
1. Implement single image download
2. Implement ZIP batch download
3. Wire up download buttons

### Phase 5E: Testing & Polish (Task 5.7)
1. Manual testing of all workflows
2. Edge case testing (expired links, invalid tokens)
3. Performance testing (large albums, ZIP downloads)

---

**Next Steps:**
1. Implement backend services (albumService, albumLinkService, feedbackService)
2. Create tRPC procedures and Zod schemas
3. Build photographer dashboard UI
4. Build public client gallery
5. Implement download functionality
6. Test and polish

---

**Last Updated:** 2025-11-14
