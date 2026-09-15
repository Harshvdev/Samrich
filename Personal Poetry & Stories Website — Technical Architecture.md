# Personal Poetry & Stories Website
## Technical Architecture & Project Specification

### 1. Project Description

A personal publishing website where an author can publish and manage:

- Poems
- Stories
- Embedded YouTube videos associated with posts
- Author information/about content

Visitors can read the published content without creating an account.

The author has a private admin area where they can:

- Create posts
- Edit posts
- Save drafts
- Publish/unpublish posts
- Delete posts
- Assign categories
- Add tags
- Add YouTube videos
- Moderate comments
- View basic content information

The website should feel like a **modern digital literary publication/personal anthology**, not a generic blog or SaaS dashboard.

The design priorities are:

1. Mobile-first
2. Fast loading
3. Excellent typography and readability
4. Artistic visual identity
5. Minimal but meaningful animation
6. Excellent accessibility
7. SEO-friendly public pages
8. Simple author workflow
9. Zero unnecessary infrastructure
10. Free/low-cost architecture suitable for a personal project

---

# 2. Technology Stack

## Frontend / Application

### Next.js
Use the latest stable Next.js version available at implementation time, using:

- App Router
- React Server Components by default
- Server Actions where appropriate
- Route Handlers where an HTTP endpoint is genuinely needed
- Static generation/caching for public content wherever possible

Next.js is responsible for:

- Routing
- Page rendering
- SEO metadata
- Public content pages
- Admin UI
- Server-side data fetching
- Server-side authorization checks
- YouTube embed rendering
- API/server functionality where necessary

### TypeScript

Use TypeScript throughout the entire project.

No JavaScript-only application code unless a dependency requires it.

---

# 3. Styling and UI

## Tailwind CSS

Use Tailwind CSS as the primary styling system.

Do not create a giant custom CSS framework.

Use:

- design tokens
- utility classes
- reusable component styles
- responsive breakpoints
- CSS variables for theme values

The public site should not look like a stock Tailwind website.

---

## shadcn/ui

Use shadcn/ui selectively.

It should mainly provide functional UI primitives such as:

- Dialog
- Dropdown Menu
- Sheet
- Select
- Tabs
- Tooltip
- Toast
- Form-related components
- Confirmation dialogs

Do **not** blindly use shadcn components for the entire public-facing design.

The public literary interface should have a custom visual identity.

---

## Motion

Use the `motion` package for React animations.

Primary uses:

- page transitions
- content reveal
- staggered card appearance
- hover/tap feedback
- navigation transitions
- subtle layout animation
- scroll-based reveal where appropriate

Animation philosophy:

> Motion should make the interface feel alive, not distract from the writing.

Avoid:

- constant background animation
- excessive parallax
- animation on every element
- expensive WebGL effects
- large animation libraries beyond what is needed

Prefer CSS transitions for trivial effects and Motion only when JavaScript-driven animation adds real value.

---

# 4. Content Editor

## Tiptap

Use Tiptap as the authoring editor for poems and stories.

The editor should support at minimum:

- Paragraphs
- Headings
- Bold
- Italic
- Links
- Blockquotes
- Text alignment where useful
- Hard line breaks
- Horizontal separators
- YouTube embeds
- Basic inline formatting

The editor must preserve poetic line structure.

Poetry should not be treated as ordinary paragraphs.

For example:

```text
The moon was bright
and the road was silent
while I walked alone
```

must remain visually separated when rendered.

Do not flatten poetry into a single paragraph.

---

# 5. Backend

## Supabase

Supabase will provide:

### PostgreSQL

Store application data:

- Posts
- Categories
- Tags
- Post/tag relationships
- Comments
- Likes
- Author profile
- Site settings
- Admin-related data where required

### Authentication

Use Supabase Auth for the author's private admin login.

There is no requirement for public reader accounts in the initial architecture.

---

# 6. Media Strategy

## Videos

Videos are **not stored in Supabase**.

The author uploads videos to YouTube.

The website stores the YouTube video reference and embeds the video on the relevant post.

Example:

```text
Author
  ↓
YouTube upload
  ↓
Copy YouTube URL
  ↓
Admin panel
  ↓
Paste YouTube URL
  ↓
System extracts video ID
  ↓
Database stores video reference
  ↓
Public post renders YouTube player
```

Store the normalized YouTube video ID rather than relying entirely on an arbitrary URL string.

Example database value:

```text
youtube_video_id = "dQw4w9WgXcQ"
```

Public rendering:

```text
https://www.youtube.com/embed/dQw4w9WgXcQ
```

Do not proxy YouTube video data through the application.

---

## Images

The image-upload feature is explicitly **out of scope for the first version**.

Do not implement:

- Supabase image storage
- Cloudflare R2
- Backblaze B2
- image upload UI
- image processing pipeline

The architecture should remain extensible so image support can be added later without restructuring the entire application.

For the current version, visual content can come from:

- YouTube embeds
- static site assets controlled by the developer
- externally hosted content later, if required

---

# 7. User Types

## Public Visitor

Can:

- Browse published posts
- Read poems
- Read stories
- Search content
- Filter by category/tag
- Like content
- Comment
- Share content
- View author/about page
- Watch embedded YouTube videos

Cannot:

- Access admin pages
- Create/edit/delete posts
- Publish content
- Manage comments

No public login is required initially.

---

## Administrator / Author

Can:

- Log in
- Access dashboard
- Create posts
- Edit posts
- Delete posts
- Save drafts
- Publish/unpublish posts
- Assign categories
- Manage tags
- Add YouTube videos
- Manage comments
- Manage profile/about information

There should be exactly one primary author/admin initially.

The database structure should still avoid hard-coding a single-user assumption wherever practical.

---

# 8. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │        Vercel        │
                         │                      │
                         │      Next.js App     │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼──────────────────┐
                  │                 │                  │
                  ▼                 ▼                  ▼
           Public Website      Admin Dashboard    Server Logic
                  │                 │                  │
                  └─────────────────┼──────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Supabase       │
                         ├──────────────────────┤
                         │ PostgreSQL           │
                         │ Auth                 │
                         │ Row Level Security   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                            Application Data

                    YouTube
                       │
                       │ video ID / embed
                       ▼
                  Public Post Page
```

---

# 9. Repository Structure

Recommended repository:

```text
poetry-site/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── poems/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── stories/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── tags/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── comments/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── tags/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   └── ...only when needed
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── public/
│   ├── admin/
│   ├── editor/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── posts/
│   ├── comments/
│   ├── youtube/
│   ├── search/
│   ├── auth/
│   ├── validation/
│   └── utils/
│
├── actions/
│   ├── posts.ts
│   ├── comments.ts
│   ├── categories.ts
│   ├── tags.ts
│   └── profile.ts
│
├── types/
│   ├── database.ts
│   ├── post.ts
│   └── editor.ts
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── public/
│   ├── fonts/
│   ├── icons/
│   └── static/
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

The exact structure can evolve, but the separation between public UI, admin UI, data access, server actions, and shared components should remain.

---

# 10. Database Architecture

## `profiles`

Stores author information.

Suggested fields:

```text
id
user_id
display_name
slug
bio
avatar_url
social_links
created_at
updated_at
```

`user_id` references the Supabase Auth user.

---

## `posts`

Core content table.

```text
id
title
slug
excerpt
content
type
status
cover_url              nullable
published_at           nullable
created_at
updated_at
created_by
```

### `type`

Allowed values:

```text
poem
story
```

### `status`

Allowed values:

```text
draft
published
```

Potential future values:

```text
archived
```

but do not add unnecessary states initially.

---

# 11. Categories

Use a dedicated category table.

## `categories`

```text
id
name
slug
description
created_at
```

Examples:

```text
Poems
Stories
```

Even though type and category overlap initially, keeping category support separate gives flexibility later.

However, if the product is intentionally simple, the `type` field can be used as the primary category and an independent category system introduced only when needed.

Recommended initial approach:

```text
type = poem | story
```

and add custom categories later.

---

# 12. Tags

## `tags`

```text
id
name
slug
```

## `post_tags`

Many-to-many relationship:

```text
post_id
tag_id
```

Example:

```text
Post: "Rain"

Tags:
poetry
rain
loneliness
monsoon
```

Tags enable:

- filtering
- discovery
- related content
- search refinement

---

# 13. Comments

## `comments`

```text
id
post_id
author_name
author_email
content
status
created_at
updated_at
```

Recommended status values:

```text
pending
approved
rejected
```

### Comment flow

```text
Visitor submits comment
        ↓
status = pending
        ↓
Admin reviews
        ↓
Approve
        ↓
status = approved
        ↓
Visible publicly
```

This prevents spam and inappropriate content from being automatically displayed.

No public account is required.

---

# 14. Likes

## `likes`

```text
id
post_id
visitor_identifier
created_at
```

Do not create a fake "infinite likes" system purely through a simple increment counter.

The exact anti-abuse strategy can be implemented later depending on requirements.

For the MVP:

- one like per browser/device/session strategy
- server-side validation
- rate limiting where practical

Do not pretend anonymous likes can be perfectly abuse-proof.

---

# 15. YouTube Videos

A post can have zero or more associated video embeds.

Recommended table:

## `post_videos`

```text
id
post_id
youtube_video_id
title
sort_order
created_at
```

This is preferable to storing only one `youtube_url` in `posts`, because it allows:

```text
Story
 ├── Video 1
 ├── Video 2
 └── Video 3
```

The author can add multiple videos to a story if needed.

---

# 16. Content Representation

Tiptap content should be stored in a structured format rather than storing only arbitrary raw HTML.

Recommended:

```text
posts.content
```

stores the Tiptap JSON document.

Conceptually:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": []
    }
  ]
}
```

Benefits:

- structured content
- safer rendering
- predictable formatting
- easier future transformations
- easier custom components
- easier migration

Public rendering should use a controlled Tiptap renderer, not raw `dangerouslySetInnerHTML` wherever avoidable.

---

# 17. URL Architecture

Public URLs should be clean and human-readable.

Examples:

```text
/
├── /poems
├── /poems/the-last-rain
├── /stories
├── /stories/the-house-at-dusk
├── /tags/love
├── /search
└── /about
```

Admin URLs:

```text
/admin/login
/admin/dashboard
/admin/posts
/admin/posts/new
/admin/posts/:id/edit
/admin/comments
/admin/tags
/admin/profile
```

Use slugs instead of database IDs in public URLs.

---

# 18. Homepage Architecture

The homepage should not simply be a chronological database dump.

Recommended structure:

```text
Header
    ↓
Hero / author identity
    ↓
Featured piece
    ↓
Latest poems
    ↓
Latest stories
    ↓
Selected/featured content
    ↓
About preview
    ↓
Footer
```

The exact composition can change during visual design.

The homepage should prioritize:

- title
- typography
- reading
- discovery
- visual hierarchy

not UI controls.

---

# 19. Post Page Architecture

A poem page:

```text
Breadcrumb / category
        ↓
Title
        ↓
Published date
        ↓
Tags
        ↓
Poem content
        ↓
Optional YouTube embed
        ↓
Like
        ↓
Comments
        ↓
Related poems
```

A story page follows the same basic structure but should optimize the reading width for long-form content.

---

# 20. Typography

Typography is a major part of the product.

Use:

- one display/editorial typeface
- one highly readable body typeface
- strong hierarchy
- generous line height
- carefully controlled reading width

For long-form content, avoid full-width paragraphs.

Recommended reading width:

```text
~60–75 characters per line
```

The goal is comfortable reading on both mobile and desktop.

---

# 21. Responsive Design

The implementation should be **mobile-first**, not desktop-first.

Primary target:

```text
360–430px phones
```

Then adapt upward:

```text
640px
768px
1024px
1280px+
```

Mobile priorities:

- large touch targets
- compact header
- easy navigation
- comfortable reading width
- no horizontal scrolling
- efficient images/assets
- minimal client-side JavaScript

Desktop can introduce:

- larger editorial layouts
- multi-column sections
- larger hero composition
- hover interactions
- expanded navigation

Do not let desktop design dictate the mobile layout.

---

# 22. Navigation

Mobile:

```text
Logo / Author Name
Menu button
```

Menu opens as a sheet/drawer.

Likely routes:

```text
Home
Poems
Stories
About
Search
```

Desktop:

```text
Author Name                    Home  Poems  Stories  About  Search
```

The header should remain visually lightweight.

---

# 23. Search

Initial implementation:

Search across:

- post title
- excerpt
- content
- tags

Do not introduce an external search engine initially.

Supabase/PostgreSQL is sufficient for a small personal site.

Search should be optimized around the actual expected content volume rather than prematurely implementing Algolia, Elasticsearch, Meilisearch, etc.

If the content grows substantially, search can be upgraded later.

---

# 24. SEO

Every public post should generate:

- `<title>`
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X card metadata
- structured data where appropriate

For poems/stories, use appropriate schema markup where useful.

Generate:

```text
/sitemap.xml
/robots.txt
```

Automatically.

Use clean semantic HTML:

```text
<header>
<main>
<article>
<section>
<footer>
```

---

# 25. Social Sharing

Each post should have a shareable canonical URL.

Initial sharing options can use the platform's native/web share capability rather than integrating multiple third-party SDKs.

On mobile:

```text
Share
```

can invoke the browser/device share sheet when supported.

Fallback:

- copy link

This keeps the implementation lightweight.

---

# 26. Admin Dashboard

The dashboard should be extremely simple because the author is not supposed to manage technical infrastructure.

Dashboard:

```text
┌──────────────────────────────────┐
│ Dashboard                        │
│                                  │
│ Published      Drafts            │
│    18             4              │
│                                  │
│ Recent Posts                     │
│ ───────────────────────────────  │
│ The Last Rain      Published     │
│ Evening           Draft          │
│                                  │
│              + New Post          │
└──────────────────────────────────┘
```

Avoid unnecessary analytics initially.

The author's primary workflow is:

```text
Create → Write → Save Draft → Preview → Publish
```

---

# 27. Admin Post Editor

Structure:

```text
New Post
│
├── Title
├── Type
│    ├── Poem
│    └── Story
│
├── Slug
├── Excerpt
├── Tiptap Editor
├── Tags
├── YouTube Videos
├── SEO settings
└── Publication controls
      ├── Save Draft
      ├── Preview
      └── Publish
```

Autosave can be added after the basic flow is stable.

Do not make autosave more complicated than necessary initially.

---

# 28. Preview

The author should be able to preview a draft as a real post before publishing.

Preferred approach:

```text
Draft stored in database
        ↓
Preview route
        ↓
Same public renderer
        ↓
No need to duplicate presentation logic
```

This is important.

The preview should use the exact same content rendering components as the public page.

---

# 29. Authentication

Use Supabase Auth.

Recommended initial flow:

```text
/admin/login
     ↓
Email/password or chosen secure auth method
     ↓
Supabase Auth
     ↓
Authenticated session
     ↓
Admin dashboard
```

Protect `/admin/*`.

Never rely only on frontend route hiding.

Authorization must be validated server-side.

---

# 30. Authorization

All mutations must verify that the authenticated user has admin privileges.

Examples:

- create post
- edit post
- delete post
- publish post
- moderate comment
- edit profile

Supabase Row Level Security must be enabled.

The frontend should never be trusted to determine whether a user can perform an action.

---

# 31. Environment Variables

Example (modern Supabase keys — do NOT use legacy `anon` / `service_role`):

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

Only variables that actually need to be public should use `NEXT_PUBLIC_`.

The Supabase secret key (`sb_secret_...`, replacement for legacy `service_role`) must never reach the browser. The publishable key (`sb_publishable_...`, replacement for legacy `anon`) is safe for browser use and respects RLS. Legacy `anon` / `service_role` JWT keys are deprecated by Supabase (removal end of 2026) and must not be used for new code.

Maintain:

```text
.env.example
```

with variable names but no secrets.

---

# 32. Data Access Architecture

Do not scatter direct Supabase calls throughout UI components.

Prefer:

```text
UI
 ↓
Server Action / server-side data function
 ↓
Domain/data-access layer
 ↓
Supabase
```

Example:

```text
actions/posts.ts
lib/posts/queries.ts
lib/posts/mutations.ts
```

This gives the application a clean separation between:

- presentation
- application logic
- persistence

---

# 33. Server Components vs Client Components

Default:

**Server Component**

Use Client Components only when necessary.

Examples of client-side components:

- Tiptap editor
- mobile navigation interactions
- like button
- comment form
- animated interactive components
- search interactions where needed

Examples of server components:

- poem page
- story page
- category page
- homepage sections
- post metadata
- about page

This is important for mobile performance.

---

# 34. Caching and Rendering Strategy

Public content is mostly read-heavy and changes infrequently.

Therefore:

- cache public pages
- statically render where appropriate
- revalidate after content changes
- avoid querying the database on every anonymous request when unnecessary

Recommended model:

```text
Published post
      ↓
cached page
      ↓
Author updates post
      ↓
publish mutation
      ↓
cache invalidation/revalidation
      ↓
new page becomes visible
```

This provides:

- fast page loads
- reduced database load
- better scalability

---

# 35. Performance Strategy

The site should be designed to feel fast on low/mid-range phones and ordinary mobile networks.

Rules:

### JavaScript

Keep client-side JavaScript low.

### Fonts

Use optimized fonts and avoid loading unnecessary weights.

### Animation

Avoid expensive effects.

### YouTube

Do not automatically load a heavy YouTube iframe for every post preview.

For post lists:

```text
thumbnail
   ↓
click
   ↓
actual YouTube iframe
```

For post pages, load the player only where appropriate.

### Rendering

Prefer server rendering/static rendering for public content.

### Database

Select only the fields actually required.

Do not fetch entire tables when displaying a card.

---

# 36. YouTube Performance

Embedded YouTube players can be relatively expensive.

Recommended approach:

- show a lightweight video preview/thumbnail
- initialize the actual iframe only when needed
- avoid multiple autoplaying embeds
- never load several full YouTube players simultaneously in a feed

This is especially important on mobile.

---

# 37. Accessibility

The site should target WCAG-conscious implementation.

Requirements:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient color contrast
- descriptive labels
- proper heading hierarchy
- alt text where images eventually exist
- reduced-motion support
- accessible dialogs/sheets
- touch-friendly targets

Respect:

```css
prefers-reduced-motion
```

for animations.

---

# 38. Comments Security

Because comments are public user input, treat them as untrusted content.

Requirements:

- server-side validation
- length limits
- sanitization/rendering controls
- spam protection/rate limiting
- moderation
- no raw HTML injection
- escaped/safely rendered user content

Never render arbitrary comment HTML directly.

---

# 39. Rate Limiting

Potential abuse points:

- comments
- likes
- admin authentication
- public forms

Start with basic protection.

Do not over-engineer distributed rate limiting for a small personal site.

If abuse becomes significant, introduce a dedicated rate-limiting layer.

---

# 40. Error Handling

User-facing errors should be understandable.

Examples:

```text
Something went wrong.
Please try again.
```

Admin errors should provide actionable context.

Never expose:

- database errors
- SQL details
- secret keys
- internal stack traces

to public users.

---

# 41. Loading States

Use loading states selectively.

Public pages should generally avoid unnecessary spinners.

Prefer:

- server-rendered content
- skeletons only where real asynchronous client loading exists
- optimistic UI where appropriate for likes/comments

The best loading indicator is often not needing one.

---

# 42. Empty States

Important empty states:

### No poems

```text
No poems published yet.
```

### No stories

```text
No stories published yet.
```

### No search results

```text
Nothing matched your search.
```

### No comments

```text
Be the first to leave a comment.
```

Admin also needs empty states for:

- no drafts
- no comments
- no tags

---

# 43. Error / Not Found Pages

Custom:

```text
404
```

page should visually belong to the artistic identity of the website.

Also implement a general error boundary for application failures.

---

# 44. SEO-Friendly Content Architecture

The content model should prioritize stable URLs.

Never use:

```text
/post?id=173829
```

as the primary public URL.

Use:

```text
/poems/the-last-rain
```

This benefits:

- sharing
- SEO
- readability
- analytics
- long-term stability

---

# 45. Deployment

## Vercel

Connect the GitHub repository to Vercel.

Deployment flow:

```text
Developer
   ↓
Git push
   ↓
GitHub
   ↓
Vercel
   ↓
Build
   ↓
Deploy
```

Use:

- production branch
- preview deployments for pull requests
- environment variables in Vercel

---

# 46. Supabase Environment Structure

Use separate environments when the project becomes large enough to justify them.

At minimum:

```text
Development
Production
```

For a small first release, the same project can initially support development/production carefully, but a separate staging environment is preferable once development becomes active.

---

# 47. Database Migrations

Never manually change the production schema without a migration.

Use Supabase migrations.

Example:

```text
supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_comments.sql
    ├── 003_tags.sql
    └── ...
```

Database changes should be version-controlled.

---

# 48. Testing

The project does not need an enormous test suite.

Prioritize:

## Unit tests

For:

- slug generation
- YouTube URL parsing
- validation
- permission logic
- utility functions

## Integration tests

For:

- post creation
- publishing
- comment moderation
- authentication

## E2E tests

Test the critical journey:

```text
Admin login
    ↓
Create poem
    ↓
Save draft
    ↓
Preview
    ↓
Publish
    ↓
Public visitor opens poem
```

and:

```text
Visitor
 ↓
Comments
 ↓
Admin approves
 ↓
Comment becomes visible
```

---

# 49. Project Development Phases

## Phase 1 — Foundation

Implement:

- Next.js
- TypeScript
- Tailwind
- Supabase
- Auth
- database schema
- base layouts
- routing
- design system

---

## Phase 2 — Public Website

Implement:

- homepage
- poems listing
- stories listing
- post pages
- about page
- responsive navigation
- SEO
- typography

Focus heavily on mobile polish.

---

## Phase 3 — Admin CMS

Implement:

- login
- dashboard
- post creation
- Tiptap editor
- draft/publish
- edit/delete
- category/type
- tags
- preview

---

## Phase 4 — Social Features

Implement:

- comments
- comment moderation
- likes
- sharing

---

## Phase 5 — Video

Implement:

- YouTube URL input
- YouTube ID extraction
- video preview
- embedded video rendering
- multiple videos per post

---

## Phase 6 — Polish

Implement:

- Motion animations
- loading states
- empty states
- error pages
- accessibility refinements
- SEO refinements
- performance optimization
- mobile testing

Animation should come after the basic interface works.

---

# 50. What Is Explicitly Out of Scope

Do not build these initially:

- Public user accounts
- User profiles
- Image uploading
- Custom video hosting
- Chat
- Notifications
- Recommendation engine
- Complex analytics
- Subscription system
- Payments
- Newsletter infrastructure
- AI-generated content
- Social media API integrations
- Elasticsearch
- Redis
- Microservices
- Kubernetes
- Separate backend server

The project is a small content publishing platform. It does not need enterprise architecture.

---

# 51. Design System Direction

The visual identity should communicate:

- literary
- personal
- artistic
- calm
- editorial
- modern

Avoid:

- generic gradients
- SaaS-style dashboards
- excessive cards
- excessive borders
- excessive shadows
- neon color palettes
- unnecessary glassmorphism
- overly animated interfaces

Use visual hierarchy through:

- typography
- whitespace
- scale
- alignment
- subtle color
- composition
- controlled motion

The writing should remain the dominant visual element.

---

# 52. Public vs Admin Design

These should intentionally feel different.

## Public

Editorial, artistic, immersive.

```text
Typography
Whitespace
Photography/artwork when introduced
Subtle motion
Reading-focused layouts
```

## Admin

Functional, clear, utilitarian.

```text
Dense information
Clear forms
Tables/lists
Buttons
Dialogs
Status labels
```

Do not sacrifice admin usability to make the dashboard artistic.

---

# 53. Component Architecture

Example reusable components:

```text
components/public/
├── Header
├── Footer
├── Hero
├── PostCard
├── PostList
├── PostHeader
├── PostContent
├── CategoryBadge
├── TagList
├── YouTubeEmbed
├── LikeButton
├── CommentList
├── CommentForm
├── ShareButton
└── RelatedPosts
```

Admin:

```text
components/admin/
├── AdminSidebar
├── AdminHeader
├── PostForm
├── PostEditor
├── PostTable
├── PublishControls
├── TagInput
├── YouTubeInput
├── CommentModeration
└── DashboardStats
```

Shared:

```text
components/shared/
├── Logo
├── Container
├── SectionHeading
├── Pagination
├── EmptyState
├── LoadingState
└── ErrorState
```

---

# 54. Domain Logic

Keep content logic separate from UI.

Example:

```text
lib/posts/
├── queries.ts
├── mutations.ts
├── validation.ts
├── types.ts
└── helpers.ts
```

This enables the public website and admin dashboard to use the same underlying post logic.

---

# 55. Example Content Lifecycle

```text
Author logs in
      ↓
Creates "The Last Rain"
      ↓
Selects "Poem"
      ↓
Writes in Tiptap
      ↓
Adds tags
      ↓
Optionally adds YouTube video
      ↓
Save Draft
      ↓
Preview
      ↓
Publish
      ↓
Database status changes:
draft → published
      ↓
Revalidate relevant pages
      ↓
Post appears publicly
```

---

# 56. Example Visitor Lifecycle

```text
Visitor opens homepage
       ↓
Cached/server-rendered page
       ↓
Chooses Poems
       ↓
Opens poem
       ↓
Reads content
       ↓
Optional YouTube video
       ↓
Likes
       ↓
Leaves comment
       ↓
Comment enters moderation queue
```

---

# 57. Future Extensibility

The initial architecture should allow these features later without a rewrite:

- Image support
- Audio/Spotify embeds
- Additional video platforms
- Author collections
- Series/chapters
- Featured posts
- Favorites/bookmarks
- Newsletter
- RSS feed
- Search improvements
- Multiple authors
- Public accounts
- Advanced analytics
- Content scheduling
- Internationalization

The key is to keep the initial implementation simple while avoiding architectural decisions that block these additions.

---

# 58. Final Architecture Summary

```text
┌─────────────────────────────────────────────────────────┐
│                     PUBLIC WEBSITE                      │
│                                                         │
│ Next.js + React + Tailwind + Motion                    │
│                                                         │
│ Home                                                     │
│ Poems                                                    │
│ Stories                                                  │
│ Search                                                   │
│ Tags                                                     │
│ Post Pages                                               │
│ About                                                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                        SUPABASE                          │
│                                                         │
│ PostgreSQL                                               │
│ ├── profiles                                             │
│ ├── posts                                                │
│ ├── tags                                                 │
│ ├── post_tags                                             │
│ ├── comments                                              │
│ ├── likes                                                 │
│ └── post_videos                                           │
│                                                         │
│ Auth                                                     │
│ └── Admin authentication                                  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                     │
│                                                         │
│ Next.js + Tiptap + shadcn/ui                            │
│                                                         │
│ Login                                                    │
│ Dashboard                                                │
│ Posts                                                    │
│ Editor                                                   │
│ Draft / Publish                                          │
│ Tags                                                     │
│ Comments                                                 │
│ Profile                                                  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │
                           ▼
                    ┌───────────────┐
                    │    YouTube    │
                    │               │
                    │ Video hosting │
                    └───────────────┘

Deployment:
GitHub → Vercel

Images:
Not supported in initial version

Videos:
YouTube embeds

Database/Auth:
Supabase
```

# 59. Final Technology Decision

The project should use:

```text
Framework       Next.js
Language        TypeScript
UI              Tailwind CSS
UI primitives   shadcn/ui
Animation       Motion
Editor          Tiptap
Database        Supabase PostgreSQL
Authentication  Supabase Auth
Video           YouTube embeds
Hosting         Vercel
Version control GitHub
```

The architecture intentionally avoids unnecessary infrastructure.

It is a **single Next.js application backed by Supabase**, with YouTube handling large video files externally. Public pages are server-rendered/cached wherever possible, while the admin dashboard provides the author with a simple CMS workflow.

The most important design principle is:

> **Build a fast literary website, not a miniature social network.**

Every technical decision should support that goal.