# InfoSection Components

This directory contains all the components that make up the comprehensive InfoSection for the video chat application.

## Components Overview

### 1. HeroSection.jsx

- **Purpose**: Main hero section with compelling messaging about the video chat platform
- **Features**:
  - Animated background elements with gradient overlays
  - Feature highlights with icons and descriptions
  - Call-to-action button
  - Fully responsive design with dark mode support

### 2. FeaturesGrid.jsx

- **Purpose**: Showcases key features of the video chat platform
- **Features**:
  - 6 feature cards with icons, titles, and descriptions
  - Hover animations and gradient effects
  - Responsive grid layout (1-2-3 columns based on screen size)
  - Dark mode compatible styling

### 3. StatsSection.jsx

- **Purpose**: Displays impressive usage statistics with animated counters
- **Features**:
  - Animated number counters that count up when in view
  - 4 key statistics (users, calls, uptime, countries)
  - Dark gradient background with animated elements
  - Glassmorphism design with backdrop blur effects

### 4. TestimonialsSection.jsx

- **Purpose**: Shows user testimonials with navigation
- **Features**:
  - Carousel-style testimonial display
  - Navigation buttons and dot indicators
  - 5-star ratings and user avatars
  - Smooth transitions between testimonials
  - Trust indicators section

### 5. CallToActionSection.jsx

- **Purpose**: Final call-to-action section to convert visitors
- **Features**:
  - Compelling headline with gradient text
  - Feature highlights with icons
  - Multiple CTA buttons (Free Trial, Schedule Demo)
  - Trust indicators and social proof
  - Urgency messaging with limited-time offer

## Design Features

### Responsive Design

- Mobile-first approach with breakpoints at `md:` (768px) and `lg:` (1024px)
- Flexible grid layouts that adapt to screen size
- Optimized typography scaling for different devices

### Dark Mode Support

- All components support dark mode using Tailwind's `dark:` prefix
- Consistent color schemes across light and dark themes
- Proper contrast ratios for accessibility

### Animations

- Built with Framer Motion for smooth, performant animations
- Scroll-triggered animations using `whileInView`
- Hover effects and micro-interactions
- Staggered animations for lists and grids

### Typography

- Modern font stack with proper hierarchy
- Gradient text effects for emphasis
- Readable line heights and spacing
- Responsive font sizes

## Usage

All components are imported and used in the main `InfoSection.jsx` file:

```jsx
import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";
import StatsSection from "./components/StatsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CallToActionSection from "./components/CallToActionSection";
```

## Dependencies

- React 19.1.1
- Framer Motion (motion/react)
- Tailwind CSS 3.4.14
- Custom animations and gradients

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- ES6+ JavaScript features
- CSS custom properties (CSS variables)
