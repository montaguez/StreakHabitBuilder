// Habit Streak Builder - Main JavaScript
console.log('Habit Streak Builder loaded');

let habits = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');

    const addBtn = document.getElementById('addHabitBtn');
    const habitInput = document.getElementById('habitName');

    addBtn.addEventListener('click', addHabit);
    habitInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addHabit();
        }
    });

    renderHabits();
});

function addHabit() {
    const input = document.getElementById('habitName');
    const habitName = input.value.trim();

    if (habitName === '') {
        alert('Please enter a habit name');
        return;
    }

    const habit = {
        id: Date.now(),
        name: habitName,
        streak: 0,
        lastCompleted: null,
        created: new Date()
    };

    habits.push(habit);
    input.value = '';
    renderHabits();
}

function renderHabits() {
    const container = document.getElementById('habitsContainer');

    if (habits.length === 0) {
        container.innerHTML = '<p>No habits yet. Add your first habit above!</p>';
        return;
    }

    container.innerHTML = habits.map(habit => `
        <div class="habit-item">
            <h3>${habit.name}</h3>
            <p>Current streak: ${habit.streak} days</p>
            <button onclick="markComplete(${habit.id})">Mark Complete Today</button>
        </div>
    `).join('');
}