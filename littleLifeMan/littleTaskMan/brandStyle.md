# LittleTaskMan Brand Style Guide

## Color Palette

### Primary Colors
- **Deep Teal** (#2A7B8B): Main brand color for headers, navigation
- **Soft Coral** (#F26C4F): Call-to-action, highlights, important elements
- **Light Sage** (#DCEDC2): Backgrounds, secondary elements
- **Deep Charcoal** (#333333): Text, borders

### Status Colors
- **Open** (#E74C3C): Replace current red
- **In Progress** (#F39C12): Keep current orange
- **Completed** (#27AE60): Keep current green
- **Blocked** (#8E44AD): New status - purple
- **Postponed** (#7F8C8D): New status - slate gray

## Typography

### Headings
- **Primary Font**: 'Montserrat', sans-serif
- Weights: 600 (semi-bold) for headers, 700 (bold) for emphasis
- H1: 28px, H2: 24px, H3: 20px, H4: 18px

### Body Text
- **Primary Font**: 'Open Sans', sans-serif
- Weight: 400 (regular), 600 (semi-bold) for emphasis
- Size: 16px for main content, 14px for secondary content

## UI Elements

### Buttons
- **Primary Button**: 
  - Background: #2A7B8B (Deep Teal)
  - Text: White
  - Hover: #206270 (Darker Teal)
  
- **Secondary Button**:
  - Background: White
  - Border: 1px solid #2A7B8B
  - Text: #2A7B8B
  - Hover: Light Teal background (#E5F1F3)

- **Danger Button**:
  - Background: #E74C3C (Open Red)
  - Text: White
  - Hover: Darker Red (#C0392B)

### Form Elements
- Inputs with 1px solid #CCCCCC border
- 8px border-radius
- 12px padding
- Focus state with #2A7B8B outline

### Cards & Containers
- White background
- 8px border-radius
- Light shadow: 0 2px 5px rgba(0,0,0,0.1)
- Border: 1px solid #EEEEEE

## Implementation Notes
Add this section to the head of index.html:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
```

Create a style.css file in the public folder with these styles.