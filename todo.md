# Mareb Insurance Website - TODO

## Design System & Styling
- [x] Configure Tailwind with Navy Blue (#0A1F3D) and Gold (#C8A23A) color scheme
- [x] Set up Arabic font support (Google Fonts)
- [x] Create global styles and CSS variables
- [x] Configure RTL support for Arabic language

## Navigation & Layout
- [x] Build sticky navigation bar (90px height) with shadow on scroll
- [x] Implement mega menu dropdown system for main navigation
- [x] Add language toggle switch (AR/EN)
- [x] Create responsive mobile menu

## Home Page Sections
- [x] Hero section with full-screen image slider (3 images) and CTA button
- [x] Company overview section (two-column layout with image)
- [x] "Why Choose Us" section with 4-column grid and icons
- [x] Insurance types showcase (3-column grid with cards)
- [x] Statistics counter section with animated numbers
- [x] Partners carousel with hover effects
- [x] Branch locations grid with cards
- [x] Latest news and events section (3 cards)
- [x] Footer with 4 columns (logo, quick links, insurance types, contact info)

## Internal Pages
- [x] About Us page (من نحن)
- [ ] Chairman of the Board page (رئيس مجلس الإدارة)
- [ ] Vision page (الرؤية)
- [ ] Mission page (الرسالة)
- [ ] Goals page (الأهداف)
- [ ] Organizational Structure page with hierarchical layout
- [ ] Branches page (فروع الشركة)
- [ ] Team page (فريق العمل)
- [ ] Privacy Policy page
- [ ] Cookie Policy page

## Insurance Types Pages
- [x] Health Insurance page (التأمين الصحي)
- [x] Car Insurance page (تأمين السيارات)
- [x] Marine Insurance page (التأمين البحري)
- [x] Engineering Insurance page (التأمين الهندسي)
- [x] Energy Insurance page (تأمين الطاقة)
- [x] Islamic Takaful Insurance page (التأمين التكافلي الإسلامي)

## Partners Section
- [ ] Reinsurers page (معيدي التأمين)
- [ ] Insurance Brokers page (وسطاء التأمين)
- [ ] Success Partners page (شركاء النجاح)

## Media Center
- [ ] Photo Gallery with albums and lightbox
- [ ] Video Gallery with thumbnails and player
- [ ] Conferences & Participations page
- [ ] Events page
- [ ] News page with pagination

## Contact & Maps
- [x] Contact form with validation (name, email, phone, subject, message type, message)
- [x] Google Maps integration for branch locations
- [x] Contact information display

## Bilingual Support
- [x] Create translation context/hook for AR/EN switching
- [x] Add all Arabic translations
- [x] Add all English translations
- [x] Implement language persistence (localStorage)

## Interactive Features
- [x] Smooth scroll animations (fade up on scroll)
- [x] Image slider with autoplay
- [x] Animated statistics counters
- [x] Hover effects on cards and buttons
- [ ] Lightbox for image galleries
- [x] Form validation with success animation

## Testing & Optimization
- [x] Test all navigation and links
- [x] Verify responsive design on mobile/tablet/desktop
- [x] Test language switching functionality
- [x] Validate form functionality
- [x] Check Google Maps integration
- [x] Optimize images and assets
- [x] Test cross-browser compatibility

## Logo Integration
- [x] Upload company logo to public assets
- [x] Add logo to navigation bar
- [x] Add logo to footer
- [x] Ensure logo displays correctly on mobile

## Admin Control Panel - Dynamic CMS
- [x] Design database schema for all content types
- [x] Create admin authentication and role-based access
- [x] Build admin dashboard layout with sidebar navigation
- [x] Hero slider management (add/edit/delete slides)
- [x] About section content editor
- [x] Why Us section management (features with icons)
- [x] Insurance types CRUD (create/read/update/delete)
- [x] Statistics counter management
- [x] Partners management with logo upload
- [x] Branch locations CRUD with map integration
- [x] News and events management
- [x] Contact form submissions viewer
- [x] Company settings (contact info, social media)
- [ ] Media library for image uploads
- [ ] Update frontend to fetch from database
- [x] Seed initial data from current static content

## Image Upload & Frontend-Backend Integration

- [ ] Image upload endpoint (POST /api/upload) using S3 storage
- [ ] ImageUpload React component for admin CMS
- [ ] Update all admin pages to use ImageUpload instead of URL input
- [ ] Public API procedures for all content sections
- [ ] Connect Home page hero slides to backend
- [ ] Connect Home page insurance types to backend
- [ ] Connect Home page statistics to backend
- [ ] Connect Home page partners to backend
- [ ] Connect Home page news/events to backend
- [ ] Connect Home page why-us section to backend
- [ ] Connect About page to backend
- [ ] Connect Branches page to backend

## Bug Fixes
- [x] Fix Arabic text stored as ??? in database (charset utf8mb4)
- [x] Fix image upload not working from admin CMS
- [ ] Fix 404 on internal pages - SPA routing on Namecheap
- [ ] Add dynamic pages system (chairman, vision, mission, goals, structure, team, privacy, cookies, partners pages, media pages)
- [ ] Add pages admin CRUD in CMS
- [ ] Connect all navigation links to dynamic pages
