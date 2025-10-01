# ModernEdu Style Guide

## Overview

ModernEdu is a modern, responsive website theme inspired by Canva, Perplexity, and DeepSeek. This style guide documents the design tokens, components, and patterns that make up the design system.

## Brand

### Brand Identity
- **Name**: ModernEdu
- **Keywords**: Playful, Professional, Innovative
- **Design Inspiration**: Canva, Perplexity, DeepSeek

### Color Palette

The color palette consists of 10 core colors with light and dark mode variants, designed to provide a harmonious and accessible user experience.

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Primary | #6366f1 | #818cf8 | Main brand color, primary buttons, important links |
| Secondary | #ec4899 | #f472b6 | Secondary actions, highlights, accents |
| Accent | #14b8a6 | #2dd4bf | CTAs, highlights, special elements |
| Neutral | #64748b | #94a3b8 | Secondary text, dividers, borders |
| Background | #ffffff | #0f172a | Main page background |
| Surface | #f8fafc | #1e293b | Cards, panels, modals |
| Error | #ef4444 | #f87171 | Error states, warnings |
| Warning | #f59e0b | #fbbf24 | Warning messages, alerts |
| Success | #10b981 | #34d399 | Success states, confirmations |
| Info | #3b82f6 | #60a5fa | Informational messages, tooltips |

### Gradients

| Gradient | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| Primary | linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) | linear-gradient(135deg, #818cf8 0%, #a78bfa 100%) | Hero sections, major CTAs, headers |
| Accent | linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%) | linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%) | Accent elements, highlights |

## Typography

### Font Families

| Font | Usage | Stack |
|------|-------|-------|
| Sans (Montserrat) | Body text, UI elements | "Montserrat", system-ui, sans-serif |
| Serif (Lora) | Headings, emphasis | "Lora", serif |
| Mono (Fira Code) | Code, technical content | "Fira Code", monospace |

### Type Scale

| Element | Font Size | Line Height | Font Weight | Usage |
|---------|------------|-------------|-------------|-------|
| H1 | 2.5rem | 1.2 | Bold (700) | Main page titles |
| H2 | 2rem | 1.2 | Bold (700) | Section titles |
| H3 | 1.75rem | 1.2 | Semibold (600) | Subsection titles |
| H4 | 1.5rem | 1.2 | Semibold (600) | Card titles |
| H5 | 1.25rem | 1.2 | Medium (500) | Small titles |
| H6 | 1.125rem | 1.2 | Medium (500) | Subtitles |
| Body Large | 1.125rem | 1.5 | Regular (400) | Lead paragraphs |
| Body | 1rem | 1.5 | Regular (400) | Standard text |
| Body Small | 0.875rem | 1.5 | Regular (400) | Captions, footnotes |
| Caption | 0.75rem | 1.5 | Regular (400) | Small captions |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Subtle text, large headings |
| Regular | 400 | Body text, standard usage |
| Medium | 500 | Emphasis, buttons |
| Semibold | 600 | Subheadings, emphasis |
| Bold | 700 | Headings, strong emphasis |
| Extrabold | 800 | Main headings, branding |

## Layout & Spacing

### Spacing Scale

An 8px-based spacing scale ensures consistency throughout the design.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spaces, between small elements |
| sm | 8px | Base unit, small padding/margins |
| md | 16px | Standard padding/margins, gutters |
| lg | 24px | Larger padding/margins, section spacing |
| xl | 32px | Large spacing, major sections |
| 2xl | 48px | Extra large spacing, page sections |
| 3xl | 64px | Very large spacing, hero sections |
| 4xl | 96px | Maximum spacing, special layouts |

### Grid System

- **Columns**: 12-column flexible grid
- **Gutter**: 16px between columns
- **Margin**: 16px on the sides of the grid
- **Container Max Width**: 1280px
- **Text Max Width**: 800px for optimal readability

### Breakpoints

| Breakpoint | Value | Device |
|------------|-------|--------|
| Mobile | 320px | Small mobile devices |
| Phablet | 480px | Large mobile devices |
| Tablet | 768px | Tablets, small laptops |
| Desktop | 1024px | Standard desktop |
| Wide | 1280px | Large desktop, wide screens |

## Components

### Buttons

Three button styles are available for different use cases:

#### Primary Button
- **Usage**: Main actions, CTAs
- **Style**: Solid background with primary color
- **States**: 
  - Hover: Changes to accent color, slight elevation
  - Active: Slightly depressed
  - Disabled: 50% opacity, no interaction

```html
<button class="btn btn-primary">Primary Action</button>
```

#### Secondary Button
- **Usage**: Secondary actions
- **Style**: Outlined with border
- **States**: 
  - Hover: Background color change, slight elevation
  - Active: Slightly depressed
  - Disabled: 50% opacity, no interaction

```html
<button class="btn btn-secondary">Secondary Action</button>
```

#### Tertiary Button
- **Usage**: Less important actions, links
- **Style**: Text only, no background or border
- **States**: 
  - Hover: Underline, color change
  - Active: No change
  - Disabled: 50% opacity, no interaction

```html
<button class="btn btn-tertiary">Tertiary Action</button>
```

### Cards

Cards are used to group related content and actions.

#### Structure
- **Container**: Rounded corners, subtle shadow
- **Header**: Optional, with title and actions
- **Body**: Main content area
- **Footer**: Optional, with actions or metadata

#### Behavior
- **Hover**: Slight elevation, stronger shadow
- **States**: Normal, hover, disabled

```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Form Fields

Form fields follow a consistent pattern for labels, inputs, and feedback.

#### Structure
- **Label**: Descriptive text above the input
- **Input**: Text field with border and focus state
- **Helper Text**: Optional additional information
- **Error Text**: Validation feedback

#### Behavior
- **Focus**: Border color change, subtle glow
- **Error**: Red border and text
- **Disabled**: Reduced opacity, no interaction

```html
<div class="form-group">
  <label class="form-label" for="input">Label Text</label>
  <input type="text" id="input" class="form-input" placeholder="Placeholder text">
  <div class="form-helper">Helper text goes here</div>
  <div class="form-error">Error message goes here</div>
</div>
```

### Search Input

A prominent search component with real-time suggestions.

#### Structure
- **Container**: Relative positioning
- **Input**: Full-width, rounded, with icon
- **Icon**: Search icon inside the input
- **Dropdown**: Suggestions dropdown with animation

#### Behavior
- **Focus**: Border color change, subtle glow
- **Dropdown**: Animated slide-down on focus
- **Item Hover**: Background color change

```html
<div class="search-container">
  <span class="search-icon">🔍</span>
  <input type="text" class="search-input" placeholder="Search...">
  <div class="search-dropdown">
    <div class="search-dropdown-item">Suggestion 1</div>
    <div class="search-dropdown-item">Suggestion 2</div>
  </div>
</div>
```

### Navigation Bar

A sticky navigation bar that collapses on mobile.

#### Structure
- **Container**: Sticky positioning, full width
- **Brand**: Logo and/or site name
- **Links**: Navigation links
- **Mobile Toggle**: Hamburger menu for mobile

#### Behavior
- **Sticky**: Remains at top of page when scrolling
- **Mobile**: Collapses to hamburger menu
- **Hover**: Link color change

```html
<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-brand">Brand</div>
    <div class="navbar-links">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
    </div>
    <button class="navbar-toggle">Menu</button>
  </div>
</nav>
```

### Hero Banner

Full-width banner section for main page introduction.

#### Structure
- **Container**: Full width, optional background
- **Content**: Centered headline and description
- **CTA**: Primary action button

#### Behavior
- **Background**: Optional image or gradient
- **Animation**: Fade-in on scroll

```html
<section class="hero">
  <div class="hero-content">
    <h1>Headline</h1>
    <p>Description text goes here</p>
    <button class="btn btn-primary">Call to Action</button>
  </div>
</section>
```

### Footer

Page footer with links, newsletter signup, and social icons.

#### Structure
- **Container**: Full width, dark background
- **Content**: Links organized in columns
- **Newsletter**: Email signup form
- **Social**: Social media icons
- **Copyright**: Legal information

#### Behavior
- **Links**: Hover color change
- **Social Icons**: Hover animation

```html
<footer class="footer">
  <div class="footer-container">
    <div class="footer-links">
      <div class="footer-column">
        <h4>Column 1</h4>
        <ul>
          <li><a href="#">Link 1</a></li>
          <li><a href="#">Link 2</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h4>Column 2</h4>
        <ul>
          <li><a href="#">Link 3</a></li>
          <li><a href="#">Link 4</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-newsletter">
      <h4>Subscribe</h4>
      <form>
        <input type="email" placeholder="Your email">
        <button class="btn btn-primary">Subscribe</button>
      </form>
    </div>
    <div class="footer-social">
      <a href="#" class="social-icon">Icon 1</a>
      <a href="#" class="social-icon">Icon 2</a>
    </div>
    <div class="footer-copyright">
      <p>© 2023 ModernEdu. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## Motion & Interaction

### Easing Curves

| Easing | Value | Usage |
|--------|-------|-------|
| Sharp | cubic-bezier(0.4, 0, 0.6, 1) | Quick transitions, UI feedback |
| Standard | cubic-bezier(0.4, 0, 0.2, 1) | General purpose animations |
| Decelerate | cubic-bezier(0, 0, 0.2, 1) | Smooth entrances, gentle movements |

### Durations

| Duration | Value | Usage |
|----------|-------|-------|
| Fast | 150ms | Quick UI feedback, simple transitions |
| Normal | 300ms | Standard animations, state changes |
| Slow | 500ms | Complex animations, special effects |

### Animation Examples

#### Hover Effects
- Buttons: Slight elevation and color change
- Cards: Lift effect with stronger shadow
- Links: Underline and color change

#### Scroll Effects
- Fade-in: Elements appear as they enter viewport
- Parallax: Background moves at different speed than foreground
- Stagger: Sequential animation of multiple elements

## Accessibility

### Color Contrast
All color combinations meet WCAG AA contrast requirements:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Non-text elements: 3:1 contrast ratio

### Focus States
All interactive elements have visible focus states:
- Buttons: Outline or glow effect
- Links: Underline or color change
- Form Fields: Border color change and glow effect

### Semantic HTML
Use appropriate HTML elements for their intended purpose:
- Headings for document structure
- Buttons for actions
- Links for navigation
- Form elements with proper labels

### ARIA Attributes
Use ARIA attributes where needed for screen readers:
- `aria-label` for icon-only buttons
- `aria-expanded` for toggle elements
- `aria-hidden` for decorative elements

## Implementation

### CSS Variables
The theme uses CSS variables for easy customization:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #ec4899;
  /* ... other variables */
}
```

### Dark Mode
Dark mode can be implemented in two ways:
1. System preference using `@media (prefers-color-scheme: dark)`
2. Manual toggle using a class on the body element

### Component Examples
See the component sections above for HTML examples.

## Resources

### Design Files
- Figma file: [Link to Figma file]
- Design tokens: `design-tokens.json`
- Theme CSS: `theme.css`

### Development
- Component library: [Link to component library]
- Storybook: [Link to Storybook]

## Changelog

### Version 1.0.0
- Initial release
- Core color palette and typography
- Basic components: buttons, cards, forms
- Layout system and grid
- Dark mode support
