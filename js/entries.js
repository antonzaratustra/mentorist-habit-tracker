// Entries module for Habit Tracker

class EntryManager {
  constructor() {
    this.entries = [];
    this.loadEntries();
  }

  /**
   * Load entries from storage
   */
  loadEntries() {
    this.entries = storage.getEntries();
  }

  /**
   * Save entries to storage
   */
  saveEntries() {
    storage.saveEntries(this.entries);
  }

  /**
   * Create a new entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} data - Entry data
   * @returns {Object} Created entry
   */
  createEntry(habitId, date, data = {}) {
    const now = getCurrentDate();
    const entry = {
      id: generateId(),
      habitId: habitId,
      date: date,
      checkboxState: data.checkboxState || {
        completed: false,
        failed: false,
        parts: []
      },
      textValue: data.textValue || "",
      emojiValue: data.emojiValue || "",
      comment: data.comment || "",
      createdAt: now,
      updatedAt: now
    };

    this.entries.push(entry);
    this.saveEntries();
    return entry;
  }

  /**
   * Get entry by habit ID and date
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Object|null} Entry object or null if not found
   */
  getEntry(habitId, date) {
    return this.entries.find(entry => 
      entry.habitId === habitId && entry.date === date
    ) || null;
  }

  /**
   * Update entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} updates - Updates to apply
   * @returns {Object|null} Updated entry or null if not found
   */
  updateEntry(habitId, date, updates) {
    const entry = this.getEntry(habitId, date);
    if (!entry) return null;

    Object.assign(entry, updates, { updatedAt: getCurrentDate() });
    this.saveEntries();
    return entry;
  }

  /**
   * Delete entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   */
  deleteEntry(habitId, date) {
    this.entries = this.entries.filter(entry => 
      !(entry.habitId === habitId && entry.date === date)
    );
    this.saveEntries();
  }

  /**
   * Get all entries for a habit
   * @param {string} habitId - Habit ID
   * @returns {Array} Entries for the habit
   */
  getEntriesByHabit(habitId) {
    return this.entries.filter(entry => entry.habitId === habitId);
  }

  /**
   * Get all entries for a date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Array} Entries for the date
   */
  getEntriesByDate(date) {
    return this.entries.filter(entry => entry.date === date);
  }

  /**
   * Toggle checkbox state for an entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number|null} partIndex - Part index for multi-part checkboxes (null for single)
   * @returns {Object} Updated entry
   */
  toggleCheckboxState(habitId, date, partIndex = null) {
    let entry = this.getEntry(habitId, date);
    
    // Create entry if it doesn't exist
    if (!entry) {
      entry = this.createEntry(habitId, date);
    }

    // Get the habit for strength calculations
    const habit = habitManager.getHabitById(habitId);
    if (!habit) return entry;

    // Handle multi-part checkboxes
    if (partIndex !== null) {
      // Initialize parts array if needed
      const habitType = habit.type;
      const partsCount = habitType.startsWith('checkbox_') ? parseInt(habitType.split('_')[1]) : 1;
      
      if (!entry.checkboxState.parts || entry.checkboxState.parts.length === 0) {
        entry.checkboxState.parts = Array(partsCount).fill(false);
      }
      
      // Toggle the specific part
      entry.checkboxState.parts[partIndex] = !entry.checkboxState.parts[partIndex];
      
      // Recalculate habit strength based on current state
      this.recalculateHabitStrength(habitId);
    } else {
      // Handle single checkbox: empty → completed → failed → empty
      if (!entry.checkboxState.completed && !entry.checkboxState.failed) {
        entry.checkboxState.completed = true;
      } else if (entry.checkboxState.completed && !entry.checkboxState.failed) {
        entry.checkboxState.completed = false;
        entry.checkboxState.failed = true;
      } else {
        entry.checkboxState.completed = false;
        entry.checkboxState.failed = false;
      }
      
      // Recalculate habit strength based on current state
      this.recalculateHabitStrength(habitId);
    }

    entry.updatedAt = getCurrentDate();
    this.saveEntries();
    return entry;
  }

  /**
   * Set text value for an entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} textValue - Text value to set
   * @returns {Object} Updated entry
   */
  setTextValue(habitId, date, textValue) {
    let entry = this.getEntry(habitId, date);
    
    // Create entry if it doesn't exist
    if (!entry) {
      entry = this.createEntry(habitId, date);
    }

    entry.textValue = textValue;
    entry.updatedAt = getCurrentDate();
    this.saveEntries();
    return entry;
  }

  /**
   * Set emoji value for an entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} emojiValue - Emoji value to set
   * @returns {Object} Updated entry
   */
  setEmojiValue(habitId, date, emojiValue) {
    let entry = this.getEntry(habitId, date);
    
    // Create entry if it doesn't exist
    if (!entry) {
      entry = this.createEntry(habitId, date);
    }

    entry.emojiValue = emojiValue;
    entry.updatedAt = getCurrentDate();
    this.saveEntries();
    return entry;
  }

  /**
   * Set comment for an entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {string} comment - Comment to set
   * @returns {Object} Updated entry
   */
  setComment(habitId, date, comment) {
    console.log('setComment called with:', { habitId, date, comment });
    
    let entry = this.getEntry(habitId, date);
    console.log('Existing entry:', entry);
    
    // Create entry if it doesn't exist
    if (!entry) {
      entry = this.createEntry(habitId, date);
      console.log('Created new entry:', entry);
    }

    entry.comment = comment;
    entry.updatedAt = getCurrentDate();
    this.saveEntries();
    console.log('Saved entry with comment:', entry);
    return entry;
  }

  /**
   * Recalculate habit strength based on all entries for this habit
   * @param {string} habitId - Habit ID
   */
  recalculateHabitStrength(habitId) {
    const habit = habitManager.getHabitById(habitId);
    if (!habit) return;
    
    // Get all entries for this habit
    const habitEntries = this.getEntriesByHabit(habitId);
    
    // Calculate strength based on current entries
    let strength = 0;
    
    habitEntries.forEach(entry => {
      if (habit.type === 'checkbox') {
        // For simple checkboxes, strength is 1 if completed
        if (entry.checkboxState.completed) {
          strength += 1;
        }
      } else if (habit.type.startsWith('checkbox_')) {
        // For multi-part checkboxes, strength is number of completed parts
        if (entry.checkboxState.parts) {
          strength += entry.checkboxState.parts.filter(part => part).length;
        }
      } else if (habit.type === 'text') {
        // For text entries, strength is 1 if text is not empty
        if (entry.textValue && entry.textValue.trim() !== '') {
          strength += 1;
        }
      } else if (habit.type === 'emoji') {
        // For emoji entries, strength is 1 if emoji is selected
        if (entry.emojiValue && entry.emojiValue.trim() !== '') {
          strength += 1;
        }
      }
    });
    
    // Update habit strength
    habit.strength = strength;
    habitManager.saveHabits();
  }

  /**
   * Mark missed days as failed
   * This should be called periodically (e.g., daily or on app start)
   */
  markMissedDays() {
    // This would integrate with the habit manager to get active habits
    // and mark missed days as failed
    console.log("Marking missed days as failed - implementation pending");
  }

  /**
   * Get all entries
   * @returns {Array} All entries
   */
  getAllEntries() {
    return [...this.entries];
  }

  /**
   * Convert entry data when habit type changes
   * This ensures data is properly migrated when converting between habit types
   * @param {string} habitId - Habit ID
   * @param {string} oldType - Old habit type
   * @param {string} newType - New habit type
   */
  convertEntriesForHabitTypeChange(habitId, oldType, newType) {
    // No conversion needed if types are the same
    if (oldType === newType) {
      return;
    }
    
    // Get all entries for this habit
    const entries = this.getEntriesByHabit(habitId);
    
    // Convert each entry based on type change
    entries.forEach(entry => {
      // Initialize checkboxState if it doesn't exist
      if (!entry.checkboxState) {
        entry.checkboxState = { completed: false, failed: false, parts: [] };
      }
      
      // Convert from checkbox to multi-part
      if (oldType === 'checkbox' && newType.startsWith('checkbox_')) {
        const partsCount = parseInt(newType.split('_')[1]);
        // Convert single checkbox state to multi-part
        const oldCompleted = entry.checkboxState.completed || false;
        entry.checkboxState.parts = Array(partsCount).fill(false);
        // If the single checkbox was completed, mark first part as completed
        if (oldCompleted) {
          entry.checkboxState.parts[0] = true;
        }
        // Preserve failed state
        // Clear single checkbox state
        delete entry.checkboxState.completed;
      }
      // Convert from multi-part to checkbox
      else if (oldType.startsWith('checkbox_') && newType === 'checkbox') {
        // If all parts were completed, mark as completed
        const allPartsCompleted = entry.checkboxState.parts && entry.checkboxState.parts.every(part => part);
        entry.checkboxState.completed = allPartsCompleted || false;
        // Preserve failed state
        // Clear parts array
        delete entry.checkboxState.parts;
      }
      // Convert from text/emoji to checkbox
      else if ((oldType === 'text' || oldType === 'emoji') && newType === 'checkbox') {
        // If there was content, mark as completed
        const hasContent = (oldType === 'text' && entry.textValue && entry.textValue.trim() !== '') ||
                          (oldType === 'emoji' && entry.emojiValue && entry.emojiValue.trim() !== '');
        entry.checkboxState.completed = hasContent || false;
        // Clear text/emoji values
        if (oldType === 'text') {
          entry.textValue = '';
        } else if (oldType === 'emoji') {
          entry.emojiValue = '';
        }
      }
      // Convert from checkbox to text
      else if (oldType === 'checkbox' && newType === 'text') {
        // If checkbox was completed, add some default content
        if (entry.checkboxState.completed) {
          entry.textValue = 'Выполнено';
        } else {
          entry.textValue = '';
        }
        // Clear checkbox state
        entry.checkboxState = { completed: false, failed: entry.checkboxState.failed || false, parts: [] };
      }
      // Convert from checkbox to emoji
      else if (oldType === 'checkbox' && newType === 'emoji') {
        // If checkbox was completed, add default emoji
        if (entry.checkboxState.completed) {
          entry.emojiValue = '✅';
        } else {
          entry.emojiValue = '';
        }
        // Clear checkbox state
        entry.checkboxState = { completed: false, failed: entry.checkboxState.failed || false, parts: [] };
      }
      // Convert from text to emoji
      else if (oldType === 'text' && newType === 'emoji') {
        // If text had content, add default emoji
        if (entry.textValue && entry.textValue.trim() !== '') {
          entry.emojiValue = '😊';
        } else {
          entry.emojiValue = '';
        }
        // Clear text value
        entry.textValue = '';
      }
      // Convert from emoji to text
      else if (oldType === 'emoji' && newType === 'text') {
        // If emoji had value, add default text
        if (entry.emojiValue && entry.emojiValue.trim() !== '') {
          entry.textValue = 'Запись сделана';
        } else {
          entry.textValue = '';
        }
        // Clear emoji value
        entry.emojiValue = '';
      }
      // Convert from multi-part to text
      else if (oldType.startsWith('checkbox_') && newType === 'text') {
        // Count completed parts
        const completedParts = entry.checkboxState.parts ? 
          entry.checkboxState.parts.filter(part => part).length : 0;
        // Create descriptive text
        if (completedParts > 0) {
          const totalParts = entry.checkboxState.parts ? entry.checkboxState.parts.length : 0;
          entry.textValue = `Выполнено ${completedParts} из ${totalParts} частей`;
        } else {
          entry.textValue = '';
        }
        // Clear checkbox state
        entry.checkboxState = { completed: false, failed: entry.checkboxState.failed || false, parts: [] };
      }
      // Convert from multi-part to emoji
      else if (oldType.startsWith('checkbox_') && newType === 'emoji') {
        // Count completed parts
        const completedParts = entry.checkboxState.parts ? 
          entry.checkboxState.parts.filter(part => part).length : 0;
        // Select emoji based on completion
        if (completedParts > 0) {
          const totalParts = entry.checkboxState.parts ? entry.checkboxState.parts.length : 0;
          if (completedParts === totalParts) {
            entry.emojiValue = '✅'; // All parts completed
          } else {
            entry.emojiValue = '🔄'; // Partially completed
          }
        } else {
          entry.emojiValue = '';
        }
        // Clear checkbox state
        entry.checkboxState = { completed: false, failed: entry.checkboxState.failed || false, parts: [] };
      }
      
      // Save the converted entry
      this.saveEntries();
    });
    
    // Recalculate habit strength after conversion
    this.recalculateHabitStrength(habitId);
  }

}

// Create a singleton instance
const entryManager = new EntryManager();

// Make it available globally
window.entryManager = entryManager;