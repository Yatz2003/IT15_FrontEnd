# Component Documentation

## Component Hierarchy

```
App
├── Navbar
├── Main Content Area
│   ├── Dashboard
│   ├── ProgramList
│   ├── ProgramDetails
│   ├── SubjectList
│   └── SubjectDetails
└── Footer
```

## Component Specifications

### App.jsx

**Purpose:** Main application component that manages routing and navigation.

**Props:** None

**State:**
- `currentPage` - Current active page (dashboard, programs, program-detail, subjects, subject-detail)
- `selectedId` - ID of selected program or subject

**Key Functions:**
- `navigateTo(page, id)` - Navigate to a specific page with optional ID
- `handleProgramClick(programId)` - Navigate to program details
- `handleSubjectClick(subjectId)` - Navigate to subject details

**Features:**
- Persistent navigation bar
- Page transitions with scroll to top
- Footer on all pages

---

### Dashboard.jsx

**Purpose:** Displays overview statistics and recent additions.

**Props:**
- `onNavigate` - Function to navigate to other pages

**State:** None (uses stateless component)

**Key Metrics Displayed:**
- Total programs and subjects
- Active vs. inactive programs
- Subjects per semester
- Subjects with prerequisites
- Programs by status
- Recently added items

**Features:**
- Statistics cards with icons
- Semester distribution visualization
- Program status listing
- Subject count by program
- Recently added cards with navigation

**Styling:** `Dashboard.css`

---

### ProgramList.jsx

**Purpose:** Displays list of programs with search and filter capabilities.

**Props:**
- `programs` - Array of program objects
- `onProgramClick` - Function called when program is selected
- `onNavigate` - Function to navigate to other pages

**State:**
- `filteredPrograms` - Filtered list based on search/filters
- `searchTerm` - Current search term
- `statusFilter` - Selected status filter
- `typeFilter` - Selected type filter
- `viewMode` - Grid or table view

**Key Functions:**
- `handleSearch(e)` - Update search term and filter
- `handleStatusFilter(status)` - Filter by status
- `handleTypeFilter(type)` - Filter by type
- `filterPrograms()` - Apply all filters
- `resetFilters()` - Clear all filters

**Features:**
- Grid and table view modes
- Real-time search
- Multiple filtering options
- Filter reset
- Results count display
- Responsive cards

**Child Components:**
- `ProgramCard` - Individual program card display

**Styling:** `ProgramList.css`

---

### ProgramDetails.jsx

**Purpose:** Displays comprehensive details for a selected program.

**Props:**
- `programId` - ID of program to display
- `onNavigate` - Function to navigate to other pages

**State:** None (derived from props)

**Key Data Displayed:**
- Program code, name, duration, units, status
- Description
- Year-by-year curriculum
- Subjects for each year
- Program statistics

**Features:**
- Year level breakdown
- Subject table with details
- Statistics display
- Edit button (placeholder)
- Print functionality
- Back navigation

**Helper Functions:**
- `getSubjectsByYear()` - Get subjects for a specific year
- `getProgramById()` - Retrieve program from mock data

**Styling:** `ProgramDetails.css`

---

### SubjectList.jsx

**Purpose:** Displays list of subjects with advanced filtering.

**Props:**
- `subjects` - Array of subject objects
- `onSubjectClick` - Function called when subject is selected
- `onNavigate` - Function to navigate to other pages

**State:**
- `filteredSubjects` - Filtered subject list
- `searchTerm` - Current search term
- `semesterFilter` - Selected semester filter
- `unitsFilter` - Selected units filter
- `prereqFilter` - Prerequisites filter (all/with/without)
- `viewMode` - Grid or table view

**Key Functions:**
- `handleSearch(e)` - Update search term
- `handleSemesterFilter(semester)` - Filter by semester
- `handleUnitsFilter(units)` - Filter by units
- `handlePrereqFilter(prereq)` - Filter by prerequisites
- `filterSubjects()` - Apply all filters
- `resetFilters()` - Clear all filters

**Features:**
- Grid and table view modes
- Real-time search
- Multiple filter criteria
- Unique units detection
- Dynamic filter options
- Results count display

**Child Components:**
- `SubjectCard` - Individual subject card display

**Styling:** `SubjectList.css`

---

### SubjectDetails.jsx

**Purpose:** Displays comprehensive details for a selected subject.

**Props:**
- `subjectId` - ID of subject to display
- `onNavigate` - Function to navigate to other pages

**State:** None (derived from props)

**Key Data Displayed:**
- Subject code, title, units
- Semester offered indicator
- Prerequisites and co-requisites
- Programs offering the subject
- Subject statistics

**Features:**
- Prerequisite display with badges
- Co-requisite display with badges
- Programs list with navigation
- "None" display for missing prerequisites
- Statistics display
- Edit button (placeholder)
- Print functionality
- Back navigation

**Helper Functions:**
- `getSubjectById()` - Retrieve subject from mock data
- `getProgramById()` - Get program information

**Styling:** `SubjectDetails.css`

---

## Styling Files

### Dashboard.css
- Grid-based layout for statistics
- Card styling with shadows
- Bar chart visualization for semesters
- Status list styling
- Recent items grid
- Responsive breakpoints

### ProgramList.css
- Filter section styling
- Grid layout for program cards
- Table styling for list view
- Search input styling
- Filter button states
- Card hover effects
- Responsive tables

### ProgramDetails.css
- Two-column layout for overview
- Year level sections
- Subject table with columns
- Semester badges
- Statistics layout
- Print friendly styles

### SubjectList.css
- Similar structure to ProgramList
- Purple accent color theme
- Semester badge styling
- Units badge styling
- Filter options
- Grid and table views

### SubjectDetails.css
- Info box layouts
- Requirement sections
- Badge styling for requirements
- Programs offering list
- Statistics grid
- Color-coded sections

### App.css
- Navbar styling with gradient
- Navigation links and active states
- Footer styling
- Responsive navbar
- Main content area layout

---

## Data Flow

### Navigation Flow
```
User Click → navigateTo(page, id) → setState → Component renders
```

### Filter Flow
```
User Input → handleFilter() → filterSubjects/filterPrograms() → 
setFilteredItems() → Component re-renders
```

### Data Retrieval
```
Component Mount → Pass props → Use mock data helpers → 
filter/transform data → Display
```

---

## State Management

### Global State (App.jsx)
- `currentPage` - Determines which component to render
- `selectedId` - Tracks selected program/subject ID

### Local State (List Components)
- Search terms
- Filter selections
- View mode preference
- Filtered results

### No State (Detail Components)
- Display data based on ID from props
- Derive data from mock data

---

## Styling Conventions

### Color Scheme
- **Primary Blue:** `#3b82f6` - Main actions
- **Secondary Purple:** `#8b5cf6` - Secondary items, subjects
- **Success Green:** `#10b981` - Active status
- **Warning Orange:** `#f59e0b` - Under review
- **Error Red:** `#ef4444` - Phased out
- **Neutral Gray:** `#666`, `#999` - Text, muted content

### Spacing
- Base unit: `0.5rem`
- Standard padding: `1rem`, `1.5rem`, `2rem`
- Standard margins: `0.5rem`, `1rem`, `1.5rem`, `2rem`
- Gap in grids: `1.5rem`, `2rem`

### Typography
- **Headings:** Bold, larger sizes (`1.5rem` - `2.5rem`)
- **Body:** Regular weight, `1rem`
- **Labels:** Semi-bold, `0.9rem`, `0.95rem`

### Spacing Units
- Cards: `1.5rem` - `2rem` padding
- Sections: `2rem` - `3rem` gap/margin
- Elements: `0.75rem` - `1rem` gap

---

## Responsive Design

### Breakpoints
- **Desktop:** 1024px and above
- **Tablet:** 768px - 1023px
- **Mobile:** 480px - 767px
- **Small Mobile:** Below 480px

### Mobile Adjustments
- Single column layouts
- Reduced padding
- Smaller font sizes
- Stacked navigation
- Simplified tables
- Full-width buttons

---

## Performance Optimizations

- **Memoization:** Components only re-render when props change
- **Efficient Filtering:** Uses native JavaScript methods
- **CSS:** Minimal duplication, modular files
- **No External Dependencies:** Reduces bundle size
- **Lazy Principles:** Components are lightweight

---

## Accessibility Features

- Semantic HTML structure
- Button elements for clickable items
- Focus states for keyboard navigation
- Clear label text
- Color contrast compliance
- Skip navigation options (can be added)
- ARIA labels (can be enhanced)

---

## Error Handling

- No records found messages
- Graceful fallbacks
- Back navigation options
- Try/catch structures for data retrieval
- Validation of component props

---

## Testing Considerations

Potential test cases:
- Navigation between pages
- Filter functionality
- Search accuracy
- View mode toggle
- Responsive design
- Print functionality
- Data display accuracy
- Error states

---

## Future Enhancement Opportunities

- Add sorting to tables
- Implement virtualization for large lists
- Add animations/transitions
- Create reusable Filter component
- Add export functionality
- Implement advanced search
- Add favorites/bookmarks
- Create user preferences storage

---

**Last Updated:** February 2026
