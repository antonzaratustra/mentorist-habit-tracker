// Filters and sorting module for Habit Tracker

class FilterManager {
  constructor() {
    // Filter manager doesn't need to store state locally
  }

  /**
   * Filter habits by status
   * @param {Array} habits - Array of habits
   * @param {string} status - Status to filter by
   * @returns {Array} Filtered habits
   */
  filterByStatus(habits, status) {
    if (!status) return habits;
    return habits.filter(habit => habit.status === status);
  }

  /**
   * Filter habits by tag
   * @param {Array} habits - Array of habits
   * @param {string} tag - Tag to filter by
   * @returns {Array} Filtered habits
   */
  filterByTag(habits, tag) {
    if (!tag) return habits;
    return habits.filter(habit => habit.tags.includes(tag));
  }

  /**
   * Filter habits by time of day
   * @param {Array} habits - Array of habits
   * @param {string} time - Time of day to filter by
   * @returns {Array} Filtered habits
   */
  filterByTimeOfDay(habits, time) {
    if (!time) return habits;
    return habits.filter(habit => {
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
   * Filter habits by type
   * @param {Array} habits - Array of habits
   * @param {string} type - Type to filter by
   * @returns {Array} Filtered habits
   */
  filterByType(habits, type) {
    if (!type) return habits;
    return habits.filter(habit => habit.type === type);
  }

  /**
   * Filter habits by strength
   * @param {Array} habits - Array of habits
   * @param {string} strength - Strength level to filter by
   * @returns {Array} Filtered habits
   */
  filterByStrength(habits, strength) {
    if (!strength) return habits;
    
    return habits.filter(habit => {
      const habitStrength = habit.strength || 0;
      
      switch (strength) {
        case 'weak':
          return habitStrength <= 5;
        case 'medium':
          return habitStrength > 5 && habitStrength <= 15;
        case 'strong':
          return habitStrength > 15;
        default:
          return true;
      }
    });
  }

  /**
   * Apply multiple filters
   * @param {Array} habits - Array of habits
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered habits
   */
  applyFilters(habits, filters) {
    let filtered = [...habits];
    
    if (filters.status) {
      filtered = this.filterByStatus(filtered, filters.status);
    }
    
    if (filters.tag) {
      filtered = this.filterByTag(filtered, filters.tag);
    }
    
    if (filters.timeOfDay) {
      filtered = this.filterByTimeOfDay(filtered, filters.timeOfDay);
    }
    
    if (filters.type) {
      filtered = this.filterByType(filtered, filters.type);
    }
    
    if (filters.strength) {
      filtered = this.filterByStrength(filtered, filters.strength);
    }
    
    return filtered;
  }

  /**
   * Sort habits by strength (weakest first)
   * @param {Array} habits - Array of habits
   * @returns {Array} Sorted habits
   */
  sortByStrength(habits) {
    // We would need to integrate with statsManager to get actual strength values
    // For now, we'll sort by the stored strength property
    return [...habits].sort((a, b) => a.strength - b.strength);
  }

  /**
   * Sort habits by name
   * @param {Array} habits - Array of habits
   * @returns {Array} Sorted habits
   */
  sortByName(habits) {
    return [...habits].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Sort habits by creation date
   * @param {Array} habits - Array of habits
   * @returns {Array} Sorted habits
   */
  sortByCreationDate(habits) {
    return [...habits].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  /**
   * Apply sorting
   * @param {Array} habits - Array of habits
   * @param {string} sortBy - Sorting criteria
   * @returns {Array} Sorted habits
   */
  applySorting(habits, sortBy) {
    switch (sortBy) {
      case 'strength':
        return this.sortByStrength(habits);
      case 'name':
        return this.sortByName(habits);
      case 'created':
        return this.sortByCreationDate(habits);
      default:
        return this.sortByStrength(habits); // default to strength sorting
    }
  }

  /**
   * Get all unique tags from habits
   * @param {Array} habits - Array of habits
   * @returns {Array} Unique tags
   */
  getAllTags(habits) {
    const tags = new Set();
    habits.forEach(habit => {
      habit.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Get all unique time of day values from habits
   * @param {Array} habits - Array of habits
   * @returns {Array} Unique time of day values
   */
  getAllTimesOfDay(habits) {
    const times = new Set();
    habits.forEach(habit => {
      if (habit.timeOfDay.single) {
        times.add(habit.timeOfDay.single);
      }
      if (habit.timeOfDay.parts) {
        habit.timeOfDay.parts.forEach(part => times.add(part.time));
      }
    });
    return Array.from(times).sort();
  }
}

// Create a singleton instance
const filterManager = new FilterManager();

// Make it available globally
window.filterManager = filterManager;