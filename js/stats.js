// Statistics module for Habit Tracker

class StatsManager {
  constructor() {
    // Stats manager doesn't need to store state locally
  }

  /**
   * Calculate habit strength based on completion history
   * @param {string} habitId - Habit ID
   * @returns {number} Strength value (0-100)
   */
  calculateHabitStrength(habitId) {
    // Get habit and its entries
    const habit = storage.getHabitById(habitId);
    if (!habit) return 0;

    const entries = storage.getEntriesByHabitId(habitId);
    if (entries.length === 0) return 0;

    // Calculate completion percentage
    let completedDays = 0;
    let totalDays = entries.length;

    entries.forEach(entry => {
      if (habit.type.includes('checkbox')) {
        // For checkbox habits
        if (habit.type === 'checkbox') {
          if (entry.checkboxState.completed) {
            completedDays++;
          }
        } else if (habit.type.startsWith('checkbox_')) {
          // For multi-part checkboxes
          const partsCount = parseInt(habit.type.split('_')[1]);
          const completedParts = entry.checkboxState.parts.filter(Boolean).length;
          if (completedParts === partsCount) {
            completedDays++;
          } else if (completedParts > 0) {
            // Partial completion counts as partial strength
            completedDays += completedParts / partsCount;
          }
        }
      } else if (habit.type === 'text') {
        // For text habits, any non-empty value counts as completed
        if (entry.textValue && entry.textValue.trim() !== '') {
          completedDays++;
        }
      } else if (habit.type === 'emoji') {
        // For emoji habits, any selected emoji counts as completed
        if (entry.emojiValue && entry.emojiValue.trim() !== '') {
          completedDays++;
        }
      }
    });

    // Calculate base strength
    const completionRate = totalDays > 0 ? completedDays / totalDays : 0;

    // Calculate consistency bonus (simplified)
    let consistencyBonus = 1.0;
    if (totalDays > 7) {
      // Simple streak detection
      let currentStreak = 0;
      let maxStreak = 0;
      
      // Sort entries by date
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      for (let i = 1; i < sortedEntries.length; i++) {
        const prevDate = new Date(sortedEntries[i-1].date);
        const currDate = new Date(sortedEntries[i].date);
        const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        
        if (Math.abs(dayDiff - 1) < 0.1) { // Approximately 1 day difference
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      // Apply bonus based on streak length
      consistencyBonus = 1 + (Math.min(maxStreak, 30) / 100);
    }

    // Calculate final strength (0-100)
    const strength = Math.min(100, Math.round(completionRate * 100 * consistencyBonus));
    return strength;
  }

  /**
   * Get daily statistics
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Array} filteredHabits - Optional array of filtered habits
   * @returns {Object} Daily statistics
   */
  getDailyStats(date, filteredHabits = null) {
    const entries = storage.getEntriesByDate(date);
    
    // Use filtered habits if provided, otherwise get all active habits
    const allHabits = filteredHabits || storage.getHabits().filter(h => h.status === 'active');
    const totalHabits = allHabits.length;
    
    let completed = 0;
    let failed = 0;
    
    entries.forEach(entry => {
      // Find habit in our filtered list
      const habit = allHabits.find(h => h.id === entry.habitId);
      if (!habit) return; // Skip if habit is not in our filtered list
      
      if (habit.type.includes('checkbox')) {
        if (habit.type === 'checkbox') {
          if (entry.checkboxState.completed) {
            completed++;
          } else if (entry.checkboxState.failed) {
            failed++;
          }
        } else if (habit.type.startsWith('checkbox_')) {
          const partsCount = parseInt(habit.type.split('_')[1]);
          const completedParts = entry.checkboxState.parts.filter(Boolean).length;
          
          if (completedParts === partsCount) {
            completed++;
          } else if (completedParts === 0 && 
                     entry.checkboxState.parts.some(part => part === false) &&
                     !entry.checkboxState.completed) {
            // All parts unchecked could mean not done yet or failed
            // For simplicity, we'll consider it as not completed
          }
        }
      } else if (habit.type === 'text') {
        if (entry.textValue && entry.textValue.trim() !== '') {
          completed++;
        }
      } else if (habit.type === 'emoji') {
        if (entry.emojiValue && entry.emojiValue.trim() !== '') {
          completed++;
        }
      }
    });
    
    return {
      date: date,
      totalHabits: totalHabits,
      completed: completed,
      failed: failed,
      percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0
    };
  }

  /**
   * Get weekly statistics
   * @param {Array<string>} weekDates - Array of dates for the week
   * @returns {Object} Weekly statistics
   */
  getWeeklyStats(weekDates) {
    const dailyStats = weekDates.map(date => this.getDailyStats(date));
    
    const totalHabits = storage.getHabits().filter(h => h.status === 'active').length;
    const totalCompleted = dailyStats.reduce((sum, day) => sum + day.completed, 0);
    const totalPossible = totalHabits * weekDates.length;
    
    // Find strongest and weakest habits
    const habits = storage.getHabits().filter(h => h.status === 'active');
    const habitStrengths = habits.map(habit => ({
      habit: habit,
      strength: this.calculateHabitStrength(habit.id)
    }));
    
    habitStrengths.sort((a, b) => b.strength - a.strength);
    
    return {
      weekDates: weekDates,
      dailyStats: dailyStats,
      totalHabits: totalHabits,
      totalCompleted: totalCompleted,
      totalPossible: totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      strongestHabits: habitStrengths.slice(0, 3),
      weakestHabits: habitStrengths.slice(-3).reverse()
    };
  }

  /**
   * Get monthly statistics
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Object} Monthly statistics
   */
  getMonthlyStats(year, month) {
    // Generate all dates for the month
    const dates = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dates.push(dateStr);
    }
    
    // Get weekly stats for each week in the month
    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      const weekDates = dates.slice(i, i + 7);
      weeks.push(this.getWeeklyStats(weekDates));
    }
    
    // Aggregate stats
    const totalHabits = storage.getHabits().filter(h => h.status === 'active').length;
    const totalCompleted = weeks.reduce((sum, week) => sum + week.totalCompleted, 0);
    const totalPossible = totalHabits * dates.length;
    
    return {
      year: year,
      month: month,
      weeks: weeks,
      totalHabits: totalHabits,
      totalCompleted: totalCompleted,
      totalPossible: totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
    };
  }

  /**
   * Get habit completion trend
   * @param {string} habitId - Habit ID
   * @param {number} days - Number of days to analyze
   * @returns {Array} Trend data
   */
  getHabitTrend(habitId, days = 30) {
    const habit = storage.getHabitById(habitId);
    if (!habit) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const trend = [];
    const entries = storage.getEntriesByHabitId(habitId);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dateStr);
      
      let status = 'none'; // not tracked
      if (entry) {
        if (habit.type.includes('checkbox')) {
          if (habit.type === 'checkbox') {
            if (entry.checkboxState.completed) status = 'completed';
            else if (entry.checkboxState.failed) status = 'failed';
          } else if (habit.type.startsWith('checkbox_')) {
            const partsCount = parseInt(habit.type.split('_')[1]);
            const completedParts = entry.checkboxState.parts.filter(Boolean).length;
            if (completedParts === partsCount) status = 'completed';
            else if (completedParts > 0) status = 'partial';
            else status = 'failed';
          }
        } else if (habit.type === 'text') {
          status = entry.textValue && entry.textValue.trim() !== '' ? 'completed' : 'failed';
        } else if (habit.type === 'emoji') {
          status = entry.emojiValue && entry.emojiValue.trim() !== '' ? 'completed' : 'failed';
        }
      }

      trend.push({
        date: dateStr,
        status: status
      });
    }

    return trend;
  }
}

// Create a singleton instance
const statsManager = new StatsManager();

// Make it available globally
window.statsManager = statsManager;