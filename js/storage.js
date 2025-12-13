// Storage module for Habit Tracker

class Storage {
  constructor() {
    this.HABITS_KEY = 'habits';
    this.ENTRIES_KEY = 'entries';
    this.SETTINGS_KEY = 'settings';
  }

  /**
   * Get data from localStorage
   * @param {string} key - Key to retrieve
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Retrieved data
   */
  getData(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Save data to localStorage
   * @param {string} key - Key to save under
   * @param {any} data - Data to save
   */
  setData(key, data) {
    try {
      console.log(`Saving data to ${key}:`, data);
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Data saved successfully to ${key}`);
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
    }
  }

  /**
   * Get all habits
   * @returns {Array} Array of habits
   */
  getHabits() {
    return this.getData(this.HABITS_KEY, []);
  }

  /**
   * Save all habits
   * @param {Array} habits - Array of habits to save
   */
  saveHabits(habits) {
    this.setData(this.HABITS_KEY, habits);
  }

  /**
   * Get habit by ID
   * @param {string} id - Habit ID
   * @returns {Object|null} Habit object or null if not found
   */
  getHabitById(id) {
    const habits = this.getHabits();
    return habits.find(habit => habit.id === id) || null;
  }

  /**
   * Add a new habit
   * @param {Object} habit - Habit object to add
   */
  addHabit(habit) {
    const habits = this.getHabits();
    habits.push(habit);
    this.saveHabits(habits);
  }

  /**
   * Update an existing habit
   * @param {Object} updatedHabit - Updated habit object
   */
  updateHabit(updatedHabit) {
    const habits = this.getHabits();
    const index = habits.findIndex(habit => habit.id === updatedHabit.id);
    if (index !== -1) {
      habits[index] = updatedHabit;
      this.saveHabits(habits);
    }
  }

  /**
   * Delete a habit by ID
   * @param {string} id - Habit ID to delete
   */
  deleteHabit(id) {
    const habits = this.getHabits();
    const filteredHabits = habits.filter(habit => habit.id !== id);
    this.saveHabits(filteredHabits);
  }

  /**
   * Get all entries
   * @returns {Array} Array of entries
   */
  getEntries() {
    return this.getData(this.ENTRIES_KEY, []);
  }

  /**
   * Save all entries
   * @param {Array} entries - Array of entries to save
   */
  saveEntries(entries) {
    console.log('saveEntries called with:', entries);
    this.setData(this.ENTRIES_KEY, entries);
  }

  /**
   * Get entries for a specific habit and date
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Object|null} Entry object or null if not found
   */
  getEntry(habitId, date) {
    const entries = this.getEntries();
    return entries.find(entry => entry.habitId === habitId && entry.date === date) || null;
  }

  /**
   * Add or update an entry
   * @param {Object} entry - Entry object to save
   */
  saveEntry(entry) {
    const entries = this.getEntries();
    const index = entries.findIndex(e => e.habitId === entry.habitId && e.date === entry.date);
    
    if (index !== -1) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    
    this.saveEntries(entries);
  }

  /**
   * Delete an entry
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   */
  deleteEntry(habitId, date) {
    const entries = this.getEntries();
    const filteredEntries = entries.filter(entry => 
      !(entry.habitId === habitId && entry.date === date)
    );
    this.saveEntries(filteredEntries);
  }

  /**
   * Get settings
   * @returns {Object} Settings object
   */
  getSettings() {
    return this.getData(this.SETTINGS_KEY, {
      theme: 'light',
      accentColor: '#FF8C42'
    });
  }

  /**
   * Save settings
   * @param {Object} settings - Settings object to save
   */
  saveSettings(settings) {
    this.setData(this.SETTINGS_KEY, settings);
  }

  /**
   * Get entries for a specific habit
   * @param {string} habitId - Habit ID
   * @returns {Array} Array of entries for the habit
   */
  getEntriesByHabitId(habitId) {
    const entries = this.getEntries();
    return entries.filter(entry => entry.habitId === habitId);
  }

  /**
   * Get entries for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Array} Array of entries for the date
   */
  getEntriesByDate(date) {
    const entries = this.getEntries();
    return entries.filter(entry => entry.date === date);
  }

  /**
   * Clear all data (for testing purposes)
   */
  clearAllData() {
    localStorage.removeItem(this.HABITS_KEY);
    localStorage.removeItem(this.ENTRIES_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }
}

// Create a singleton instance
const storage = new Storage();

// Make it available globally
window.storage = storage;