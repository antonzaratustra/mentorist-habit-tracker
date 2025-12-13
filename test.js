// Test file for Habit Tracker

// Import modules for testing
const storage = require('./js/storage.js');
const habitManager = require('./js/habits.js');
const entryManager = require('./js/entries.js');
const statsManager = require('./js/stats.js');
const filterManager = require('./js/filters.js');
const { generateId, getCurrentDate, getWeekDates } = require('./js/utils.js');

console.log('Running Habit Tracker tests...');

// Test 1: Create a habit
console.log('\n--- Test 1: Creating a habit ---');
const habitData = {
  name: 'Morning Exercise',
  type: 'checkbox',
  tags: ['health', 'morning'],
  timeOfDay: { single: 'morning' }
};

const habit = habitManager.createHabit(habitData);
console.log('Created habit:', habit);

// Test 2: Create an entry
console.log('\n--- Test 2: Creating an entry ---');
const today = getCurrentDate();
const entry = entryManager.createEntry(habit.id, today, {
  checkboxState: {
    completed: true,
    failed: false,
    parts: []
  },
  comment: 'Great workout today!'
});

console.log('Created entry:', entry);

// Test 3: Retrieve data
console.log('\n--- Test 3: Retrieving data ---');
const retrievedHabit = habitManager.getHabitById(habit.id);
console.log('Retrieved habit:', retrievedHabit);

const retrievedEntry = entryManager.getEntry(habit.id, today);
console.log('Retrieved entry:', retrievedEntry);

// Test 4: Update habit
console.log('\n--- Test 4: Updating habit ---');
const updatedHabit = habitManager.updateHabit(habit.id, {
  name: 'Morning Exercise & Meditation',
  tags: ['health', 'morning', 'mindfulness']
});

console.log('Updated habit:', updatedHabit);

// Test 5: Calculate habit strength
console.log('\n--- Test 5: Calculating habit strength ---');
const strength = statsManager.calculateHabitStrength(habit.id);
console.log('Habit strength:', strength);

// Test 6: Filtering
console.log('\n--- Test 6: Filtering habits ---');
const allHabits = habitManager.getAllHabits();
const healthHabits = filterManager.filterByTag(allHabits, 'health');
console.log('Health habits:', healthHabits);

const morningHabits = filterManager.filterByTimeOfDay(allHabits, 'morning');
console.log('Morning habits:', morningHabits);

// Test 7: Create more habits for sorting
console.log('\n--- Test 7: Creating more habits for sorting ---');
const habit2Data = {
  name: 'Evening Reading',
  type: 'text',
  tags: ['learning', 'evening'],
  timeOfDay: { single: 'evening' },
  strength: 75
};

const habit3Data = {
  name: 'Mood Tracking',
  type: 'emoji',
  tags: ['mental-health'],
  timeOfDay: { single: 'day' },
  strength: 30
};

const habit2 = habitManager.createHabit(habit2Data);
const habit3 = habitManager.createHabit(habit3Data);

// Test 8: Sorting
console.log('\n--- Test 8: Sorting habits ---');
const habitsToSort = [habit, habit2, habit3];
const sortedByStrength = filterManager.sortByStrength(habitsToSort);
console.log('Sorted by strength:', sortedByStrength.map(h => ({ name: h.name, strength: h.strength })));

const sortedByName = filterManager.sortByName(habitsToSort);
console.log('Sorted by name:', sortedByName.map(h => h.name));

// Test 9: Get all tags
console.log('\n--- Test 9: Getting all tags ---');
const allTags = filterManager.getAllTags(allHabits.concat([habit2, habit3]));
console.log('All tags:', allTags);

// Test 10: Clean up (move to trash)
console.log('\n--- Test 10: Cleaning up ---');
habitManager.deleteHabit(habit.id);
habitManager.deleteHabit(habit2.id);
habitManager.deleteHabit(habit3.id);

console.log('Moved habits to trash');

console.log('\n--- All tests completed ---');