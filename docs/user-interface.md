# User Interface Guide

This guide will help you understand and navigate the PromptVault user interface. The interface is designed to be intuitive and responsive, working seamlessly across desktop, tablet, and mobile devices.

## 🎨 Design System

PromptVault features a modern, clean design with:

- **Custom Design Tokens**: Consistent colors, spacing, and typography
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Built with accessibility best practices
- **Smooth Animations**: Subtle transitions and hover effects

### Color Scheme

The interface uses a carefully crafted color palette:

- **Primary Colors**: Blue-based accent colors for actions and highlights
- **Neutral Colors**: Grayscale palette for text and backgrounds
- **Semantic Colors**: Success (green), warning (yellow), error (red)
- **Surface Colors**: Different background levels for visual hierarchy

### Typography

- **Font Family**: Inter for body text, JetBrains Mono for code
- **Font Sizes**: Responsive scale from 12px to 36px
- **Font Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)

## 🧭 Navigation

### Top Navigation Bar

The top navigation bar is always visible and contains:

#### Left Side
- **Logo**: PromptVault icon and name (clickable, goes to home)
- **Navigation Links**: Main sections (Prompts, Team Feed, Admin)

#### Right Side
- **Theme Toggle**: Switch between light and dark mode
- **Account Menu**: User profile and logout options
- **Login/Register**: Authentication options (when not logged in)

### Navigation Links

#### Prompts
- **Path**: `/prompts`
- **Description**: Your personal prompt library
- **Icon**: Message Square
- **Access**: All authenticated users

#### Team Feed
- **Path**: `/team-feed`
- **Description**: Prompts shared by your team
- **Icon**: Users
- **Access**: All authenticated users

#### Admin
- **Path**: `/admin`
- **Description**: System administration panel
- **Icon**: Settings
- **Access**: Admin users only

#### About
- **Path**: `/about`
- **Description**: Information about PromptVault
- **Icon**: Info
- **Access**: Public (no authentication required)

### Mobile Navigation

On mobile devices, the navigation adapts:

- **Hamburger Menu**: Collapsible navigation for smaller screens
- **Touch-Friendly**: Larger touch targets for mobile interaction
- **Responsive Layout**: Stacked layout for narrow screens

## 📱 Main Pages

### Prompts Page (`/prompts`)

The main page where you manage your personal prompt library.

#### Header Section
- **Page Title**: "Prompts" with prompt count
- **New Prompt Button**: Create a new prompt
- **Search Bar**: Search through your prompts
- **Filter Options**: Filter by tags, visibility, etc.

#### Prompt Grid
- **Prompt Cards**: Each prompt displayed as a card
- **Card Information**:
  - Title and preview of content
  - Tags (with color coding)
  - Visibility indicator (Private/Team)
  - Last updated timestamp
  - Version count
  - Average rating (if rated)

#### Card Actions
- **View**: Click to open prompt details
- **Edit**: Quick edit access
- **Copy**: Copy prompt content to clipboard
- **Delete**: Remove prompt (with confirmation)

#### Empty State
When you have no prompts:
- **Illustration**: Visual representation of empty state
- **Message**: Encouraging message to create first prompt
- **Action Button**: "Create Your First Prompt"

### Prompt Details Page (`/prompts/:id`)

Detailed view of a specific prompt with full editing capabilities.

#### Header
- **Back Button**: Return to prompts list
- **Prompt Title**: Editable title
- **Actions**: Edit, Save, Delete, Share

#### Content Sections
- **Prompt Content**: Main prompt text (editable)
- **Variables**: Optional variable definitions
- **Notes**: Additional context and instructions
- **Model Hints**: AI model recommendations
- **Tags**: Tag management with autocomplete

#### Sidebar
- **Visibility Settings**: Private/Team/Public options
- **Sharing Options**: Public sharing controls
- **Version History**: List of all versions
- **Metadata**: Creation and update timestamps

#### Version History
- **Version List**: Chronological list of all changes
- **Version Details**: What changed in each version
- **Copy Version**: Copy specific version content
- **Pagination**: For prompts with many versions

### Team Feed Page (`/team-feed`)

View prompts shared by your team members.

#### Header
- **Page Title**: "Team Feed"
- **Team Indicator**: Shows your current team
- **Refresh Button**: Reload team prompts

#### Team Prompt Cards
- **Author Information**: Who shared the prompt
- **Prompt Details**: Title, content preview, tags
- **Read-Only**: Team prompts are view-only
- **Copy Option**: Copy team prompt content

#### Empty State
When no team prompts exist:
- **Message**: No team prompts available
- **Suggestion**: Encourage team members to share

### Admin Page (`/admin`)

System administration panel (Admin users only).

#### Tabs
- **Users**: Manage user accounts
- **Teams**: Create and manage teams
- **Tags**: Global tag management
- **Settings**: System configuration

#### Users Tab
- **User List**: Table of all users
- **User Actions**: Create, edit, delete users
- **Role Management**: Assign admin/user roles
- **Team Assignment**: Assign users to teams

#### Teams Tab
- **Team List**: All teams in the system
- **Team Actions**: Create, edit, delete teams
- **User Assignment**: Assign users to teams

#### Tags Tab
- **Tag List**: All tags with usage counts
- **Tag Actions**: Create, edit, delete tags
- **Usage Statistics**: How many prompts use each tag

#### Settings Tab
- **Registration Toggle**: Enable/disable user registration
- **System Information**: Version and status info

### Account Page (`/account`)

Manage your personal account settings.

#### Profile Section
- **User Information**: Name, email, team
- **Password Change**: Update your password
- **Account Actions**: Delete account (with confirmation)

#### Preferences
- **Theme Selection**: Light/Dark mode preference
- **Notification Settings**: Future notification options
- **Data Export**: Download your data

## 🎛️ Interactive Elements

### Buttons

#### Primary Buttons
- **Style**: Solid background with accent color
- **Usage**: Main actions (Create, Save, Login)
- **States**: Default, Hover, Active, Disabled

#### Secondary Buttons
- **Style**: Outlined with accent color
- **Usage**: Secondary actions (Cancel, Edit)
- **States**: Default, Hover, Active, Disabled

#### Ghost Buttons
- **Style**: Transparent with text color
- **Usage**: Subtle actions (Delete, Copy)
- **States**: Default, Hover, Active, Disabled

### Form Elements

#### Input Fields
- **Text Inputs**: Single-line text entry
- **Textareas**: Multi-line text entry
- **Search Inputs**: Specialized search fields
- **Validation**: Real-time validation feedback

#### Select Elements
- **Dropdowns**: Single selection from options
- **Multi-select**: Multiple selection capability
- **Tag Input**: Specialized tag selection with autocomplete

#### Checkboxes and Radio Buttons
- **Checkboxes**: Multiple selection
- **Radio Buttons**: Single selection from group
- **Toggle Switches**: On/off states

### Modals and Dialogs

#### Confirmation Dialogs
- **Delete Confirmations**: Confirm destructive actions
- **Action Confirmations**: Confirm important actions
- **Warning Dialogs**: Alert users to potential issues

#### Form Modals
- **Create Forms**: Modal forms for creating new items
- **Edit Forms**: Modal forms for editing existing items
- **Settings Forms**: Configuration forms

### Notifications

#### Success Messages
- **Green Color**: Indicate successful operations
- **Auto-dismiss**: Automatically hide after a few seconds
- **Action Feedback**: Confirm user actions

#### Error Messages
- **Red Color**: Indicate errors or failures
- **Persistent**: Stay visible until dismissed
- **Detailed Information**: Explain what went wrong

#### Warning Messages
- **Yellow Color**: Indicate warnings or cautions
- **Contextual**: Appear when needed
- **Actionable**: Suggest next steps

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations

#### Navigation
- **Collapsible Menu**: Hamburger menu for mobile
- **Touch Targets**: Larger buttons for touch interaction
- **Swipe Gestures**: Swipe navigation where appropriate

#### Content Layout
- **Single Column**: Stacked layout on mobile
- **Card Grid**: Responsive grid that adapts to screen size
- **Touch-Friendly**: Larger touch targets and spacing

#### Forms
- **Full-Width Inputs**: Inputs take full width on mobile
- **Keyboard Optimization**: Appropriate keyboard types
- **Validation**: Clear validation messages

### Tablet Adaptations

#### Navigation
- **Sidebar Navigation**: Collapsible sidebar
- **Touch Optimization**: Touch-friendly interface
- **Landscape Support**: Optimized for landscape orientation

#### Content
- **Two-Column Layout**: Side-by-side content where appropriate
- **Card Grid**: Responsive grid layout
- **Modal Optimization**: Full-screen modals on tablets

## 🎨 Theme System

### Light Mode
- **Background**: White and light gray tones
- **Text**: Dark gray and black
- **Accents**: Blue-based primary colors
- **Shadows**: Subtle drop shadows

### Dark Mode
- **Background**: Dark blue and black tones
- **Text**: Light gray and white
- **Accents**: Bright blue primary colors
- **Shadows**: Enhanced shadows for depth

### Theme Switching
- **Automatic**: Detects system preference
- **Manual Toggle**: User can override system preference
- **Persistence**: Remembers user choice
- **Smooth Transition**: Animated theme changes

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Keyboard Shortcuts**: Common actions accessible via keyboard
- **Focus Indicators**: Clear focus states

### Screen Reader Support
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Descriptive labels for screen readers
- **Alt Text**: Image descriptions

### Visual Accessibility
- **Color Contrast**: High contrast ratios
- **Font Sizing**: Scalable text
- **Focus Indicators**: Clear focus states

## 🔧 Customization

### Theme Customization
- **CSS Variables**: Easy color customization
- **Design Tokens**: Consistent design system
- **Component Library**: Reusable UI components

### Layout Customization
- **Responsive Grid**: Flexible layout system
- **Component Variants**: Different component styles
- **Spacing System**: Consistent spacing scale

---

**Ready to start using PromptVault?** Check out the [Creating Prompts](creating-prompts.md) guide to learn how to create and manage your first prompts!
