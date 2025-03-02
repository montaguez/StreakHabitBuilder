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
            <button onclick="deleteHabit(${habit.id})" class="delete-btn">Delete</button>
        </div>
    `).join('');
}

function markComplete(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;

    if (lastCompleted === today) {
        alert('You already completed this habit today!');
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (lastCompleted === yesterdayString || habit.streak === 0) {
        habit.streak++;
    } else {
        habit.streak = 1;
    }

    habit.lastCompleted = new Date();
    renderHabits();
}

function deleteHabit(habitId) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits = habits.filter(h => h.id !== habitId);
        renderHabits();
    }
}