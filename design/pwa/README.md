# 🖼 PWA Images and Icons - Documentation

This guide explains dimensions and orientations to generate screenshot images and icons for the Fitness-Gym PWA.

## Technical Requirements

- **Format:** PNG or Webp (No transparency/Alpha channel).
- **Content** Real UI screenshots (do not include device frames/mockups).
- **Quantity** Minimum of 3 images per orientation for the best "Rich Install" experience.
- **Icons** Minimum of 3 icons (2 standard and 1 maskable).

## Screenshots Orientations

### 📱 Mobile (Required)

- **Manifest ID:** `narrow`
- **Dimensions:** 1080x1920px (Preferred) or 720x1280px
- **Aspect ratio:** 9:16
- **Focus:** Workout lists, timer, and exercise details.

### 💻 Desktop (Optional, but recommended)

- **Manifest ID:** `wide`
- **Dimensions:** 1920x1080px (Preferred) or 1280x720px
- **Aspect ration:** 16:9
- **Focus:** Dashboard, progress charts, and settings.

## Icons

Icons are the "app logo" on the user's home screen.

### Standard Icons (Purpose: `any`)

- **Dimensions:** 192x192px and 512x512px.
- **Usage:** Favicons, task switchers, and general display.
- **Style:** Can have transparency if desired.

### Maskable Icon (Purpose: `maskable`)

- **Dimensions:** 512x512px (Recommended).
- **Safe Zone:** Important content (logo) must be within a **central circle with 80% of the diameter.**
- **Style:** **Must have a solid background color** (No transparency).
- **Usage:** Adaptive icons on Android (allows the OS to crop the icon into different shapes).
