/**
 * Frontend Auth Logic
 */

function switchTab(tab) {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const tabSignin = document.getElementById('tab-signin');
    const tabSignup = document.getElementById('tab-signup');

    if (tab === 'signup') {
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabSignup.classList.add('active');
        tabSignin.classList.remove('active');
    } else {
        signupForm.classList.add('hidden');
        signinForm.classList.remove('hidden');
        tabSignin.classList.add('active');
        tabSignup.classList.remove('active');
    }
}

// Auto-detection on input
const signupEmail = document.getElementById('signup-email');
const detectionInfo = document.getElementById('detection-info');
const signupBtn = document.getElementById('signup-btn');

signupEmail.addEventListener('input', (e) => {
    const email = e.target.value.toLowerCase();
    const result = parseUserEmail(email);

    if (result) {
        detectionInfo.style.display = 'block';
        detectionInfo.innerHTML = `✨ Detecting: <b>${result.role}</b> in <b>${result.department}</b>`;
        document.getElementById('signup-email-error').style.display = 'none';
        signupBtn.disabled = false;
    } else if (email.length > 5) {
        detectionInfo.style.display = 'none';
        document.getElementById('signup-email-error').style.display = 'block';
        signupBtn.disabled = true;
    } else {
        detectionInfo.style.display = 'none';
        document.getElementById('signup-email-error').style.display = 'none';
    }
});

// Signup Handler
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value.toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (password !== confirm) {
        document.getElementById('signup-pass-error').style.display = 'block';
        return;
    }

    const userData = parseUserEmail(email);
    if (!userData) {
        alert("Invalid email domain!");
        return;
    }

    const payload = {
        name,
        email,
        password,
        role: userData.role,
        department: userData.department,
        deptCode: userData.deptCode
    };

    console.log("Registering User:", payload);

    // In a real production app, this would be:
    /*
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    */

    // For demonstration, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem('gp_users') || '[]');
    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    users.push(payload);
    localStorage.setItem('gp_users', JSON.stringify(users));

    alert(`Success! Account created for ${userData.role} of ${userData.department}. Porting to Sign In...`);
    switchTab('signin');
});

// Signin Handler
document.getElementById('signin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.toLowerCase();
    const password = document.getElementById('signin-password').value;

    const userData = parseUserEmail(email);
    if (!userData) {
        document.getElementById('signin-email-error').style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('gp_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('gp_active_session', JSON.stringify(user));
        alert(`Welcome, ${user.name}! Redirecting to ${user.role} Dashboard...`);
        window.location.href = 'index.html'; // Assuming main dashboard
    } else {
        alert("Invalid credentials.");
    }
});
