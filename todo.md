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
- [ ] Make BranchesSection fully dynamic from API
- [ ] Make Footer dynamic (social media links from siteSettings)
- [ ] Make InsuranceTypes page fully dynamic from API

## Bug Fixes - Round 2
- [x] Fix insurance types dropdown showing only 6 instead of all 12 (now fetches dynamically from DB)
- [x] Hide dynamic pages with no content from navigation menu (filter by pagesWithContentSlugs)
- [x] Fix footer links not scrolling to top of page when clicked
- [x] Fix nested anchor tag in AdminLayout.tsx
- [x] Fix contact form - was simulating submission, now saves to database via trpc.content.submitContact
- [x] Add content for Vision, Mission, Goals, and Who We Are dynamic pages
- [x] Fix Navigation.tsx slugs to use about/ prefix matching database slugs
- [x] Update contact page map to show Aden location (Madinat Inma, Al-Qasr Hotel area)
- [x] Update contact page phone to Aden numbers (+967 02 362 317/318/319)
- [x] Update address in site_settings and branches table to Madinat Inma, Aden
- [x] Replace logo with new transparent PNG (logo-new.png) across all pages
- [x] Update favicon.ico and apple-touch-icon with new logo
- [x] Update page title to مأرب للتأمين | Mareb Insurance Company

## Content Population - Round 1
- [x] Seed all company content from uploaded document (تعريف-نبذهعنالشركةبعدالتعديل.doc)
- [x] Add 3 branch managers to team: رمزي أحمد البناء، عبدالعفار شجاع، عبدالعزيز بازارا
- [x] Add 5 shareholders/partners with percentages (البنك اليمني 53.37%, الأسودي 10.50%, العديني 8.75%, هائل سعيد 5.50%, أفراد 21.88%)
- [x] Add 16 insurance types with full Arabic descriptions and details
- [x] Update dynamic pages: الرؤية، الرسالة، الأهداف، من نحن، رئيس مجلس الإدارة
- [x] Add dedicated ShareholdersPage showing partners with percentage badges
- [x] Add shareholders route /partners/shareholders to Navigation and App.tsx

## Performance & Image Optimization - Round 1
- [x] Add professional images for all 16 insurance types via S3 upload
- [x] Add board of directors image to chairman dynamic page
- [x] Add lazy loading (loading="lazy") to all public-facing images
- [x] Add code splitting (manualChunks) in vite.config.ts for vendor bundles
- [x] Convert all page imports to lazy() in App.tsx for faster initial load

## Performance & Theme - Round 2
- [ ] Self-host Cairo font (remove Google Fonts external request)
- [ ] Add font-display: swap to font loading
- [ ] Add preload hints for critical assets
- [ ] Optimize hero images: use WebP format, add width/height attributes
- [ ] Add explicit image dimensions to prevent layout shift (CLS)
- [ ] Defer non-critical JavaScript
- [ ] Add meta description and OG tags for SEO
- [ ] Compress/minify CSS further (remove unused dark mode styles)
- [ ] Fix Namecheap contact form: verify dist/index.js includes contentRouter

## Theme Changes - Navigation & Footer
- [x] Change Navigation from dark navy to beige/cream background with navy text
- [x] Change Footer from dark navy to beige/cream background with navy text

## Performance Optimization - PageSpeed 50 → 80+
- [x] Fix LCP: Replace Unsplash hero images with optimized CDN WebP images (135KB→44KB, 99KB→31KB)
- [x] Fix TBT: Add React.lazy() for all below-fold home page sections
- [x] Fix FCP: Preload first hero image in index.html
- [x] Add preconnect to CDN for faster resource loading

## Performance Optimization - PageSpeed 70 → 90+
- [x] Fix LCP: LQIP blur-up + responsive srcset + CSS gradient fallback for instant paint
- [x] Fix TBT: index.js split from 560KB → 120KB (78% smaller) with smart manualChunks
- [x] Fix TBT: Admin pages separated into own chunk (308KB) - not loaded on public pages
- [x] Inline critical body/root CSS to prevent FOUC
- [x] Reduce font weights from 5 to 3 (400, 600, 700) with unicode-range

## Bug Fix - Admin Login
- [x] Auto-create default admin account on server startup if none exists

## Feature - Email Notification on Contact Form
- [x] Send email to website@myicyemen.com when contact form is submitted

## Updates - v18
- [ ] Change contact page email to info@myicyemen.com
- [ ] Build Namecheap v18 package
- [ ] Push to GitHub
