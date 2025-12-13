// Sample data initialization script for Habit Tracker

// This script should be run in the browser console after loading the app

// Create sample habits
const sampleHabits = [
  {
    name: 'Утренняя зарядка',
    type: 'checkbox',
    tags: ['здоровье', 'утро'],
    timeOfDay: { single: 'morning' }
  },
  {
    name: 'Выпить воды',
    type: 'checkbox_3',
    tags: ['здоровье'],
    timeOfDay: { 
      parts: [
        { partIndex: 0, time: 'morning' },
        { partIndex: 1, time: 'day' },
        { partIndex: 2, time: 'evening' }
      ]
    }
  },
  {
    name: 'Время сна',
    type: 'text',
    tags: ['здоровье', 'ночь'],
    timeOfDay: { single: 'evening' }
  },
  {
    name: 'Настроение',
    type: 'emoji',
    emojiOptions: ['😊', '😐', '😢'],
    tags: ['психология'],
    timeOfDay: { single: 'day' }
  },
  {
    name: 'Прогулка на свежем воздухе',
    type: 'checkbox',
    tags: ['здоровье', 'активность'],
    timeOfDay: { single: 'day' }
  }
];

// Function to initialize sample data
function initializeSampleData() {
  // Clear existing data
  window.storage.clearAllData();
  
  // Create sample habits
  sampleHabits.forEach(habitData => {
    window.habitManager.createHabit(habitData);
  });
  
  console.log('Sample data initialized!');
  console.log('Created habits:', window.habitManager.getAllHabits());
}

// Add to global scope for easy access
window.initializeSampleData = initializeSampleData;

// Show instructions
console.log('To initialize sample data, run: initializeSampleData()');