# Sandayan Academy - Frontend Application

A comprehensive React-based frontend application for managing academic programs and subject offerings. This is a **frontend-only implementation** using mock JSON data for demonstration purposes.

## Project Overview

This application provides a complete system for browsing and managing:
- **Academic Programs** - View program details, curriculum by year level
- **Subject Offerings** - Browse subjects with filtering and search capabilities
- **Dashboard** - Overview of statistics and recent additions

## Features

### Dashboard
- Total number of programs and subjects statistics
- Active vs. inactive programs count
- Subjects per semester/term visualization
- Subjects with prerequisites count
- Recently added programs and subjects
- Program status overview
- Subjects per program breakdown

### Program Offerings Module

#### Program Listing Page
- Display all programs with card or table view
- Program code, name, type, duration, and units
- Status badges (active/under review/phased out)
- Search by program code or name
- Filter by status
- Filter by program type
- Toggle between grid and table views

#### Program Details View
- Complete program information
- Program description
- Curriculum organized by year level
- Subjects under each year with:
  - Subject code
  - Title
  - Units
  - Semester offered
  - Prerequisites
- Program statistics
- Print curriculum option

### Subject Offerings Module

#### Subject Listing Page
- Display all subjects with card or table view
- Subject code, title, units, semester, and programs
- Search by subject code or title
- Filter by semester (1st, 2nd, or both)
- Filter by units/credits
- Filter by with/without prerequisites
- Toggle between grid and table views

#### Subject Details View
- Subject information (code, title, units)
- Semester/term offered indicator
- Prerequisites with badge display
- Co-requisites with badge display
- Programs offering the subject
- Subject statistics
- Print details option

## Technology Stack

- **React 19.2.0** - UI framework
- **Vite 8.0.0-beta.13** - Build tool
- **CSS3** - Styling with custom properties and media queries
- **JavaScript ES6+** - Modern JavaScript features

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx
│   ├── ProgramList.jsx
│   ├── ProgramDetails.jsx
│   ├── SubjectList.jsx
│   └── SubjectDetails.jsx
├── styles/
│   ├── Dashboard.css
│   ├── ProgramList.css
│   ├── ProgramDetails.css
│   ├── SubjectList.css
│   └── SubjectDetails.css
├── services/
│   └── mockData.js
├── App.jsx
├── App.css
├── index.css
├── main.jsx
└── assets/
```

## Component Architecture

### App.jsx
- Main application component
- Navigation bar
- State management for routing
- Page rendering logic
- Footer component

### Dashboard.jsx
- Displays statistics cards
- Shows program and subject counts
- Displays semester distribution
- Lists programs with status
- Shows recently added items

### ProgramList.jsx
- Displays programs in grid or table view
- Search functionality
- Filtering by status and type
- View toggle
- Card component for program display

### ProgramDetails.jsx
- Shows complete program information
- Displays curriculum by year level
- Shows all subjects for each year
- Displays program statistics
- Print functionality

### SubjectList.jsx
- Displays subjects in grid or table view
- Search functionality
- Multiple filtering options (semester, units, prerequisites)
- View toggle
- Card component for subject display

### SubjectDetails.jsx
- Shows complete subject information
- Displays prerequisites and co-requisites
- Shows programs offering the subject
- Displays subject statistics
- Print functionality

## Mock Data

The application uses mock JSON data defined in `services/mockData.js` containing:
- **50 Subjects** across multiple programs and years
- **5 Programs** including:
  - Bachelor of Science in Information Technology
  - Bachelor of Science in Computer Science
  - Diploma in Information Technology
  - Bachelor of Science in Computer Science (Extended)
  - Bachelor of Science in Computer Engineering

Each program has:
- Code, name, type, duration, units
- Status (active/phased out/under review)
- Year levels with assigned subjects

Each subject has:
- Code, title, units, semester offered
- Prerequisites and co-requisites
- Program assignments
- Description

## Installation & Setup

1. Navigate to the project directory:
```bash
cd Sandayan-React-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit the provided local URL (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build

## Navigation

The application uses hash-based routing for client-side navigation:
- **Dashboard** (`#/dashboard`) - Overview and statistics
- **Programs** (`#/programs`) - Program listing and browsing
- **Program Details** (`#/program/:id`) - Individual program view
- **Subjects** (`#/subjects`) - Subject listing and browsing
- **Subject Details** (`#/subject/:id`) - Individual subject view

## Responsive Design

The application is fully responsive with breakpoints for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (480px - 767px)
- Small Mobile (<480px)

All components and layouts adapt gracefully to different screen sizes.

## Styling Approach

- **Modular CSS** - Each component has its own CSS file
- **CSS Variables** - Custom properties for consistent theming
- **Gradients** - Modern gradient backgrounds
- **Transitions** - Smooth animations and transitions
- **Flexbox & Grid** - Modern layout techniques
- **Media Queries** - Responsive design

### Color Scheme
- Primary Blue: `#3b82f6` - Used for primary actions
- Purple: `#8b5cf6` - Used for secondary elements
- Green: `#10b981` - Used for success/active states
- Orange: `#f59e0b` - Used for warnings
- Red: `#ef4444` - Used for inactive/phased out

## Features by Module

### Search & Filter
- Real-time search across multiple fields
- Multi-criteria filtering
- Filter reset functionality
- Results count display

### View Options
- Grid view with responsive cards
- Table view with sortable columns
- Toggle between views

### User Experience
- Smooth animations on page transitions
- Hover effects on interactive elements
- Loading states
- Error handling
- Empty state displays

### Accessibility
- Semantic HTML
- Button elements for interactive content
- Focus states for keyboard navigation
- ARIA labels for complex components

## Future Enhancements

Possible features for production implementation:
- Backend API integration
- User authentication
- Add/Edit/Delete operations
- Advanced sorting and filtering
- Export functionality (PDF, Excel)
- Prerequisite dependency visualization
- Course planning tools
- Degree audit functionality
- Class schedules
- Room and instructor management
- Student registration system

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Lazy loading of components
- Optimized CSS with minimal duplication
- Efficient state management
- Fast rendering with React 19

## Code Organization

The code follows these principles:
- **Component-based architecture**
- **Separation of concerns**
- **Reusable components**
- **Clean code practices**
- **Consistent naming conventions**
- **Modular CSS organization**
- **Clear data flow**

## Learning Outcomes

This project demonstrates:
- React component creation and composition
- State management and hooks
- Event handling and user interactions
- CSS styling and responsive design
- Data filtering and searching
- UI/UX best practices
- Mock data handling
- Application routing and navigation

## Notes

- This is a **frontend-only** implementation
- All data is stored in mock JSON in the client
- No backend or database integration
- All functionality is purely client-side
- Perfect for portfolio and demonstration purposes

## License

This project is created for educational purposes.

## Contact & Support

For questions or issues with the application, please refer to the component documentation or check the mock data structure in `services/mockData.js`.

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Built with:** React 19 + Vite
