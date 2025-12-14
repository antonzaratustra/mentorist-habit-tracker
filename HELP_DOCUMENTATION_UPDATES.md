# Help Documentation Updates

## Overview
This document summarizes the updates made to the help documentation in the Mentorist Habit Tracker application.

## Changes Made

### 1. Added Habit Type Conversion Section
- Added a new section explaining how habit type conversion works
- Detailed what happens to data during conversion between different habit types
- Included information about preserving habit strength during conversion
- Added a note about the detailed warning messages users receive

### 2. Added Life Spheres, Values, and Goals Section
- Created a new section explaining the meaning of life spheres
- Listed all 8 life spheres with descriptions:
  - 🎯 Призвание (Purpose)
  - 🌀 Духовность (Spirituality)
  - 🤝 Отношения (Relationships)
  - 🏠 Окружение (Environment)
  - 📚 Саморазвитие (Self-development)
  - 💰 Финансы (Finances)
  - 🎉 Яркость жизни (Brightness of life)
  - ❤️ Здоровье (Health)
- Explained how values and goals connect to habits
- Provided guidance on using filters for these categories

### 3. Added Weekly Completion Tracking Section
- Added information about the weekly progress bar visualization
- Explained the colored arrow indicators (<span style="color: #4CAF50">▲</span> for improvement, <span style="color: #F44336">▼</span> for decline)
- Described how percentage differences are shown compared to the previous week
- Connected this feature to the mentor progress container in the header

### 4. Updated Text Field Description
- Corrected the description of text fields to clarify they are for numeric tracking (sleep, weight, etc.) rather than journaling
- Added examples: "😴 Сон: 7.5ч" and "⚖️ Вес: 70.5кг"

### 5. CSS Updates
- Added styling for note elements in the help documentation
- Ensured proper formatting of the new content sections

## Files Modified
1. `index.html` - Updated help modal content
2. `css/main.css` - Added note styling

## Testing
The changes have been tested locally and are functioning correctly. The help documentation now includes all the requested information about:
- Habit type conversion
- Life spheres, values, and goals
- Weekly completion tracking with progress bars and arrows