# AgentBox Design Guidelines

## Design Approach

**Reference Direction**: Blend Linear's clean minimalism + Superhuman's email elegance with a Halloween hackathon aesthetic. The design should feel like a premium B2B SaaS product with subtle spooky undertones—professional credibility with playful seasonal flair.

**Key Principle**: "Hauntingly Efficient" — Dark, moody interface that doesn't sacrifice usability. Think dark mode done exceptionally well, not gimmicky Halloween decorations.

## Typography System

**Font Stack**:
- **Primary**: Inter or DM Sans (via Google Fonts CDN) — clean, modern sans-serif for UI
- **Accent**: Space Grunge or similar monospace for agent addresses and technical details

**Hierarchy**:
- Hero headline: 4xl to 6xl, font-weight-700, tight leading (-0.02em)
- Section headlines: 2xl to 3xl, font-weight-600
- Subheadings: xl, font-weight-500
- Body text: base (16px), font-weight-400, relaxed leading (1.6)
- Agent labels/metadata: sm, font-weight-500, uppercase tracking-wide
- Email addresses: sm, monospace font-family

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16, 20** consistently
- Micro spacing (component internals): p-2, gap-2
- Standard spacing (between elements): p-4, gap-4, mb-8
- Section padding: py-16 to py-20 (desktop), py-12 (mobile)
- Container max-widths: max-w-7xl for full sections, max-w-4xl for content

**Grid Strategy**:
- Landing hero: Single column, centered
- Features section: 3-column grid on desktop (grid-cols-1 md:grid-cols-3), gap-8
- Why Sellers/Buyers: 2-column split (grid-cols-1 lg:grid-cols-2), gap-12
- Demo viewer: Fixed 2-column layout (not responsive - always side-by-side)

## Component Library

### Landing Page Components

**1. Navigation**
- Sticky header with dark background, subtle backdrop blur
- Logo left, navigation links center, "Get AgentBox Email" CTA right
- Height: h-16, px-8
- Add subtle purple glow effect on logo

**2. Hero Section**
- Height: min-h-screen flex items-center
- Centered content with max-w-4xl
- Headline + subhead + dual CTAs stacked vertically
- Background: Gradient mesh with subtle animated particle effect (CSS-only, no JS)
- Include ghosted email thread preview floating in background (semi-transparent)
- Primary CTA: Large button with glow effect on hover
- Secondary CTA: Ghost button (outline only)

**3. Value Proposition Cards (Why Sellers / Why Buyers)**
- Two distinct sections with mirrored layouts
- Each bullet point as a card with icon (left), title + description (right)
- Cards have subtle border, dark background, hover lift effect
- Icons: Use Heroicons outline style with accent glow

**4. How It Works (3 Steps)**
- Horizontal timeline on desktop, vertical on mobile
- Numbered circles connected by dotted lines
- Each step: Number badge + title + description + visual indicator
- Add subtle "ghost trail" effect between steps

**5. Mock LinkedIn Card**
- Realistic LinkedIn profile mockup (header, photo, name, title, contact section)
- Highlight AgentBox email in contact section with glow pulse animation
- "Copy AgentBox Email" button overlaid with glass-morphism effect
- Width: max-w-md, elevated card shadow

**6. Footer**
- Dark background, py-12
- 4-column grid: Product links, Resources, Social, Newsletter signup
- Add "Powered by AgentMail" badge with sponsor logos
- Include Halloween hackathon attribution

### Demo Page Components

**1. Two-Pane Email Viewer**
- Fixed 2-column layout: 50/50 split with 1px divider
- Each pane: Full height (min-h-screen), overflow-y-auto
- Pane headers: Sticky, showing email address + agent status indicator
- Agent status: Animated dot (thinking/idle/responding) with label

**2. Email Thread Messages**
- Each message as a card: p-4, mb-4, rounded borders
- Sender messages aligned right with distinct background
- Recipient messages aligned left with contrasting background
- Message metadata bar: From/To addresses (monospace), timestamp (right-aligned, text-sm)
- Message body: prose formatting, max-w-prose
- Agent messages have subtle robot icon badge

**3. Demo Controls Bar**
- Fixed top bar, full-width, h-16, backdrop blur
- Buttons: "Start Demo Thread", "Reset" aligned left
- Status indicator: "Thread Status: [Collecting/Scoring/Scheduled]" centered
- Pill-shaped buttons with icon + label

**4. Calendar Event Card**
- Appears at bottom of thread when meeting scheduled
- Elevated card with glow border
- Content: Event icon + title + formatted date/time + attendees list
- Two action buttons: "Add to Google Calendar" + "Download .ics"
- Success state with checkmark animation

**5. Fit Score Indicator**
- Floating card that appears during scoring
- Progress ring showing score percentage
- Matched signals as checkmark list below
- Animate in from side with slide + fade

## Visual Treatment Notes

**Halloween Aesthetic Elements**:
- Subtle purple/orange glow effects on interactive elements
- Particle effects that resemble floating embers or fireflies
- Smooth fade-in animations for sections (no jarring movements)
- Ghost button states with ethereal glow
- Card shadows with slight colored tint instead of pure black
- Dotted/dashed borders suggesting "spectral" quality

**Email UI Polish**:
- Sender/receiver distinction through background contrast, not color
- Timestamps with relative formatting ("2 min ago")
- Agent attribution with subtle badge, never overwhelming
- Loading states: Skeleton screens with shimmer effect
- Empty states: Friendly ghost illustration with "No messages yet"

## Accessibility & Interaction

- All interactive elements: Minimum 44px touch target
- Focus states: 2px offset ring with high contrast
- Button states: Distinct hover (lift + glow), active (scale-95), disabled (opacity-50)
- Form inputs: Consistent h-12, rounded-lg, focus ring with glow
- Status indicators use both icon + text label (not color alone)

## Images

**Hero Section**: 
- Large background: Abstract gradient mesh with floating geometric shapes suggesting email envelopes/threads in purple/dark tones (full-width, behind content)
- Foreground: Translucent screenshot of email thread interface floating at 30° angle

**Mock LinkedIn Section**:
- Realistic LinkedIn profile screenshot with AgentBox email highlighted
- Professional headshot placeholder (use UI Faces or similar)

**Email Viewer**:
- No decorative images—pure functional UI
- Agent avatars: Simple geometric shapes or initials in circles

This design balances professional credibility with hackathon creativity, ensuring judges see both technical sophistication and attention to user experience.