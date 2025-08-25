# General
- Style: modern, minimal, fresh, professional
- Layout: clean spacing, grid-based, avoid clutter
- Components: rounded corners (2xl), soft shadows, adequate padding

# Color Palette
- **Dark Mode**: base color is a deep navy blue (`#0D1B2A` background, `#1B263B` surface)
- **Light Mode**: light gray/white backgrounds (`#F8FAFC` base, `#FFFFFF` surface)
- **Primary Accent**: bright blue (`#3A86FF`)
- **Secondary Accent**: teal/cyan (`#4CC9F0`)
- **Success**: green (`#4ADE80`)
- **Warning**: amber (`#FBBF24`)
- **Error**: red (`#F87171`)
- **Text Dark Mode**: use `#E0E6ED` for primary text, `#AABACD` for secondary
- **Text Light Mode**: use `#1F2937` for primary, `#6B7280` for secondary
- **Icons**: follow accent colors, subtle hover glow

# Typography
- Headings: bold, clean sans-serif (e.g. Inter, 600 weight)
- Body: normal sans-serif (Inter, 400 weight)
- Font sizes:
  - H1: 2xl
  - H2: xl
  - Body: base
  - Small text: sm

# Components
- **Cards (Prompt Cards)**:
  - Rounded corners (2xl)
  - Shadow-md in light mode, shadow-lg with subtle glow in dark mode
  - Hover: lift + border-accent glow
  - Card header = title bold, card body = truncated preview, tags as small pills
- **Modals**:
  - Dark mode: `#1B263B` background with `#3A86FF` accent highlights
  - Light mode: white background with accent-blue buttons
  - Centered, rounded, drop shadow
  - Close button icon in top-right (accent hover)
- **Buttons**:
  - Primary: blue background (`#3A86FF`), white text, hover darken (`#2563EB`)
  - Secondary: outline with accent border + text
  - Danger: red background (`#F87171`)
  - Rounded (xl), medium padding
- **Tags / Chips**:
  - Small rounded pills
  - Background = accent color soft version (`#3A86FF20` dark mode), text = accent
- **Forms / Inputs**:
  - Rounded, subtle border
  - Focus ring with accent color
  - Dark mode: `#1B263B` input background, light text

# Interaction
- Smooth hover transitions (200ms)
- Motion: subtle scale-up on hover for cards/buttons
- Focus states: clear, accessible (outline accent color)
- Dark mode toggle visible in header

# Accessibility
- Minimum contrast ratio 4.5
- Avoid pure black or pure white (use navy and soft gray instead)
- Clear hover/focus for keyboard navigation
