// Data Models & Mock Data
const CLASSES = [
    { id: 'ece', name: 'ECE Department', points: 0, rank: 1, trend: 'stable' },
    { id: 'rai', name: 'RAI Department', points: 0, rank: 2, trend: 'stable' },
    { id: 'cse', name: 'CSE Department', points: 0, rank: 3, trend: 'stable' },
    { id: 'mec', name: 'Mechanical Dept', points: 0, rank: 4, trend: 'stable' },
    { id: 'eee', name: 'Electrical Dept', points: 0, rank: 5, trend: 'stable' },
];

const ACTIONS = [
    // Positive Actions
    { id: 'lights_off', label: 'Switched off lights in empty room', points: 15, type: 'positive' },
    { id: 'clean_classroom', label: 'Maintained classroom cleanliness', points: 10, type: 'positive' },
    { id: 'leaking_tap', label: 'Reported leaking tap', points: 20, type: 'positive' },
    { id: 'tree_plantation', label: 'Participated in Tree Plantation', points: 50, type: 'positive' },
    { id: 'reusable_bottle', label: 'Using reusable water bottle', points: 10, type: 'positive' },
    { id: 'digital_submission', label: 'Submitted assignment digitally', points: 5, type: 'positive' },

    // Negative Actions (Mistakes)
    { id: 'littering', label: 'Littering in campus/corridor', points: -15, type: 'negative' },
    { id: 'lights_on', label: 'Lights/Fans left ON in empty room', points: -20, type: 'negative' },
    { id: 'tap_running', label: 'Water tap left running', points: -25, type: 'negative' },
    { id: 'plastic_waste', label: 'Used single-use plastic bottles', points: -10, type: 'negative' },
    { id: 'food_waste', label: 'Food wastage in canteen', points: -15, type: 'negative' }
];

// State Management
let currentState = {
    currentPage: 'home',
    userClass: 'ece', // Default, will be updated by session
    reports: JSON.parse(localStorage.getItem('gp_reports') || '[]'),
    // Helper to get points for ANY class
    getPointsForClass(classId) {
        return this.reports
            .filter(r => r.targetDept === classId && r.status === 'Awarded')
            .reduce((sum, r) => sum + r.points, 0);
    },
    // Points for the logged-in user's class (or total for Faculty)
    get classPoints() {
        const session = JSON.parse(localStorage.getItem('gp_active_session')) || { role: 'Student' };
        if (session.role === 'Faculty') {
            return CLASSES.reduce((sum, c) => sum + this.getPointsForClass(c.id), 0);
        }
        return this.getPointsForClass(this.userClass);
    }
};

// UI Components
const Pages = {
    home: () => {
        const session = JSON.parse(localStorage.getItem('gp_active_session')) || { name: 'Hero', role: 'Student' };
        const classInfo = CLASSES.find(c => c.id === currentState.userClass) || CLASSES[0];
        const recentReports = currentState.reports.slice(-4).reverse();

        return `
        <div class="fade-in">
            <h1>Welcome back, ${session.name}! [${session.role}] 🌿</h1>
            <div class="grid-2">
                <div class="card">
                    <h2>${session.role === 'Faculty' ? 'Campus Overview' : 'Your Class Status'}</h2>
                    <p style="font-size: 3rem; font-weight: 800; margin: 1rem 0;">${currentState.classPoints} <span style="font-size: 1rem; color: var(--text-muted)">Points</span></p>
                    <p>${session.role === 'Faculty' ? 'Manage campus-wide sustainability' : `Rank: #${classInfo.rank} in Campus`}</p>
                </div>
                <div class="card">
                    <h2>Recent Activities</h2>
                    <ul style="list-style: none; margin-top: 1rem">
                        ${recentReports.length ? recentReports.map(r => {
            const action = ACTIONS.find(a => a.id === r.actionId);
            let statusColor = 'var(--text-muted)';
            if (r.status === 'Awarded') statusColor = 'var(--primary)';
            if (r.status === 'Rejected') statusColor = 'var(--accent-red)';
            if (r.status === 'Under Review') statusColor = 'var(--accent-gold)';

            return `
                            <li style="margin-bottom: 0.8rem; display: flex; flex-direction: column; gap: 0.2rem">
                                <div style="display: flex; justify-content: space-between">
                                    <span style="font-weight: 600">${action.label}</span>
                                    <span style="color: ${r.points > 0 ? 'var(--primary)' : 'var(--accent-red)'}">
                                        ${r.points > 0 ? '+' : ''}${r.points} pts
                                    </span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.8rem">
                                    <span style="color: var(--text-muted)">${new Date(r.timestamp).toLocaleTimeString()}</span>
                                    <span style="color: ${statusColor}; font-weight: 600">● ${r.status}</span>
                                </div>
                            </li>
                        `}).join('') : '<li style="color: var(--text-muted)">No recent activity. Start reporting!</li>'}
                    </ul>
                </div>
            </div>
            ${session.role === 'Faculty' ? `
                <div class="card" style="margin-top: 2rem; border-left: 4px solid var(--accent-gold)">
                    <h2>Faculty Admin Panel</h2>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem">You have the authority to verify reports and assign large-scale campus rewards.</p>
                    <div class="grid-2">
                        <button class="btn btn-primary" onclick="navigate('review')">Review Pending Reports</button>
                        <button class="btn btn-primary" style="background: rgba(255,255,255,0.1)" onclick="resetAllData()">Reset Campus Data</button>
                    </div>
                </div>

                <div class="grid-2" style="margin-top: 2rem">
                    <div class="card">
                        <h2>Department Performance</h2>
                        <canvas id="deptChart" style="margin-top: 1rem"></canvas>
                    </div>
                    <div class="card">
                        <h2>Eco Activity Mix</h2>
                        <canvas id="balanceChart" style="margin-top: 1rem"></canvas>
                    </div>
                </div>
            ` : ''}
            
            <div class="card" style="margin-top: 2rem">
                <h2>Eco Impact Overview</h2>
                <div style="height: 180px; margin-top: 1rem">
                    <canvas id="impactChart"></canvas>
                </div>
            </div>
        </div>
    `},
    leaderboard: () => {
        return `
        <div class="fade-in">
            <h1>Campus Leaderboard</h1>
            <div class="card">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="text-align: left; color: var(--text-muted); border-bottom: 1px solid var(--glass-border)">
                            <th style="padding: 1rem">Rank</th>
                            <th style="padding: 1rem">Class</th>
                            <th style="padding: 1rem">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${CLASSES.map(c => ({
            ...c,
            currentPoints: currentState.getPointsForClass(c.id)
        }))
                .sort((a, b) => b.currentPoints - a.currentPoints)
                .map((c, i) => `
                            <tr style="border-bottom: 1px solid var(--glass-border); ${c.id === currentState.userClass ? 'background: rgba(46, 204, 113, 0.05)' : ''}">
                                <td style="padding: 1rem; font-weight: 800">#${i + 1}</td>
                                <td style="padding: 1rem">${c.name} ${c.id === currentState.userClass ? ' (You)' : ''}</td>
                                <td style="padding: 1rem; color: var(--primary); font-weight: 600">${c.currentPoints}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `},
    report: () => {
        const session = JSON.parse(localStorage.getItem('gp_active_session')) || { role: 'Student' };
        // Student can only see positive actions. Faculty sees all.
        const filteredActions = ACTIONS.filter(a => session.role === 'Faculty' || a.type === 'positive');

        return `
        <div class="fade-in">
            <h1>Submit a Report</h1>
            <div class="card">
                <form id="report-form" onsubmit="handleReportSubmit(event)">
                    <div style="margin-bottom: 1.5rem">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted)">Target Department</label>
                        ${session.role === 'Faculty' ? `
                            <select id="target-dept" style="width: 100%; padding: 1rem; border-radius: 12px; background: var(--bg-dark); color: white; border: 1px solid var(--glass-border)">
                                ${CLASSES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        ` : `
                            <input type="text" value="${CLASSES.find(c => c.id === currentState.userClass).name}" disabled style="width: 100%; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid var(--glass-border)">
                            <input type="hidden" id="target-dept" value="${currentState.userClass}">
                        `}
                    </div>
                    <div style="margin-bottom: 1.5rem">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted)">Action Type</label>
                        <select id="action-select" style="width: 100%; padding: 1rem; border-radius: 12px; background: var(--bg-dark); color: white; border: 1px solid var(--glass-border)">
                            ${filteredActions.map(a => `<option value="${a.id}">${a.label} (${a.points > 0 ? '+' : ''}${a.points} pts)</option>`).join('')}
                        </select>
                        ${session.role === 'Student' ? '<p style="font-size: 0.8rem; color: var(--primary); margin-top: 0.5rem">✨ Notice: Students can only report positive actions. Faculty reports campus mistakes.</p>' : ''}
                    </div>
                    <div style="margin-bottom: 1.5rem">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted)">Upload Proof (Image)</label>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem">Our AI Core will review the image to verify the action before awarding points.</p>
                        <input type="file" required id="report-file" style="width: 100%; padding: 1rem; border: 2px dashed var(--glass-border); border-radius: 12px; cursor: pointer">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%" id="submit-report-btn">Submit for AI Review</button>
                </form>
            </div>
        </div>
    `
    },
    review: () => {
        const pendingReports = currentState.reports.filter(r => r.status === 'Under Review');

        return `
        <div class="fade-in">
            <h1>Moderation Queue</h1>
            <p style="color: var(--text-muted); margin-bottom: 2rem">Review reports flagged by AI Core for ambiguous data.</p>
            
            ${pendingReports.length === 0 ? `
                <div class="card" style="text-align: center; padding: 3rem">
                    <p style="font-size: 1.2rem; color: var(--primary)">✨ All clear! No pending reports to moderate.</p>
                    <button class="btn btn-primary" style="margin-top: 1.5rem" onclick="navigate('home')">Back to Dashboard</button>
                </div>
            ` : pendingReports.map(r => {
            const action = ACTIONS.find(a => a.id === r.actionId);
            const dept = CLASSES.find(c => c.id === r.targetDept);

            return `
                <div class="card" style="margin-bottom: 1rem">
                    <div style="display: flex; justify-content: space-between; align-items: center">
                        <div>
                            <h3 style="margin-bottom: 0.5rem">${action.label}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-muted)">
                                Target: <b>${dept.name}</b> • Time: ${new Date(r.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <div style="font-weight: 800; color: ${r.points > 0 ? 'var(--primary)' : 'var(--accent-red)'}">
                            ${r.points > 0 ? '+' : ''}${r.points} pts
                        </div>
                    </div>
                    <div style="margin-top: 1.5rem; display: flex; gap: 1rem">
                        <button class="btn btn-primary" style="background: var(--primary); flex: 1" onclick="handleReviewAction(${r.id}, 'Awarded')">Approve</button>
                        <button class="btn btn-primary" style="background: var(--accent-red); flex: 1" onclick="handleReviewAction(${r.id}, 'Rejected')">Reject</button>
                    </div>
                </div>
            `}).join('')}
            <button class="btn btn-primary" style="margin-top: 1rem; width: 100%; background: rgba(255,255,255,0.1)" onclick="navigate('home')">Back to Dashboard</button>
        </div>
        `
    }
};

// Logic Functions
async function handleReportSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submit-report-btn');
    const actionId = document.getElementById('action-select').value;
    const action = ACTIONS.find(a => a.id === actionId);
    const session = JSON.parse(localStorage.getItem('gp_active_session')) || { role: 'Student' };

    // Role Restriction Check (Safety Net)
    if (action.type === 'negative' && session.role !== 'Faculty') {
        alert("Security Alert: Only Faculty members can report negative eco-mistakes.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.textContent = "AI Analysis in Progress...";

    // AI Prediction Simulation
    const report = {
        id: Date.now(),
        actionId: actionId,
        targetDept: document.getElementById('target-dept').value,
        points: action.points,
        timestamp: new Date().toISOString(),
        status: 'Under Review'
    };

    // Simulated AI processing delay
    await new Promise(r => setTimeout(r, 2200));

    /**
     * AI Review Logic (Simulation):
     * 1. Faculty reports are auto-approved (Authorized sources).
     * 2. Student reports have an 80% success rate.
     * 3. Failed AI checks go to "Under Review" for human moderator check.
     */
    if (session.role === 'Faculty') {
        report.status = 'Awarded';
    } else {
        const roll = Math.random();
        if (roll > 0.2) {
            report.status = 'Awarded';
        } else if (roll > 0.05) {
            report.status = 'Under Review';
        } else {
            report.status = 'Rejected';
        }
    }

    currentState.reports.push(report);
    localStorage.setItem('gp_reports', JSON.stringify(currentState.reports));

    // Result Feedback
    if (report.status === 'Awarded') {
        alert(`AI Verification Success! ✅ ${action.label} verified. Points added.`);
    } else if (report.status === 'Under Review') {
        alert(`AI Uncertainty! 🕒 Verification requires human review. Status set to Under Review.`);
    } else {
        alert(`AI Rejection! ❌ The image uploaded does not appear to contain proof of the action.`);
    }

    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    navigate('home');
}

function handleReviewAction(reportId, status) {
    const reportIndex = currentState.reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
        currentState.reports[reportIndex].status = status;
        localStorage.setItem('gp_reports', JSON.stringify(currentState.reports));

        const action = status === 'Awarded' ? 'Approved' : 'Rejected';
        alert(`Report ${action} successfully! 🌿`);
        navigate('review'); // Refresh the view
    }
}

// Router
function navigate(page) {
    currentState.currentPage = page;
    const main = document.getElementById('main-content');
    main.innerHTML = Pages[page]();

    // Update active nav link
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.toggle('active', li.dataset.page === page);
    });

    // Post-render logic
    if (page === 'home') {
        const session = JSON.parse(localStorage.getItem('gp_active_session'));
        if (session) {
            initGlobalCharts(session.role);
        }
    }
}

function initGlobalCharts(role) {
    // 📊 Universal Impact Chart (For everyone)
    const impactCtx = document.getElementById('impactChart');
    if (impactCtx) {
        // Last 7 days overview
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        }).reverse();

        new Chart(impactCtx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Campus Activities',
                    data: [2, 5, 3, 8, 4, 6, currentState.reports.length], // Mocking some trend
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false },
                    x: { grid: { display: false }, ticks: { color: 'var(--text-muted)' } }
                }
            }
        });
    }

    // 🔬 Faculty Specific Analytics
    if (role === 'Faculty') {
        initFacultyCharts();
    }
}

function initFacultyCharts() {
    const deptCtx = document.getElementById('deptChart');
    const balanceCtx = document.getElementById('balanceChart');
    if (!deptCtx || !balanceCtx) return;

    // Data 1: Points per Dept
    new Chart(deptCtx, {
        type: 'bar',
        data: {
            labels: CLASSES.map(c => c.id.toUpperCase()),
            datasets: [{
                label: 'Department Points',
                data: CLASSES.map(c => currentState.getPointsForClass(c.id)),
                backgroundColor: 'rgba(46, 204, 113, 0.4)',
                borderColor: '#2ecc71',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });

    // Data 2: Positive vs Negative
    const pos = currentState.reports.filter(r => r.points > 0).length;
    const neg = currentState.reports.filter(r => r.points < 0).length;

    new Chart(balanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Green Actions', 'Eco Mistakes'],
            datasets: [{
                data: [pos || 1, neg || 0], // Fallback if no data
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#ecf0f1', padding: 20 } }
            }
        }
    });
}

// Session Management
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('gp_active_session'));
    if (!session && window.location.pathname.indexOf('auth.html') === -1) {
        window.location.href = 'auth.html';
        return;
    }

    if (session) {
        setupUserUI(session);
    }

    navigate('home');

    // Nav Click Listeners
    document.querySelector('.nav-links').addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            if (e.target.id === 'nav-logout') {
                handleLogout();
            } else {
                navigate(e.target.dataset.page);
            }
        }
    });
});

function setupUserUI(user) {
    const navLinks = document.querySelector('.nav-links');
    // Add logout button
    const logoutLi = document.createElement('li');
    logoutLi.id = 'nav-logout';
    logoutLi.textContent = 'Logout';
    logoutLi.style.color = 'var(--accent-red)';
    navLinks.appendChild(logoutLi);

    // Update welcome message if on home page
    if (currentState.currentPage === 'home') {
        currentState.userClass = user.deptCode || 'ece';
    }
}

function handleLogout() {
    localStorage.removeItem('gp_active_session');
    window.location.href = 'auth.html';
}

// Data Reset Helper (Run from Console if needed)
function resetAllData() {
    localStorage.clear();
    alert("All GreenPulse local data has been cleared. Starting fresh!");
    window.location.reload();
}
