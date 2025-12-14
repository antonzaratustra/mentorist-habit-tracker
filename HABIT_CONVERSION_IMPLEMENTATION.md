# Habit Type Conversion Implementation

## Overview

This document describes the implementation of habit type conversion functionality in the Mentorist Habit Tracker. The implementation ensures that when users change the type of a habit (e.g., from a simple checkbox to a multi-part checkbox), the statistics and habit strength are preserved while appropriately converting the existing data.

## Key Features

1. **Data Preservation**: Habit strength and statistics are preserved during type conversions
2. **User Warnings**: Users are warned about potential data loss before converting habit types using custom modals
3. **Intelligent Data Conversion**: Existing entries are appropriately converted between different habit types
4. **Consistent UI Experience**: Conversion warnings are shown in custom modals when users change habit types
5. **Detailed Information**: Warning messages provide clear, detailed information about what will happen during conversion

## Implementation Details

### 1. HabitManager Class Modifications

#### convertHabitType Method
- Preserves habit strength during conversions
- Handles time-of-day settings conversion between single and multi-part formats
- Calls entry conversion method to handle entry data migration

#### getConversionWarning Method
- Provides specific, detailed warnings for different conversion scenarios
- Explains what data might be lost or transformed during conversion
- Uses user-friendly language to describe the implications
- Includes information about how strength will be affected

#### getTypeDisplayName Method
- Provides localized display names for different habit types
- Used in warning messages to make them more understandable

### 2. EntryManager Class Modifications

#### convertEntriesForHabitTypeChange Method
- Handles conversion of all existing entries when habit type changes
- Implements specific conversion logic for each type combination:
  - Checkbox ↔ Multi-part checkbox
  - Checkbox ↔ Text field
  - Checkbox ↔ Emoji field
  - Text field ↔ Emoji field
  - Multi-part checkbox ↔ Text field
  - Multi-part checkbox ↔ Emoji field

#### recalculateHabitStrength Method
- Enhanced to properly calculate strength for different habit types
- Maintains consistency in strength calculation across type conversions

### 3. UIManager Class Modifications

#### handleHabitFormSubmit Method
- Made async to properly handle the custom modal
- Shows conversion warnings using custom modals when users change habit types
- Requires user confirmation before proceeding with potentially destructive conversions

#### showConfirm Method
- Already existed and is used for showing custom confirmation dialogs
- Provides consistent UI experience across the application

### 4. Conversion Logic

#### Checkbox → Multi-part Checkbox
- If the single checkbox was completed, the first part is marked as completed
- Time-of-day setting is replicated for all parts

#### Multi-part Checkbox → Checkbox
- If all parts were completed, the single checkbox is marked as completed
- Time-of-day setting is taken from the first part

#### Checkbox → Text/Emoji
- If the checkbox was completed, appropriate default values are set ("Выполнено" for text, "✅" for emoji)
- Checkbox state is cleared

#### Text/Emoji → Checkbox
- If the field had content, the checkbox is marked as completed
- Text/emoji values are cleared

#### Text ↔ Emoji
- Content is converted with appropriate defaults
- Original content is cleared

## Testing

A comprehensive test suite is included in `test-habit-type-conversion.js` that verifies:
1. Habit creation and initial state
2. Entry creation and strength calculation
3. Detailed warning message generation
4. Conversions between all supported habit types
5. Strength preservation through conversions
6. Proper entry data transformation

## Files Modified

1. `js/habits.js` - Added conversion logic and improved warning system
2. `js/entries.js` - Added entry conversion and enhanced strength calculation
3. `js/ui.js` - Added UI warnings for habit type changes using custom modals
4. `test-habit-type-conversion.js` - Comprehensive test suite
5. `run-tests.html` - Browser-based test runner
6. `HABIT_CONVERSION_IMPLEMENTATION.md` - This documentation

## Usage

When a user changes a habit type through the UI:
1. A detailed warning dialog is shown in a custom modal explaining the conversion implications
2. The user must confirm before proceeding
3. All existing entries are converted according to the defined logic
4. Habit strength is preserved throughout the process
5. The UI is refreshed to reflect the changes

## Edge Cases Handled

1. Empty or incomplete entries during conversion
2. Failed state preservation during conversions
3. Time-of-day settings migration
4. Strength calculation consistency across different habit types
5. Graceful handling of missing data structures

## Warning Message Examples

### Checkbox to Multi-part Checkbox
```
ВНИМАНИЕ: При конвертации из простого чекбокса в многочастевой (2 части):

• Существующие данные о выполнении будут преобразованы
• Если привычка была выполнена, ТОЛЬКО первая часть будет отмечена как выполненная
• Сила привычки сохранится, но способ подсчета изменится

Продолжить конвертацию?
```

### Text to Checkbox
```
ВНИМАНИЕ: При конвертации из текстового поля в простой чекбокс:

• Существующие записи будут преобразованы в состояние чекбокса
• Если поле было заполнено, привычка будет считаться ВЫПОЛНЕННОЙ
• Пустые поля будут считаться НЕВЫПОЛНЕННЫМИ
• Сила привычки сохранится, но способ подсчета изменится

Продолжить конвертацию?
```