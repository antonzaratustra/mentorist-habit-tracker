// Test file for new features in Habit Tracker

/**
 * Test the new life sphere, values, and goals functionality
 */
function testNewFeatures() {
  console.log('Testing new features...');
  
  // Create a test habit with life sphere, values, and goals
  const testHabitData = {
    name: 'Test Habit',
    type: 'checkbox',
    lifeSphere: 'health',
    values: ['Health', 'Wellness'],
    goals: ['Exercise regularly', 'Stay healthy'],
    tags: ['test'],
    timeOfDay: { single: 'morning' },
    status: 'active'
  };
  
  // Create the habit
  const habit = habitManager.createHabit(testHabitData);
  console.log('Created habit:', habit);
  
  // Test filtering by life sphere
  const healthHabits = habitManager.getAllHabits().filter(h => h.lifeSphere === 'health');
  console.log('Habits in health sphere:', healthHabits);
  
  // Test filtering by value
  const healthValueHabits = habitManager.getAllHabits().filter(h => h.values.includes('Health'));
  console.log('Habits with Health value:', healthValueHabits);
  
  // Test filtering by goal
  const exerciseGoalHabits = habitManager.getAllHabits().filter(h => h.goals.includes('Exercise regularly'));
  console.log('Habits with Exercise regularly goal:', exerciseGoalHabits);
  
  // Test progress calculation for life sphere
  const healthProgress = progressManager.calculateLifeSphereProgress('health');
  console.log('Health sphere progress:', healthProgress);
  
  // Test progress calculation for value
  const healthValueProgress = progressManager.calculateValueProgress('Health');
  console.log('Health value progress:', healthValueProgress);
  
  // Test progress calculation for goal
  const exerciseGoalProgress = progressManager.calculateGoalProgress('Exercise regularly');
  console.log('Exercise regularly goal progress:', exerciseGoalProgress);
  
  console.log('New features test completed.');
}

// Make it available globally
window.testNewFeatures = testNewFeatures;