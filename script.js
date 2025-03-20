// Habit Streak Builder - Main JavaScript
console.log('Habit Streak Builder loaded');

let habits = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');

    loadHabits();

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

function loadHabits() {
    const saved = localStorage.getItem('streakHabits');
    if (saved) {
        habits = JSON.parse(saved);
    }
}

function saveHabits() {
    localStorage.setItem('streakHabits', JSON.stringify(habits));
}

function addHabit() {
    const input = document.getElementById('habitName');
    const habitName = input.value.trim();

    if (habitName === '') {
        showNotification('Please enter a habit name', 'error');
        input.focus();
        return;
    }

    if (habits.some(h => h.name.toLowerCase() === habitName.toLowerCase())) {
        showNotification('This habit already exists!', 'warning');
        input.focus();
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
    saveHabits();
    renderHabits();
    showNotification(`"${habitName}" added successfully!`, 'success');
}

function renderHabits() {
    const container = document.getElementById('habitsContainer');

    if (habits.length === 0) {
        container.innerHTML = '<p>No habits yet. Add your first habit above!</p>';
        updateStats();
        return;
    }

    container.innerHTML = habits.map(habit => {
        const today = new Date().toDateString();
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
        const completedToday = lastCompleted === today;

        return `
            <div class="habit-item fade-in">
                <div class="habit-header">
                    <h3>${habit.name}</h3>
                    <span class="streak-badge">🔥 ${habit.streak}</span>
                </div>
                <p>Current streak: ${habit.streak} days</p>
                <div class="habit-actions">
                    <button onclick="markComplete(${habit.id})" ${completedToday ? 'disabled' : ''}>
                        ${completedToday ? '✅ Completed Today' : 'Mark Complete Today'}
                    </button>
                    <button onclick="editHabit(${habit.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteHabit(${habit.id})" class="delete-btn">Delete</button>
                </div>
            </div>
        `;
    }).join('');

    updateStats();
}

function updateStats() {
    const totalHabits = habits.length;
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

    const today = new Date().toDateString();
    const completedToday = habits.filter(h => {
        const lastCompleted = h.lastCompleted ? new Date(h.lastCompleted).toDateString() : null;
        return lastCompleted === today;
    }).length;

    document.getElementById('totalHabits').textContent = totalHabits;
    document.getElementById('activeStreaks').textContent = activeStreaks;
    document.getElementById('longestStreak').textContent = longestStreak;
    document.getElementById('completedToday').textContent = completedToday;
}

function markComplete(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;

    if (lastCompleted === today) {
        showNotification('You already completed this habit today!', 'info');
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
    saveHabits();
    renderHabits();

    const message = habit.streak === 1 ?
        `Great start! You've begun your streak for "${habit.name}"` :
        `Awesome! You're on a ${habit.streak}-day streak for "${habit.name}"! 🔥`;
    showNotification(message, 'success');
}

function editHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newName = prompt('Edit habit name:', habit.name);
    if (newName && newName.trim() !== '' && newName.trim() !== habit.name) {
        habit.name = newName.trim();
        saveHabits();
        renderHabits();
    }
}

function deleteHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
        habits = habits.filter(h => h.id !== habitId);
        saveHabits();
        renderHabits();
        showNotification(`"${habit.name}" has been deleted`, 'info');
    }
}

function exportData() {
    if (habits.length === 0) {
        showNotification('No habits to export!', 'warning');
        return;
    }

    const dataStr = JSON.stringify(habits, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'habit-streak-data.json';
    link.click();

    showNotification('Data exported successfully!', 'success');
}

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}