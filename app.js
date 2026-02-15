const STORAGE_KEY = "momentum-habits-v1";

const form = document.querySelector("#habit-form");
const list = document.querySelector("#habit-list");
const template = document.querySelector("#habit-template");

const completionRateNode = document.querySelector("#completion-rate");
const activeHabitsNode = document.querySelector("#active-habits");
const bestStreakNode = document.querySelector("#best-streak");

const todayKey = () => new Date().toISOString().slice(0, 10);

const state = {
  habits: loadHabits(),
};

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));
}

function calculateStreak(logs) {
  if (!logs.length) return 0;
  const sorted = [...new Set(logs)].sort().reverse();
  let streak = 0;
  let cursor = new Date();

  for (const day of sorted) {
    const target = cursor.toISOString().slice(0, 10);
    if (day === target) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (day > target) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function markDone(habitId) {
  const habit = state.habits.find((item) => item.id === habitId);
  if (!habit) return;

  const today = todayKey();
  if (!habit.logs.includes(today)) {
    habit.logs.push(today);
    persistHabits();
    render();
  }
}

function deleteHabit(habitId) {
  state.habits = state.habits.filter((item) => item.id !== habitId);
  persistHabits();
  render();
}

function calculateWeeklyCompletion() {
  if (!state.habits.length) return 0;

  const days = 7;
  const now = new Date();
  let completed = 0;
  let expected = 0;

  state.habits.forEach((habit) => {
    if (habit.frequency === "daily") {
      expected += days;
      for (let i = 0; i < days; i += 1) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        if (habit.logs.includes(d.toISOString().slice(0, 10))) {
          completed += 1;
        }
      }
    } else {
      expected += 1;
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - (days - 1));
      const hasWeeklyLog = habit.logs.some((day) => day >= weekAgo.toISOString().slice(0, 10));
      if (hasWeeklyLog) completed += 1;
    }
  });

  return expected ? Math.round((completed / expected) * 100) : 0;
}

function renderSummary() {
  activeHabitsNode.textContent = String(state.habits.length);
  completionRateNode.textContent = `${calculateWeeklyCompletion()}%`;
  const streaks = state.habits.map((habit) => calculateStreak(habit.logs));
  bestStreakNode.textContent = String(streaks.length ? Math.max(...streaks) : 0);
}

function render() {
  list.innerHTML = "";

  state.habits.forEach((habit) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".habit-title").textContent = habit.name;
    node.querySelector(".habit-purpose").textContent = habit.purpose || "No purpose added yet.";
    node.querySelector(".habit-meta").textContent = `Frequency: ${habit.frequency} • Intensity: ${habit.difficulty}`;
    node.querySelector(".habit-plan").textContent = `If-Then: ${habit.plan}`;

    const streak = calculateStreak(habit.logs);
    node.querySelector(".streak").textContent = `🔥 Streak: ${streak}`;

    const lastDone = [...habit.logs].sort().at(-1);
    node.querySelector(".last-done").textContent = lastDone ? `Last completed: ${lastDone}` : "Not completed yet.";

    node.querySelector(".check-btn").addEventListener("click", () => markDone(habit.id));
    node.querySelector(".delete-btn").addEventListener("click", () => deleteHabit(habit.id));

    list.appendChild(node);
  });

  if (!state.habits.length) {
    const empty = document.createElement("li");
    empty.className = "habit-item";
    empty.textContent = "No habits yet. Start with one tiny habit and keep it consistent.";
    list.appendChild(empty);
  }

  renderSummary();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#habit-name").value.trim();
  const purpose = document.querySelector("#habit-purpose").value.trim();
  const frequency = document.querySelector("#habit-frequency").value;
  const difficulty = document.querySelector("#habit-difficulty").value;
  const plan = document.querySelector("#habit-plan").value.trim();

  if (!name || !plan) return;

  state.habits.push({
    id: crypto.randomUUID(),
    name,
    purpose,
    frequency,
    difficulty,
    plan,
    logs: [],
  });

  persistHabits();
  form.reset();
  render();
});

render();
