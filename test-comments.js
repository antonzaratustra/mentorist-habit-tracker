// Test script for comment saving functionality

// Function to test comment saving
function testCommentSaving() {
  console.log('Testing comment saving functionality...');
  
  // Get all habits
  const habits = habitManager.getAllHabits();
  console.log('Available habits:', habits);
  
  if (habits.length === 0) {
    console.log('No habits found. Please create a habit first.');
    return;
  }
  
  // Use the first habit for testing
  const habit = habits[0];
  const today = getCurrentDate();
  
  console.log(`Testing with habit: ${habit.name} (ID: ${habit.id})`);
  console.log(`Today's date: ${today}`);
  
  // Set a comment
  const testComment = "This is a test comment at " + new Date().toISOString();
  console.log(`Setting comment: "${testComment}"`);
  
  entryManager.setComment(habit.id, today, testComment);
  
  // Retrieve the comment
  const entry = entryManager.getEntry(habit.id, today);
  console.log('Retrieved entry:', entry);
  
  if (entry && entry.comment === testComment) {
    console.log('✅ Comment saving test PASSED');
  } else {
    console.log('❌ Comment saving test FAILED');
    console.log('Expected:', testComment);
    console.log('Actual:', entry ? entry.comment : 'No entry found');
  }
  
  // Also test the storage directly
  const storedEntries = storage.getEntries();
  const storedEntry = storedEntries.find(e => e.habitId === habit.id && e.date === today);
  console.log('Stored entry in localStorage:', storedEntry);
  
  if (storedEntry && storedEntry.comment === testComment) {
    console.log('✅ Direct storage test PASSED');
  } else {
    console.log('❌ Direct storage test FAILED');
  }
}

// Function to test habit creation
function testHabitCreation() {
  console.log('Testing habit creation...');
  
  const habitData = {
    name: 'Test Habit ' + Date.now(),
    type: 'checkbox',
    tags: ['test'],
    timeOfDay: { single: 'day' }
  };
  
  console.log('Creating habit with data:', habitData);
  
  const createdHabit = habitManager.createHabit(habitData);
  console.log('Created habit:', createdHabit);
  
  if (createdHabit && createdHabit.name === habitData.name) {
    console.log('✅ Habit creation test PASSED');
    return createdHabit;
  } else {
    console.log('❌ Habit creation test FAILED');
    return null;
  }
}

// Run tests
console.log('Starting tests...');
testHabitCreation();
setTimeout(testCommentSaving, 1000); // Wait a bit for the habit to be fully created