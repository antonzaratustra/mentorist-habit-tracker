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
    
    // Recalculate habit strength after updating entry
    this.recalculateHabitStrength(habitId);
    
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
    
    // Recalculate habit strength after updating entry
    this.recalculateHabitStrength(habitId);
    
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
    
    // Recalculate habit strength after updating entry
    this.recalculateHabitStrength(habitId);
    
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
    
    // Recalculate habit strength after updating entry
    this.recalculateHabitStrength(habitId);
    
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
    
    // Sort entries by date to process chronologically
    habitEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate strength based on current entries
    let strength = 0;
    
    habitEntries.forEach(entry => {
      if (habit.type === 'checkbox') {
        // For simple checkboxes:
        // +1 for completed, -1 for failed (but never below 0)
        if (entry.checkboxState.completed) {
          strength = Math.max(0, strength + 1);
        } else if (entry.checkboxState.failed) {
          strength = Math.max(0, strength - 1);
        }
      } else if (habit.type.startsWith('checkbox_')) {
        // For multi-part checkboxes, calculate proportional strength changes
        const partsCount = parseInt(habit.type.split('_')[1]);
        const incrementPerPart = 1 / partsCount; // e.g., 0.25 for 4 parts
        
        if (entry.checkboxState.parts) {
          // Count completed parts
          const completedParts = entry.checkboxState.parts.filter(part => part).length;
          // Add proportional strength for completed parts
          strength = Math.max(0, strength + (completedParts * incrementPerPart));
        }
        
        // If the entry is marked as failed (missed day), decrease strength
        if (entry.checkboxState.failed) {
          strength = Math.max(0, strength - 1);
        }
      } else if (habit.type === 'text') {
        // For text entries:
        // +1 if text is not empty, -1 if explicitly marked as failed (but never below 0)
        if (entry.textValue && entry.textValue.trim() !== '') {
          strength = Math.max(0, strength + 1);
        } else if (entry.checkboxState.failed) {
          strength = Math.max(0, strength - 1);
        }
      } else if (habit.type === 'emoji') {
        // For emoji entries:
        // +1 if emoji is selected, -1 if explicitly marked as failed (but never below 0)
        if (entry.emojiValue && entry.emojiValue.trim() !== '') {
          strength = Math.max(0, strength + 1);
        } else if (entry.checkboxState.failed) {
          strength = Math.max(0, strength - 1);
        }
      }
    });
    
    // Update habit strength (rounded to 2 decimal places for precision)
    habit.strength = Math.round(strength * 100) / 100;
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
}

// Create a singleton instance
const entryManager = new EntryManager();

// Make it available globally
window.entryManager = entryManager;