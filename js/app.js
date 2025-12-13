// Main application file for Habit Tracker

class HabitTrackerApp {
  constructor() {
    this.ui = null;
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('Initializing Habit Tracker App...');
    
    // Load settings
    this.loadSettings();
    
    // Initialize UI
    this.initUI();
    
    // Mark missed days
    this.markMissedDays();
    
    // Set up periodic tasks
    this.setupPeriodicTasks();
    
    console.log('Habit Tracker App initialized!');
  }

  /**
   * Load application settings
   */
  loadSettings() {
    const settings = storage.getSettings();
    
    // Apply theme - default to dark theme
    const theme = settings.theme || 'dark';
    document.body.className = `theme-${theme}`;
    
    // Set up theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  /**
   * Initialize UI
   */
  initUI() {
    this.ui = new UIManager();
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.className = `theme-${newTheme}`;
    
    // Update theme toggle button emoji
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Save setting
    const settings = storage.getSettings();
    settings.theme = newTheme;
    storage.saveSettings(settings);
  }

  /**
   * Mark missed days as failed
   */
  markMissedDays() {
    // Get all active habits
    const habits = habitManager.getActiveHabits();
    const today = getCurrentDate();
    
    // For each habit, check the last 7 days
    habits.forEach(habit => {
      const weekDates = getWeekDates();
      
      weekDates.forEach(date => {
        // Skip today and future dates
        if (date >= today) return;
        
        // Check if entry exists
        const entry = entryManager.getEntry(habit.id, date);
        
        // If no entry exists, create a failed entry
        if (!entry) {
          entryManager.createEntry(habit.id, date, {
            checkboxState: {
              completed: false,
              failed: true,
              parts: []
            }
          });
        }
      });
    });
  }

  /**
   * Set up periodic tasks
   */
  setupPeriodicTasks() {
    // Check for missed days every hour
    setInterval(() => {
      this.markMissedDays();
      if (this.ui) {
        this.ui.render();
      }
    }, 60 * 60 * 1000); // Every hour
    
    // Update UI every minute to refresh timestamps
    setInterval(() => {
      if (this.ui) {
        this.ui.render();
      }
    }, 60 * 1000); // Every minute
  }

  /**
   * Clean up resources when app is closed
   */
  destroy() {
    // Any cleanup code would go here
    console.log('Habit Tracker App destroyed');
  }
}

// Initialize the app when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.habitTrackerApp = new HabitTrackerApp();
});

// Make it available globally
window.HabitTrackerApp = HabitTrackerApp;