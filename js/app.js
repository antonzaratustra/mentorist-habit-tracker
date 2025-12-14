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
    
    // Set up event listeners after DOM is loaded
    this.setupEventListeners();
    
    // Initialize accent color picker
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initAccentColorPicker();
        // Apply accent color after DOM is loaded and theme is set
        const accentColor = settings.accentColor || '#FF8C42';
        this.applyAccentColor(accentColor);
      });
    } else {
      this.initAccentColorPicker();
      // Apply accent color after theme is set
      const accentColor = settings.accentColor || '#FF8C42';
      this.applyAccentColor(accentColor);
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.bindEvents();
      });
    } else {
      // DOM is already loaded
      this.bindEvents();
    }
  }

  /**
   * Bind event listeners to UI elements
   */
  bindEvents() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Accent color toggle
    const accentColorToggle = document.getElementById('accent-color-toggle');
    if (accentColorToggle) {
      accentColorToggle.addEventListener('click', () => this.openAccentColorPicker());
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
    
    // Reapply accent color to ensure it's not overridden by theme switch
    const accentColor = settings.accentColor || '#FF8C42';
    this.applyAccentColor(accentColor);
  }

  /**
   * Apply accent color to CSS variables
   * @param {string} color - Hex color code
   */
  applyAccentColor(color) {
    // Define color variations
    const colorVariations = {
      '#FF8C42': { // Orange
        '--accent-color': '#FF8C42',
        '--success-color': '#FF8C42',
        '--partial-color': 'linear-gradient(45deg, #FF8C42, #FFB178)',
        '--highlight-color': 'rgba(255, 140, 66, 0.3)',
        '--completed-week-color': 'rgba(255, 140, 66, 0.4)'
      },
      '#4285F4': { // Blue
        '--accent-color': '#4285F4',
        '--success-color': '#4285F4',
        '--partial-color': 'linear-gradient(45deg, #4285F4, #76a9f9)',
        '--highlight-color': 'rgba(66, 133, 244, 0.3)',
        '--completed-week-color': 'rgba(66, 133, 244, 0.4)'
      },
      '#0F9D58': { // Green
        '--accent-color': '#0F9D58',
        '--success-color': '#0F9D58',
        '--partial-color': 'linear-gradient(45deg, #0F9D58, #42bf80)',
        '--highlight-color': 'rgba(15, 157, 88, 0.3)',
        '--completed-week-color': 'rgba(15, 157, 88, 0.4)'
      },
      '#F44336': { // Red
        '--accent-color': '#F44336',
        '--success-color': '#F44336',
        '--partial-color': 'linear-gradient(45deg, #F44336, #f87669)',
        '--highlight-color': 'rgba(244, 67, 54, 0.3)',
        '--completed-week-color': 'rgba(244, 67, 54, 0.4)'
      },
      '#9C27B0': { // Purple
        '--accent-color': '#9C27B0',
        '--success-color': '#9C27B0',
        '--partial-color': 'linear-gradient(45deg, #9C27B0, #c25ddd)',
        '--highlight-color': 'rgba(156, 39, 176, 0.3)',
        '--completed-week-color': 'rgba(156, 39, 176, 0.4)'
      },
      '#FF9800': { // Amber
        '--accent-color': '#FF9800',
        '--success-color': '#FF9800',
        '--partial-color': 'linear-gradient(45deg, #FF9800, #ffb94d)',
        '--highlight-color': 'rgba(255, 152, 0, 0.3)',
        '--completed-week-color': 'rgba(255, 152, 0, 0.4)'
      }
    };
    
    // Apply the selected color variation
    const variations = colorVariations[color] || colorVariations['#FF8C42'];
    
    // Apply directly to the body element with higher specificity
    const body = document.body;
    for (const [property, value] of Object.entries(variations)) {
      body.style.setProperty(property, value, 'important');
    }
    
    // Update selected state in color picker
    document.querySelectorAll('.color-option').forEach(option => {
      option.classList.remove('selected');
      if (option.dataset.color === color) {
        option.classList.add('selected');
      }
    });
    
    console.log('Applied accent color:', color);
  }

  /**
   * Initialize accent color picker event listeners
   */
  initAccentColorPicker() {
    // Use event delegation to handle color selection
    const modal = document.getElementById('accent-color-modal');
    if (!modal) return;
    
    // Remove any existing event listeners by cloning and replacing
    const newModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(newModal, modal);
    
    // Add event listener to the modal container using event delegation
    newModal.addEventListener('click', (e) => {
      // Handle click on color options
      if (e.target.classList.contains('color-option')) {
        const color = e.target.dataset.color;
        this.applyAccentColor(color);
        
        // Save setting
        const settings = storage.getSettings();
        settings.accentColor = color;
        storage.saveSettings(settings);
        
        // Close modal
        newModal.classList.add('hidden');
        return;
      }
      
      // Handle close button
      if (e.target.id === 'accent-color-close' || e.target.classList.contains('close-button')) {
        newModal.classList.add('hidden');
        return;
      }
      
      // Handle click outside to close
      if (e.target === newModal) {
        newModal.classList.add('hidden');
        return;
      }
    });
  }

  /**
   * Open accent color picker modal
   */
  openAccentColorPicker() {
    const modal = document.getElementById('accent-color-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
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