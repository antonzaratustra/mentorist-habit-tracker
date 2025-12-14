// Progress calculation module for Habit Tracker

class ProgressManager {
  /**
   * Calculate progress for a life sphere
   * @param {string} lifeSphere - Life sphere name
   * @returns {Object} Progress information
   */
  static calculateLifeSphereProgress(lifeSphere) {
    // Get all habits associated with this life sphere
    const habits = habitManager.getAllHabits().filter(habit => 
      habit.lifeSphere === lifeSphere && habit.status === 'active'
    );
    
    if (habits.length === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }
    
    // Calculate completion based on habit strength
    let totalStrength = 0;
    habits.forEach(habit => {
      totalStrength += habit.strength || 0;
    });
    
    // Average strength as percentage (strength is 0-100)
    const percentage = Math.round(totalStrength / habits.length);
    
    return { 
      percentage, 
      completed: Math.round((percentage / 100) * habits.length), 
      total: habits.length 
    };
  }
  
  /**
   * Calculate progress for a value
   * @param {string} value - Value name
   * @returns {Object} Progress information
   */
  static calculateValueProgress(value) {
    // Get all habits associated with this value
    const habits = habitManager.getAllHabits().filter(habit => 
      habit.values && habit.values.includes(value) && habit.status === 'active'
    );
    
    if (habits.length === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }
    
    // Calculate completion based on habit strength
    let totalStrength = 0;
    habits.forEach(habit => {
      totalStrength += habit.strength || 0;
    });
    
    // Average strength as percentage (strength is 0-100)
    const percentage = Math.round(totalStrength / habits.length);
    
    return { 
      percentage, 
      completed: Math.round((percentage / 100) * habits.length), 
      total: habits.length 
    };
  }
  
  /**
   * Calculate progress for a goal
   * @param {string} goal - Goal name
   * @returns {Object} Progress information
   */
  static calculateGoalProgress(goal) {
    // Get all habits associated with this goal
    const habits = habitManager.getAllHabits().filter(habit => 
      habit.goals && habit.goals.includes(goal) && habit.status === 'active'
    );
    
    if (habits.length === 0) {
      return { percentage: 0, completed: 0, total: 0 };
    }
    
    // Calculate completion based on habit strength
    let totalStrength = 0;
    habits.forEach(habit => {
      totalStrength += habit.strength || 0;
    });
    
    // Average strength as percentage (strength is 0-100)
    const percentage = Math.round(totalStrength / habits.length);
    
    return { 
      percentage, 
      completed: Math.round((percentage / 100) * habits.length), 
      total: habits.length 
    };
  }
  
  /**
   * Get progress for all life spheres
   * @returns {Array} Array of life sphere progress objects
   */
  static getAllLifeSpheresProgress() {
    const lifeSpheres = filterManager.getAllLifeSpheres(habitManager.getAllHabits());
    return lifeSpheres.map(sphere => ({
      name: sphere,
      ...this.calculateLifeSphereProgress(sphere)
    }));
  }
  
  /**
   * Get progress for all values
   * @returns {Array} Array of value progress objects
   */
  static getAllValuesProgress() {
    const values = filterManager.getAllValues(habitManager.getAllHabits());
    return values.map(value => ({
      name: value,
      ...this.calculateValueProgress(value)
    }));
  }
  
  /**
   * Get progress for all goals
   * @returns {Array} Array of goal progress objects
   */
  static getAllGoalsProgress() {
    const goals = filterManager.getAllGoals(habitManager.getAllHabits());
    return goals.map(goal => ({
      name: goal,
      ...this.calculateGoalProgress(goal)
    }));
  }
}

// Make it available globally
window.ProgressManager = ProgressManager;