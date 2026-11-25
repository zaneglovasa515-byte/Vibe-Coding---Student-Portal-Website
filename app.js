const STORAGE_KEY = "campushub_student_portal_v1";

const DEFAULT_DATA = {
  profile: {
    name: "Alex Rivera",
    studentId: "STU-2026-4092",
    major: "B.S. Computer Science",
    year: "Junior (Year 3)",
    email: "alex.rivera@university.edu",
    advisor: "Dr. Hannah Lin"
  },
  schedule: [
    { code: "CS-301", title: "Data Structures & Algorithms", day: "Mon / Wed", time: "09:00 AM - 10:15 AM", room: "Eng Hall 204", instructor: "Prof. D. Patel" },
    { code: "CS-340", title: "Web Systems & Architecture", day: "Mon / Wed", time: "11:00 AM - 12:15 PM", room: "Tech Lab 102", instructor: "Dr. M. Chen" },
    { code: "MATH-240", title: "Linear Algebra", day: "Tue / Thu", time: "01:00 PM - 02:30 PM", room: "Sci Bldg 310", instructor: "Prof. R. Gomez" },
    { code: "HUM-210", title: "Ethics in Technology", day: "Friday", time: "10:00 AM - 12:00 PM", room: "Arts Center 115", instructor: "Dr. S. Brooks" }
  ],
  grades: [
    { code: "CS-301", course: "Data Structures & Algorithms", credits: 4, score: 94, letter: "A", points: 4.0 },
    { code: "CS-340", course: "Web Systems & Architecture", credits: 3, score: 91, letter: "A-", points: 3.7 },
    { code: "MATH-240", course: "Linear Algebra", credits: 4, score: 88, letter: "B+", points: 3.3 },
    { code: "HUM-210", course: "Ethics in Technology", credits: 3, score: 96, letter: "A", points: 4.0 }
  ],
  announcements: [
    { id: "a1", title: "Final Exam Schedule Published", date: "Nov 20, 2026", tag: "Academics", body: "Check your room assignments and exam dates before December 1. Conflicts must be reported by Friday.", read: false },
    { id: "a2", title: "Spring Course Registration Opens Soon", date: "Nov 18, 2026", tag: "Registration", body: "Junior standing students can begin registering on Monday at 8:00 AM. Ensure advisor holds are cleared.", read: false },
    { id: "a3", title: "24-Hour Library Study Hours", date: "Nov 12, 2026", tag: "Campus", body: "Main Library floors 2 and 3 remain open 24/7 through finals week with free coffee stations after midnight.", read: true }
  ]
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(DEFAULT_DATA);
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let currentView = "dashboard";

const viewContainer = document.getElementById("viewContainer");
const pageTitle = document.getElementById("pageTitle");
const topbarUser = document.getElementById("topbarUser");
const sidebar = document.getElementById("sidebar");

function calculateGPA(grades) {
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const weightedPoints = grades.reduce((sum, g) => sum + g.credits * g.points, 0);
  return {
    gpa: totalCredits ? (weightedPoints / totalCredits).toFixed(2) : "0.00",
    totalCredits
  };
}

function renderTopbar() {
  topbarUser.textContent = `${state.profile.name} · ${state.profile.studentId}`;
}

function renderDashboard() {
  const { gpa, totalCredits } = calculateGPA(state.grades);
  const unreadCount = state.announcements.filter((a) => !a.read).length;

  viewContainer.innerHTML = `
    <div class="grid-3">
      <div class="card">
        <p class="muted">Cumulative GPA</p>
        <div class="stat-value">${gpa}</div>
        <span class="badge badge-success">${totalCredits} Enrolled Credits</span>
      </div>
      <div class="card">
        <p class="muted">Active Courses</p>
        <div class="stat-value">${state.schedule.length}</div>
        <span class="badge badge-warning">Fall Term 2026</span>
      </div>
      <div class="card">
        <p class="muted">Unread Announcements</p>
        <div class="stat-value">${unreadCount}</div>
        <span class="muted">${state.announcements.length} total notices</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 style="margin-bottom:12px;">Upcoming Classes</h3>
        <div class="stack">
          ${state.schedule.slice(0, 3).map((c) => `
            <div>
              <strong>${c.code} — ${c.title}</strong>
              <p class="muted">${c.day} · ${c.time} · ${c.room}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom:12px;">Latest Announcements</h3>
        <div class="stack">
          ${state.announcements.slice(0, 2).map((a) => `
            <div>
              <strong>${a.title}</strong>
              <p class="muted">${a.date} · ${a.body}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderSchedule() {
  viewContainer.innerHTML = `
    <div class="card">
      <h3 style="margin-bottom:14px;">Weekly Class Timetable</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Title</th>
              <th>Days</th>
              <th>Time</th>
              <th>Location</th>
              <th>Instructor</th>
            </tr>
          </thead>
          <tbody>
            ${state.schedule.map((row) => `
              <tr>
                <td><strong>${row.code}</strong></td>
                <td>${row.title}</td>
                <td>${row.day}</td>
                <td>${row.time}</td>
                <td>${row.room}</td>
                <td>${row.instructor}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderGrades() {
  const { gpa, totalCredits } = calculateGPA(state.grades);
  viewContainer.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
        <div>
          <h3>Course Grades & GPA Summary</h3>
          <p class="muted">Term GPA: <strong>${gpa}</strong> across ${totalCredits} credits</p>
        </div>
        <span class="badge badge-success">Dean's List Standing</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Course</th>
              <th>Credits</th>
              <th>Score</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${state.grades.map((g) => `
              <tr>
                <td><strong>${g.code}</strong></td>
                <td>${g.course}</td>
                <td>${g.credits}</td>
                <td>${g.score}%</td>
                <td><span class="badge badge-success">${g.letter}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAnnouncements() {
  viewContainer.innerHTML = `
    <div class="stack">
      ${state.announcements.map((a) => `
        <div class="card">
          <div class="announcement-top">
            <div>
              <span class="badge ${a.read ? "badge-warning" : "badge-success"}">${a.tag}</span>
              <strong style="margin-left:8px; font-size:1.05rem;">${a.title}</strong>
            </div>
            <span class="muted">${a.date}</span>
          </div>
          <p style="margin-bottom:12px;">${a.body}</p>
          <button class="btn btn-secondary btn-sm" onclick="toggleRead('${a.id}')">
            ${a.read ? "Mark as Unread" : "Mark as Read"}
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

window.toggleRead = function (id) {
  const item = state.announcements.find((a) => a.id === id);
  if (item) {
    item.read = !item.read;
    saveState();
    renderView(currentView);
  }
};

function renderProfile() {
  const p = state.profile;
  viewContainer.innerHTML = `
    <div class="card">
      <h3 style="margin-bottom:16px;">Student Profile</h3>
      <form id="profileForm" class="form-grid">
        <div class="field">
          <label for="fullName">Full Name</label>
          <input id="fullName" type="text" value="${p.name}" required />
        </div>
        <div class="field">
          <label for="studentId">Student ID</label>
          <input id="studentId" type="text" value="${p.studentId}" disabled />
        </div>
        <div class="field">
          <label for="major">Major</label>
          <input id="major" type="text" value="${p.major}" required />
        </div>
        <div class="field">
          <label for="year">Academic Standing</label>
          <input id="year" type="text" value="${p.year}" required />
        </div>
        <div class="field">
          <label for="email">University Email</label>
          <input id="email" type="email" value="${p.email}" required />
        </div>
        <div class="field">
          <label for="advisor">Academic Advisor</label>
          <input id="advisor" type="text" value="${p.advisor}" required />
        </div>
        <div class="field" style="grid-column: 1 / -1;">
          <div>
            <button type="submit" class="btn btn-primary">Save Profile</button>
          </div>
          <div id="profileStatus" class="status-msg"></div>
        </div>
      </form>
    </div>
  `;

  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.profile.name = document.getElementById("fullName").value.trim();
    state.profile.major = document.getElementById("major").value.trim();
    state.profile.year = document.getElementById("year").value.trim();
    state.profile.email = document.getElementById("email").value.trim();
    state.profile.advisor = document.getElementById("advisor").value.trim();
    saveState();
    renderTopbar();
    document.getElementById("profileStatus").textContent = "Profile saved to local browser storage.";
  });
}

function renderView(view) {
  currentView = view;
  const titles = {
    dashboard: "Dashboard",
    schedule: "Class Schedule",
    grades: "Grades",
    announcements: "Announcements",
    profile: "Student Profile"
  };
  pageTitle.textContent = titles[view] || "Dashboard";

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  if (view === "dashboard") renderDashboard();
  else if (view === "schedule") renderSchedule();
  else if (view === "grades") renderGrades();
  else if (view === "announcements") renderAnnouncements();
  else if (view === "profile") renderProfile();

  sidebar.classList.remove("open");
}

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => renderView(btn.dataset.view));
});

document.getElementById("menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.getElementById("resetDataBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  renderTopbar();
  renderView(currentView);
});

renderTopbar();
renderView("dashboard");
