# Habit Tracker API Documentation

## Overview
This document describes the internal API structure of the Habit Tracker application. Since this is a client-side application using LocalStorage, there are no traditional HTTP endpoints. Instead, the application uses a modular JavaScript architecture with defined interfaces.

## Modules

### Storage Module (`js/storage.js`)
Handles all data persistence operations.

#### Methods
- `getData(key, defaultValue)`: Retrieve data from LocalStorage
- `setData(key, data)`: Save data to LocalStorage
- `getHabits()`: Get all habits
- `saveHabits(habits)`: Save all habits
- `getHabitById(id)`: Get a specific habit by ID
- `addHabit(habit)`: Add a new habit
- `updateHabit(updatedHabit)`: Update an existing habit
- `deleteHabit(id)`: Delete a habit by ID
- `getEntries()`: Get all entries
- `saveEntries(entries)`: Save all entries
- `getEntry(habitId, date)`: Get entry for a specific habit and date
- `saveEntry(entry)`: Save an entry
- `deleteEntry(habitId, date)`: Delete an entry
- `getSettings()`: Get application settings
- `saveSettings(settings)`: Save application settings
- `getEntriesByHabitId(habitId)`: Get all entries for a habit
- `getEntriesByDate(date)`: Get all entries for a date

### Habit Manager (`js/habits.js`)
Manages habit entities and their properties.

#### Methods
- `createHabit(habitData)`: Create a new habit
- `getHabitById(id)`: Get habit by ID
- `updateHabit(id, updates)`: Update habit
- `deleteHabit(id)`: Delete/move habit to trash
- `archiveHabit(id)`: Archive a habit
- `moveToIdeas(id)`: Move habit to ideas
- `restoreHabit(id, newStatus)`: Restore habit from trash/archive/ideas
- `getHabitsByStatus(status)`: Get habits by status
- `getActiveHabits()`: Get active habits
- `getHabitsByTag(tag)`: Get habits by tag
- `getHabitsByTimeOfDay(time)`: Get habits by time of day
- `getHabitsByType(type)`: Get habits by type
- `calculateHabitStrength(id)`: Calculate habit strength
- `updateHabitStrength(id, strength)`: Update habit strength
- `getAllHabits()`: Get all habits
- `convertHabitType(habit, newType)`: Convert habit type

### Entry Manager (`js/entries.js`)
Manages daily habit tracking entries.

#### Methods
- `createEntry(habitId, date, data)`: Create a new entry
- `getEntry(habitId, date)`: Get entry by habit and date
- `updateEntry(habitId, date, updates)`: Update entry
- `deleteEntry(habitId, date)`: Delete entry
- `getEntriesByHabit(habitId)`: Get entries for a habit
- `getEntriesByDate(date)`: Get entries for a date
- `toggleCheckboxState(habitId, date, partIndex)`: Toggle checkbox state
- `setTextValue(habitId, date, textValue)`: Set text value
- `setEmojiValue(habitId, date, emojiValue)`: Set emoji value
- `setComment(habitId, date, comment)`: Set comment
- `markMissedDays()`: Mark missed days as failed
- `getAllEntries()`: Get all entries

### UI Manager (`js/ui.js`)
Handles user interface rendering and interactions.

#### Methods
- `switchView(view)`: Switch between views
- `navigateWeek(direction)`: Navigate between weeks
- `openHabitModal(habit)`: Open habit creation/edit modal
- `closeHabitModal()`: Close habit modal
- `handleHabitFormSubmit(e)`: Handle habit form submission
- `toggleEmojiOptions(type)`: Toggle emoji options visibility
- `openCommentModal(habitId, date)`: Open comment modal
- `closeCommentModal()`: Close comment modal
- `handleCommentFormSubmit(e)`: Handle comment form submission
- `render()`: Render the current view
- `updateHeader()`: Update header information
- `updateFilters()`: Update filter options
- `renderWeekView()`: Render week view
- `renderHabitCell(habit, date)`: Render a single habit cell
- `bindHabitCellEvents()`: Bind events to habit cells
- `renderDayView()`: Render day view
- `getTimeLabel(time)`: Get label for time of day
- `renderMonthView()`: Render month view
- `renderIdeasPanel()`: Render ideas panel
- `updateStats()`: Update statistics display
- `getFilteredAndSortedHabits()`: Get filtered and sorted habits

### Stats Manager (`js/stats.js`)
Calculates statistics and habit strength.

#### Methods
- `calculateHabitStrength(habitId)`: Calculate habit strength
- `getDailyStats(date)`: Get daily statistics
- `getWeeklyStats(weekDates)`: Get weekly statistics
- `getMonthlyStats(year, month)`: Get monthly statistics
- `getHabitTrend(habitId, days)`: Get habit completion trend

### Filter Manager (`js/filters.js`)
Handles filtering and sorting of habits.

#### Methods
- `filterByStatus(habits, status)`: Filter by status
- `filterByTag(habits, tag)`: Filter by tag
- `filterByTimeOfDay(habits, time)`: Filter by time of day
- `filterByType(habits, type)`: Filter by type
- `applyFilters(habits, filters)`: Apply multiple filters
- `sortByStrength(habits)`: Sort by strength
- `sortByName(habits)`: Sort by name
- `sortByCreationDate(habits)`: Sort by creation date
- `applySorting(habits, sortBy)`: Apply sorting
- `getAllTags(habits)`: Get all unique tags
- `getAllTimesOfDay(habits)`: Get all unique time of day values

### Utilities (`js/utils.js`)
Provides utility functions.

#### Methods
- `generateId()`: Generate unique ID
- `formatDate(date)`: Format date as YYYY-MM-DD
- `parseDate(dateString)`: Parse date from string
- `getCurrentDate()`: Get current date
- `getWeekDates(startDate)`: Get dates for the current week
- `getWeekNumber(date)`: Get week number
- `debounce(func, delay)`: Debounce function
- `deepClone(obj)`: Deep clone object
- `arraysEqual(arr1, arr2)`: Check if arrays are equal
- `capitalize(str)`: Capitalize first letter

## Data Structures

### Habit
```javascript
{
  id: "unique_id",
  name: "Название привычки",
  type: "checkbox" | "text" | "emoji" | "checkbox_2" | "checkbox_3" | "checkbox_4",
  emojiOptions: ["😊", "😐", "😢"], // for type: "emoji"
  tags: ["тег1", "тег2"],
  timeOfDay: {
    // for type: "checkbox"
    single: "morning" | "day" | "evening",
    // for type: "checkbox_2/3/4"
    parts: [
      { partIndex: 0, time: "morning" },
      { partIndex: 1, time: "evening" }
    ]
  },
  status: "active" | "archived" | "idea" | "trash",
  strength: 0, // calculated automatically
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Entry
```javascript
{
  id: "unique_id",
  habitId: "habit_id",
  date: "YYYY-MM-DD",
  // For checkboxes
  checkboxState: {
    completed: false, // fully completed
    failed: false, // marked with cross
    parts: [true, false, true, false] // for multipart checkboxes
  },
  // For text fields
  textValue: "7:30",
  // For emoji
  emojiValue: "😊",
  comment: "Comment on execution",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Events
The application uses standard DOM events for user interactions:
- Click events for buttons and habit cells
- Change events for form inputs and selects
- Input events for text fields (with debouncing)
- Submit events for forms

## State Management
The application maintains state through:
- LocalStorage for persistent data
- In-memory objects for current session data
- UI state variables in the UIManager class

## Error Handling
Errors are primarily handled through:
- Try/catch blocks for LocalStorage operations
- Console logging for debugging
- Graceful degradation when features are unavailable