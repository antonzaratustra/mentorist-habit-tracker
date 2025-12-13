# Mentorist Habit Tracker

A personal habit tracking web application built with HTML, CSS, and vanilla JavaScript.

## Features

- Track habits with different types:
  - Simple checkboxes
  - Multi-part checkboxes (2, 3, or 4 parts)
  - Text input
  - Emoji selection
- Multiple views:
  - Weekly view (default)
  - Daily view
  - Monthly overview
- Filtering and sorting options
- Light/dark theme support
- Local storage for data persistence
- Automatic marking of missed days
- Habit strength calculation
- Comments for daily entries

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: LocalStorage
- **No external dependencies**

## Project Structure

```
habit-tracker/
├── index.html
├── css/
│   ├── main.css
│   ├── themes.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── habits.js
│   ├── entries.js
│   ├── ui.js
│   ├── stats.js
│   ├── filters.js
│   └── utils.js
└── assets/
    └── icons/
```

## Modules

1. **app.js** - Main application initialization
2. **storage.js** - LocalStorage management
3. **habits.js** - Habit entity management
4. **entries.js** - Daily habit entries management
5. **ui.js** - User interface rendering and interactions
6. **stats.js** - Statistics and calculations
7. **filters.js** - Data filtering and sorting
8. **utils.js** - Utility functions

## Installation

1. Clone or download the repository
2. Open `index.html` in a web browser

## Usage

1. Click "Добавить привычку" to create a new habit
2. Select the habit type and configure options
3. Track your habits daily using the weekly view
4. Switch between different views using the view buttons
5. Use filters to narrow down displayed habits
6. Toggle between light and dark themes using the moon/sun icon

To initialize sample data for testing:
1. Open the browser's developer console (F12)
2. Run `initializeSampleData()`

## Development

To extend the application:

1. Follow the modular structure
2. Add new features in appropriate modules
3. Maintain consistency with existing code style
4. Test thoroughly after making changes

## License

This project is for personal use only.