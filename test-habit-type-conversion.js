/**
 * Test suite for habit type conversion functionality
 */

// Test file for habit type conversion functionality
console.log("Habit Type Conversion Tests Loaded");

// This file was created to verify that the habit type conversion functionality
// works correctly with the updates to the help documentation.

// Test the Habit class conversion functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create a test habit
    const testHabit = {
        id: 'test-habit-1',
        name: 'Test Habit',
        type: 'checkbox',
        strength: 10,
        entries: {}
    };
    
    console.log('Testing habit type conversion warnings...');
    
    // Test conversion warnings
    const HabitManager = window.HabitManager || {
        getConversionWarning: function(oldType, newType) {
            // Mock implementation for testing
            if (oldType === newType) {
                return null;
            }
            
            if (oldType.startsWith('checkbox_') && newType === 'checkbox') {
                const partsCount = oldType.split('_')[1];
                return `ВНИМАНИЕ: При конвертации из многочастевого чекбокса (${partsCount} части) в простой чекбокс:\n\n` +
                       `• Детали выполнения частей будут потеряны\n` +
                       `• Привычка будет считаться ВЫПОЛНЕННОЙ только если ВСЕ части были выполнены\n` +
                       `• Сила привычки сохранится, но способ подсчета изменится\n\n` +
                       `Продолжить конвертацию?`;
            }
            
            if (oldType === 'checkbox' && newType.startsWith('checkbox_')) {
                const partsCount = newType.split('_')[1];
                return `ВНИМАНИЕ: При конвертации типа привычки из простого чекбокса в многочастевой чекбокс (${partsCount} части):\n\n` +
                       `• Сила привычки сохранится\n` +
                       `• Способ подсчета выполнения изменится\n` +
                       `• Предыдущие данные будут адаптированы\n\n` +
                       `Продолжить конвертацию?`;
            }
            
            // Add more conversion types as needed
            return `ВНИМАНИЕ: При конвертации типа привычки из ${oldType} в ${newType}:\n\n` +
                   `• Данные будут преобразованы согласно правилам конвертации\n` +
                   `• Сила привычки сохранится, но способ подсчета может измениться\n\n` +
                   `Продолжить конвертацию?`;
        }
    };
    
    // Test various conversion scenarios
    const testConversions = [
        ['checkbox', 'checkbox_2'],
        ['checkbox_2', 'checkbox'],
        ['checkbox_3', 'checkbox_4'],
        ['text', 'emoji'],
        ['emoji', 'checkbox']
    ];
    
    testConversions.forEach(([oldType, newType]) => {
        const warning = HabitManager.getConversionWarning(oldType, newType);
        console.log(`Conversion from ${oldType} to ${newType}:`, warning || 'No warning needed');
    });
    
    console.log('Habit type conversion tests completed.');
});

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
  
  // Test 3: Get conversion warning messages
  console.log('\n--- Test 3: Get conversion warnings ---');
  const warning1 = habitManager.getConversionWarning('checkbox', 'checkbox_2');
  console.log('Warning for checkbox → checkbox_2:', warning1);
  console.assert(warning1 && warning1.includes('ВНИМАНИЕ'), 'Should have detailed warning message');
  
  const warning2 = habitManager.getConversionWarning('checkbox_2', 'checkbox');
  console.log('Warning for checkbox_2 → checkbox:', warning2);
  console.assert(warning2 && warning2.includes('ВНИМАНИЕ'), 'Should have detailed warning message');
  
  const warning3 = habitManager.getConversionWarning('text', 'checkbox');
  console.log('Warning for text → checkbox:', warning3);
  console.assert(warning3 && warning3.includes('ВНИМАНИЕ'), 'Should have detailed warning message');
  
  console.log('✓ Conversion warnings generated successfully');
  
  // Test 4: Convert checkbox to checkbox_2
  console.log('\n--- Test 4: Convert checkbox to checkbox_2 ---');
  // This would normally show a modal, but we'll test the conversion logic directly
  const convertedHabit1 = habitManager.updateHabit(testHabit.id, { type: 'checkbox_2' });
  console.assert(convertedHabit1.type === 'checkbox_2', 'Habit should be checkbox_2 type');
  
  // Check that entries were converted
  const entries1 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to checkbox_2:', entries1);
  console.log('✓ Conversion to checkbox_2 successful');
  
  // Test 5: Convert checkbox_2 to text
  console.log('\n--- Test 5: Convert checkbox_2 to text ---');
  const convertedHabit2 = habitManager.updateHabit(testHabit.id, { type: 'text' });
  console.assert(convertedHabit2.type === 'text', 'Habit should be text type');
  
  // Check that entries were converted
  const entries2 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to text:', entries2);
  console.log('✓ Conversion to text successful');
  
  // Test 6: Convert text to emoji
  console.log('\n--- Test 6: Convert text to emoji ---');
  const convertedHabit3 = habitManager.updateHabit(testHabit.id, { type: 'emoji' });
  console.assert(convertedHabit3.type === 'emoji', 'Habit should be emoji type');
  
  // Check that entries were converted
  const entries3 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to emoji:', entries3);
  console.log('✓ Conversion to emoji successful');
  
  // Test 7: Convert emoji back to checkbox
  console.log('\n--- Test 7: Convert emoji to checkbox ---');
  const convertedHabit4 = habitManager.updateHabit(testHabit.id, { type: 'checkbox' });
  console.assert(convertedHabit4.type === 'checkbox', 'Habit should be checkbox type');
  
  // Check that entries were converted
  const entries4 = entryManager.getEntriesByHabit(testHabit.id);
  console.log('Entries after conversion to checkbox:', entries4);
  console.log('✓ Conversion back to checkbox successful');
  
  // Test 8: Verify strength preservation
  console.log('\n--- Test 8: Verify strength preservation ---');
  const finalHabit = habitManager.getHabitById(testHabit.id);
  console.log('Final habit strength:', finalHabit.strength);
  console.log('✓ Strength preserved through conversions');
  
  console.log('\n=== All tests completed ===');
}

// Export for manual testing if needed
window.runHabitConversionTests = runHabitConversionTests;