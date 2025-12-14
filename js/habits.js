// Habits module for Habit Tracker

class HabitManager {
  constructor() {
    this.habits = [];
    this.loadHabits();
  }

  /**
   * Load habits from storage
   */
  loadHabits() {
    this.habits = storage.getHabits();
  }

  /**
   * Save habits to storage
   */
  saveHabits() {
    console.log('Saving habits:', this.habits);
    storage.saveHabits(this.habits);
  }

  /**
   * Create a new habit
   * @param {Object} habitData - Habit data
   * @returns {Object} Created habit
   */
  createHabit(habitData) {
    const now = getCurrentDate();
    const habit = {
      id: generateId(),
      name: habitData.name,
      type: habitData.type,
      emojiOptions: habitData.emojiOptions || [],
      tags: habitData.tags || [],
      lifeSphere: habitData.lifeSphere || '',
      values: habitData.values || [],
      goals: habitData.goals || [],
      timeOfDay: habitData.timeOfDay || { single: "day" },
      status: habitData.status || "active", // Use provided status or default to active
      strength: 0,
      createdAt: now,
      updatedAt: now
    };

    this.habits.push(habit);
    console.log('Created habit:', habit);
    this.saveHabits();
    return habit;
  }

  /**
   * Get habit by ID
   * @param {string} id - Habit ID
   * @returns {Object|null} Habit object or null if not found
   */
  getHabitById(id) {
    return this.habits.find(habit => habit.id === id) || null;
  }

  /**
   * Update habit
   * @param {string} id - Habit ID
   * @param {Object} updates - Updates to apply
   * @returns {Object|null} Updated habit or null if not found
   */
  updateHabit(id, updates) {
    const habit = this.getHabitById(id);
    if (!habit) return null;

    // Merge updates with existing habit
    Object.assign(habit, updates, { updatedAt: getCurrentDate() });
    
    // Handle type conversion logic
    if (updates.type && updates.type !== habit.type) {
      this.convertHabitType(habit, updates.type);
    }

    this.saveHabits();
    return habit;
  }

  /**
   * Convert habit type and handle data conversion
   * @param {Object} habit - Habit object
   * @param {string} newType - New type to convert to
   */
  convertHabitType(habit, newType) {
    const oldType = habit.type;
    const oldTimeOfDay = {...habit.timeOfDay};
    
    // Store the old strength to preserve it during conversion
    const oldStrength = habit.strength || 0;
    
    // Handle conversions that might lose data with proper warnings
    const conversionWarning = this.getConversionWarning(oldType, newType);
    if (conversionWarning) {
      console.warn(conversionWarning);
      // In a real implementation, this would trigger a UI warning dialog
    }

    // Preserve existing entries before conversion
    const habitEntries = entryManager.getEntriesByHabit(habit.id);
    
    // Perform the type conversion
    habit.type = newType;

    // Handle time of day conversion
    if (oldType === 'checkbox' && newType.startsWith('checkbox_')) {
      // Single checkbox to multi-part
      const partsCount = parseInt(newType.split('_')[1]);
      habit.timeOfDay = {
        parts: Array(partsCount).fill().map((_, i) => ({
          partIndex: i,
          time: oldTimeOfDay.single || 'day'
        }))
      };
    } else if (oldType.startsWith('checkbox_') && newType === 'checkbox') {
      // Multi-part to single checkbox
      habit.timeOfDay = {
        single: oldTimeOfDay.parts && oldTimeOfDay.parts.length > 0 ? 
          oldTimeOfDay.parts[0].time : 'day'
      };
    } else if ((oldType === 'text' || oldType === 'emoji') && newType === 'checkbox') {
      // Text/emoji to checkbox - preserve time of day
      habit.timeOfDay = {
        single: oldTimeOfDay.single || 'day'
      };
    } else if (oldType === 'checkbox' && (newType === 'text' || newType === 'emoji')) {
      // Checkbox to text/emoji - preserve time of day
      habit.timeOfDay = {
        single: oldTimeOfDay.single || 'day'
      };
    } else if (oldType.startsWith('checkbox_') && (newType === 'text' || newType === 'emoji')) {
      // Multi-part to text/emoji - preserve time of day from first part
      habit.timeOfDay = {
        single: oldTimeOfDay.parts && oldTimeOfDay.parts.length > 0 ? 
          oldTimeOfDay.parts[0].time : 'day'
      };
    } else if ((oldType === 'text' || oldType === 'emoji') && newType.startsWith('checkbox_')) {
      // Text/emoji to multi-part
      const partsCount = parseInt(newType.split('_')[1]);
      habit.timeOfDay = {
        parts: Array(partsCount).fill().map((_, i) => ({
          partIndex: i,
          time: oldTimeOfDay.single || 'day'
        }))
      };
    }

    // Convert entries to match new habit type
    entryManager.convertEntriesForHabitTypeChange(habit.id, oldType, newType);
    
    // Preserve habit strength after conversion
    habit.strength = oldStrength;
    
    // Log the conversion for debugging
    console.log(`Converted habit ${habit.id} from ${oldType} to ${newType}`, {
      oldTimeOfDay,
      newTimeOfDay: habit.timeOfDay,
      preservedStrength: oldStrength
    });
  }

  /**
   * Get conversion warning message for potentially destructive conversions
   * @param {string} oldType - Old habit type
   * @param {string} newType - New habit type
   * @returns {string|null} Warning message or null if no warning needed
   */
  getConversionWarning(oldType, newType) {
    // No warning needed if types are the same
    if (oldType === newType) {
      return null;
    }
    
    // Conversions that might lose detailed data
    if (oldType.startsWith('checkbox_') && newType === 'checkbox') {
      const partsCount = oldType.split('_')[1];
      return `ВНИМАНИЕ: При конвертации из многочастевого чекбокса (${partsCount} части) в простой чекбокс:\n\n` +
             `• Детали выполнения частей будут потеряны\n` +
             `• Привычка будет считаться ВЫПОЛНЕННОЙ только если ВСЕ части были выполнены\n` +
             `• Сила привычки сохранится, но способ подсчета изменится\n\n` +
             `Продолжить конвертацию?`;
    }
    
    if (oldType === 'checkbox' && newType.startsWith('checkbox_')) {
      const partsCount = newType.split('_')[1];
      return `ВНИМАНИЕ: При конвертации из простого чекбокса в многочастевой (${partsCount} части):\n\n` +
             `• Существующие данные о выполнении будут преобразованы\n` +
             `• Если привычка была выполнена, ТОЛЬКО первая часть будет отмечена как выполненная\n` +
             `• Сила привычки сохранится, но способ подсчета изменится\n\n` +
             `Продолжить конвертацию?`;
    }
    
    if ((oldType === 'text' || oldType === 'emoji') && newType.includes('checkbox')) {
      return `ВНИМАНИЕ: При конвертации из ${this.getTypeDisplayName(oldType)} в ${this.getTypeDisplayName(newType)}:\n\n` +
             `• Существующие записи будут преобразованы в состояние чекбокса\n` +
             `• Если поле было заполнено, привычка будет считаться ВЫПОЛНЕННОЙ\n` +
             `• Пустые поля будут считаться НЕВЫПОЛНЕННЫМИ\n` +
             `• Сила привычки сохранится, но способ подсчета изменится\n\n` +
             `Продолжить конвертацию?`;
    }
    
    if (oldType.includes('checkbox') && (newType === 'text' || newType === 'emoji')) {
      return `ВНИМАНИЕ: При конвертации из ${this.getTypeDisplayName(oldType)} в ${this.getTypeDisplayName(newType)}:\n\n` +
             `• Существующие записи будут преобразованы в значения ${newType}\n` +
             `• Выполненные привычки получат значение "Выполнено" или "✅"\n` +
             `• Невыполненные привычки получат пустое значение\n` +
             `• Сила привычки сохранится, но способ подсчета изменится\n\n` +
             `Продолжить конвертацию?`;
    }
    
    if (oldType === 'text' && newType === 'emoji') {
      return `ВНИМАНИЕ: При конвертации из текстового поля в поле выбора эмодзи:\n\n` +
             `• Существующие текстовые записи будут преобразованы\n` +
             `• Заполненные поля получат значение "😊"\n` +
             `• Пустые поля останутся пустыми\n` +
             `• Сила привычки сохранится\n\n` +
             `Продолжить конвертацию?`;
    }
    
    if (oldType === 'emoji' && newType === 'text') {
      return `ВНИМАНИЕ: При конвертации из поля выбора эмодзи в текстовое поле:\n\n` +
             `• Существующие эмодзи будут преобразованы\n` +
             `• Заполненные поля получат значение "Запись сделана"\n` +
             `• Пустые поля останутся пустыми\n` +
             `• Сила привычки сохранится\n\n` +
             `Продолжить конвертацию?`;
    }
    
    // Handle conversion between different multi-part checkboxes
    if (oldType.startsWith('checkbox_') && newType.startsWith('checkbox_')) {
      const oldParts = oldType.split('_')[1];
      const newParts = newType.split('_')[1];
      return `ВНИМАНИЕ: При конвертации из многочастевого чекбокса (${oldParts} части) в многочастевой чекбокс (${newParts} части):\n\n` +
             `• Данные будут преобразованы согласно правилам конвертации\n` +
             `• Если количество частей увеличивается, новые части будут отмечены как НЕВЫПОЛНЕННЫЕ\n` +
             `• Если количество частей уменьшается, лишние части будут потеряны\n` +
             `• Сила привычки сохранится, но способ подсчета может измениться\n\n` +
             `Продолжить конвертацию?`;
    }
    
    return `ВНИМАНИЕ: При конвертации типа привычки из ${this.getTypeDisplayName(oldType)} в ${this.getTypeDisplayName(newType)}:\n\n` +
           `• Данные будут преобразованы согласно правилам конвертации\n` +
           `• Сила привычки сохранится, но способ подсчета может измениться\n\n` +
           `Продолжить конвертацию?`;
  }

  /**
   * Get display name for habit type
   * @param {string} type - Habit type
   * @returns {string} Display name
   */
  getTypeDisplayName(type) {
    const typeNames = {
      'checkbox': 'простой чекбокс',
      'checkbox_2': 'двухчастевой чекбокс',
      'checkbox_3': 'трехчастевой чекбокс',
      'checkbox_4': 'четырехчастевой чекбокс',
      'text': 'текстовое поле',
      'emoji': 'поле выбора эмодзи'
    };
    
    return typeNames[type] || type;
  }

  /**
   * Delete habit (move to trash)
   * @param {string} id - Habit ID
   */
  deleteHabit(id) {
    const habit = this.getHabitById(id);
    if (habit) {
      habit.status = 'trash';
      habit.updatedAt = getCurrentDate();
      this.saveHabits();
    }
  }

  /**
   * Permanently delete habit
   * @param {string} id - Habit ID
   */
  permanentlyDeleteHabit(id) {
    this.habits = this.habits.filter(habit => habit.id !== id);
    this.saveHabits();
  }

  /**
   * Archive habit
   * @param {string} id - Habit ID
   */
  archiveHabit(id) {
    const habit = this.getHabitById(id);
    if (habit) {
      habit.status = 'archived';
      habit.updatedAt = getCurrentDate();
      this.saveHabits();
    }
  }

  /**
   * Move habit to ideas
   * @param {string} id - Habit ID
   */
  moveToIdeas(id) {
    const habit = this.getHabitById(id);
    if (habit) {
      habit.status = 'idea';
      habit.updatedAt = getCurrentDate();
      this.saveHabits();
    }
  }

  /**
   * Restore habit from trash/archive/ideas
   * @param {string} id - Habit ID
   * @param {string} newStatus - New status (default: 'active')
   */
  restoreHabit(id, newStatus = 'active') {
    const habit = this.getHabitById(id);
    if (habit) {
      habit.status = newStatus;
      habit.updatedAt = getCurrentDate();
      this.saveHabits();
    }
  }

  /**
   * Get habits by status
   * @param {string} status - Status to filter by
   * @returns {Array} Filtered habits
   */
  getHabitsByStatus(status) {
    return this.habits.filter(habit => habit.status === status);
  }

  /**
   * Get active habits
   * @returns {Array} Active habits
   */
  getActiveHabits() {
    return this.getHabitsByStatus('active');
  }

  /**
   * Get habits by tag
   * @param {string} tag - Tag to filter by
   * @returns {Array} Filtered habits
   */
  getHabitsByTag(tag) {
    return this.habits.filter(habit => habit.tags.includes(tag));
  }

  /**
   * Get habits by time of day
   * @param {string} time - Time of day to filter by
   * @returns {Array} Filtered habits
   */
  getHabitsByTimeOfDay(time) {
    return this.habits.filter(habit => {
      if (habit.timeOfDay.single) {
        return habit.timeOfDay.single === time;
      }
      if (habit.timeOfDay.parts) {
        return habit.timeOfDay.parts.some(part => part.time === time);
      }
      return false;
    });
  }

  /**
   * Get habits by type
   * @param {string} type - Type to filter by
   * @returns {Array} Filtered habits
   */
  getHabitsByType(type) {
    return this.habits.filter(habit => habit.type === type);
  }

  /**
   * Calculate habit strength
   * @param {string} id - Habit ID
   * @returns {number} Strength value (0-100)
   */
  calculateHabitStrength(id) {
    const habit = this.getHabitById(id);
    if (!habit) return 0;

    // This would integrate with the entries system to calculate actual strength
    // For now, returning a placeholder value
    return habit.strength || 0;
  }

  /**
   * Update habit strength
   * @param {string} id - Habit ID
   * @param {number} strength - New strength value
   */
  updateHabitStrength(id, strength) {
    const habit = this.getHabitById(id);
    if (habit) {
      habit.strength = Math.max(0, Math.min(100, strength));
      habit.updatedAt = getCurrentDate();
      this.saveHabits();
    }
  }

  /**
   * Get all habits
   * @returns {Array} All habits
   */
  getAllHabits() {
    return [...this.habits];
  }
}

// Create a singleton instance
const habitManager = new HabitManager();

// Make it available globally
window.habitManager = habitManager;