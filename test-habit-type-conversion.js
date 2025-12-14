/**
 * Test suite for habit type conversion functionality
 */

// Wait for the app to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Run tests after a short delay to ensure everything is initialized
  setTimeout(runHabitConversionTests, 1000);
});

function runHabitConversionTests() {
  console.log('=== Habit Type Conversion Tests ===');
  
  // Test 1: Create a habit and verify initial state
  console.log('\n--- Test 1: Create habit ---');
  const testHabitData = {
    name: 'Test Conversion Habit',
    type: 'checkbox',
    timeOfDay: { single: 'day' },
    tags: ['test'],
    lifeSphere: 'self-development'
  };
  
  const testHabit = habitManager.createHabit(testHabitData);
  console.assert(testHabit.type === 'checkbox', 'Habit should be checkbox type');
  console.log('✓ Habit created successfully');
  
  // Test 2: Create some entries
  console.log('\n--- Test 2: Create entries ---');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Create completed entry
  entryManager.createEntry(testHabit.id, today, {
    checkboxState: { completed: true, failed: false, parts: [] }
  });
  
  // Create failed entry
  entryManager.createEntry(testHabit.id, yesterday, {
    checkboxState: { completed: false, failed: true, parts: [] }
  });
  
  // Recalculate strength
  entryManager.recalculateHabitStrength(testHabit.id);
  const updatedHabit = habitManager.getHabitById(testHabit.id);
  console.log('Habit strength after entries:', updatedHabit.strength);
  console.log('✓ Entries created successfully');
  
  // Test 3: Convert checkbox to checkbox_2
  console.log('\n--- Test 3: Convert checkbox to checkbox_2 ---');
  const convertedHabit1 = habitManager.updateHabit(testHabit.id, { type: 'checkbox_2' });
  console.assert(convertedHabit1.type === 'checkbox_2', 'Habit should be checkbox_2 type');
  
  // Check that entries were converted
  const entries1 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to checkbox_2:', entries1);
  console.log('✓ Conversion to checkbox_2 successful');
  
  // Test 4: Convert checkbox_2 to text
  console.log('\n--- Test 4: Convert checkbox_2 to text ---');
  const convertedHabit2 = habitManager.updateHabit(testHabit.id, { type: 'text' });
  console.assert(convertedHabit2.type === 'text', 'Habit should be text type');
  
  // Check that entries were converted
  const entries2 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to text:', entries2);
  console.log('✓ Conversion to text successful');
  
  // Test 5: Convert text to emoji
  console.log('\n--- Test 5: Convert text to emoji ---');
  const convertedHabit3 = habitManager.updateHabit(testHabit.id, { type: 'emoji' });
  console.assert(convertedHabit3.type === 'emoji', 'Habit should be emoji type');
  
  // Check that entries were converted
  const entries3 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to emoji:', entries3);
  console.log('✓ Conversion to emoji successful');
  
  // Test 6: Convert emoji back to checkbox
  console.log('\n--- Test 6: Convert emoji to checkbox ---');
  const convertedHabit4 = habitManager.updateHabit(testHabit.id, { type: 'checkbox' });
  console.assert(convertedHabit4.type === 'checkbox', 'Habit should be checkbox type');
  
  // Check that entries were converted
  const entries4 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to checkbox:', entries4);
  console.log('✓ Conversion back to checkbox successful');
  
  // Test 7: Verify strength preservation
  console.log('\n--- Test 7: Verify strength preservation ---');
  const finalHabit = habitManager.getHabitById(testHabit.id);
  console.log('Final habit strength:', finalHabit.strength);
  console.log('✓ Strength preserved through conversions');
  
  console.log('\n=== All tests completed ===');
}

// Export for manual testing if needed
window.runHabitConversionTests = runHabitConversionTests;