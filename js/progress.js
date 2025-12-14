// Progress calculation module for Habit Tracker

class ProgressManager {
  constructor() {
    this.lifeSpheres = {
      'purpose': '🎯 Призвание',
      'spirituality': '🌀 Духовность',
      'relationships': '🤝 Отношения',
      'environment': '🏠 Окружение',
      'self-development': '📚 Саморазвитие',
      'finances': '💰 Финансы',
      'brightness': '🎉 Яркость жизни',
      'health': '❤️ Здоровье'
    };
  }

  /**
   * Calculate progress for a specific life sphere
   * @param {string} lifeSphere - Life sphere to calculate progress for
   * @returns {Object} Progress information
   */
  calculateLifeSphereProgress(lifeSphere) {
    // Get all habits associated with this life sphere
    const habits = habitManager.getAllHabits().filter(habit => habit.lifeSphere === lifeSphere);
    
    if (habits.length === 0) {
      return {
        percentage: 0,
        completed: 0,
        total: 0
      };
    }
    
    // Calculate completion for today
    const today = getCurrentDate();
    let completedHabits = 0;
    
    habits.forEach(habit => {
      const entry = entryManager.getEntry(habit.id, today);
      if (entry) {
        if (habit.type === 'checkbox' && entry.checkboxState.completed) {
          completedHabits++;
        } else if (habit.type.startsWith('checkbox_')) {
          const partsCount = parseInt(habit.type.split('_')[1]);
          const filledParts = entry.checkboxState.parts ? 
            entry.checkboxState.parts.filter(Boolean).length : 0;
          if (filledParts === partsCount) {
            completedHabits++;
          }
        } else if (habit.type === 'text' && entry.textValue.trim() !== '') {
          completedHabits++;
        } else if (habit.type === 'emoji' && entry.emojiValue.trim() !== '') {
          completedHabits++;
        }
      }
    });
    
    const percentage = Math.round((completedHabits / habits.length) * 100);
    
    return {
      percentage: percentage,
      completed: completedHabits,
      total: habits.length
    };
  }

  /**
   * Calculate progress for a specific value
   * @param {string} value - Value to calculate progress for
   * @returns {Object} Progress information
   */
  calculateValueProgress(value) {
    // Get all habits associated with this value
    const habits = habitManager.getAllHabits().filter(habit => habit.values.includes(value));
    
    if (habits.length === 0) {
      return {
        percentage: 0,
        completed: 0,
        total: 0
      };
    }
    
    // Calculate completion for today
    const today = getCurrentDate();
    let completedHabits = 0;
    
    habits.forEach(habit => {
      const entry = entryManager.getEntry(habit.id, today);
      if (entry) {
        if (habit.type === 'checkbox' && entry.checkboxState.completed) {
          completedHabits++;
        } else if (habit.type.startsWith('checkbox_')) {
          const partsCount = parseInt(habit.type.split('_')[1]);
          const filledParts = entry.checkboxState.parts ? 
            entry.checkboxState.parts.filter(Boolean).length : 0;
          if (filledParts === partsCount) {
            completedHabits++;
          }
        } else if (habit.type === 'text' && entry.textValue.trim() !== '') {
          completedHabits++;
        } else if (habit.type === 'emoji' && entry.emojiValue.trim() !== '') {
          completedHabits++;
        }
      }
    });
    
    const percentage = Math.round((completedHabits / habits.length) * 100);
    
    return {
      percentage: percentage,
      completed: completedHabits,
      total: habits.length
    };
  }

  /**
   * Calculate progress for a specific goal
   * @param {string} goal - Goal to calculate progress for
   * @returns {Object} Progress information
   */
  calculateGoalProgress(goal) {
    // Get all habits associated with this goal
    const habits = habitManager.getAllHabits().filter(habit => habit.goals.includes(goal));
    
    if (habits.length === 0) {
      return {
        percentage: 0,
        completed: 0,
        total: 0
      };
    }
    
    // Calculate completion for today
    const today = getCurrentDate();
    let completedHabits = 0;
    
    habits.forEach(habit => {
      const entry = entryManager.getEntry(habit.id, today);
      if (entry) {
        if (habit.type === 'checkbox' && entry.checkboxState.completed) {
          completedHabits++;
        } else if (habit.type.startsWith('checkbox_')) {
          const partsCount = parseInt(habit.type.split('_')[1]);
          const filledParts = entry.checkboxState.parts ? 
            entry.checkboxState.parts.filter(Boolean).length : 0;
          if (filledParts === partsCount) {
            completedHabits++;
          }
        } else if (habit.type === 'text' && entry.textValue.trim() !== '') {
          completedHabits++;
        } else if (habit.type === 'emoji' && entry.emojiValue.trim() !== '') {
          completedHabits++;
        }
      }
    });
    
    const percentage = Math.round((completedHabits / habits.length) * 100);
    
    return {
      percentage: percentage,
      completed: completedHabits,
      total: habits.length
    };
  }

  /**
   * Get progress for all life spheres
   * @returns {Object} Progress information for all life spheres
   */
  getAllLifeSpheresProgress() {
    const progress = {};
    
    Object.keys(this.lifeSpheres).forEach(sphere => {
      progress[sphere] = this.calculateLifeSphereProgress(sphere);
    });
    
    return progress;
  }

  /**
   * Get progress for all values
   * @returns {Object} Progress information for all values
   */
  getAllValuesProgress() {
    const allHabits = habitManager.getAllHabits();
    const allValues = filterManager.getAllValues(allHabits);
    const progress = {};
    
    allValues.forEach(value => {
      progress[value] = this.calculateValueProgress(value);
    });
    
    return progress;
  }

  /**
   * Get progress for all goals
   * @returns {Object} Progress information for all goals
   */
  getAllGoalsProgress() {
    const allHabits = habitManager.getAllHabits();
    const allGoals = filterManager.getAllGoals(allHabits);
    const progress = {};
    
    allGoals.forEach(goal => {
      progress[goal] = this.calculateGoalProgress(goal);
    });
    
    return progress;
  }
}

// Create a singleton instance
const progressManager = new ProgressManager();

// Make it available globally
window.progressManager = progressManager;