/**
 * GreenPulse Production Backend
 * Technology: Node.js + Express
 * Role: Authentication and Data Management
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { parseUserEmail } = require('./department_map');

const app = express();
app.use(express.json());

// SECRETS (In production, use process.env)
const JWT_SECRET = 'green-pulse-amrita-key-2026';

// MOCK DATABASE (In production, use MongoDB/PostgreSQL)
let users = [];

/**
 * SIGNUP ENDPOINT
 */
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Strict Domain & Role/Dept Detection
        const details = parseUserEmail(email);
        if (!details) {
            return res.status(400).json({ error: 'Invalid Amrita email domain.' });
        }

        // 2. Check existing user
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // 3. Password Hashing (Security Requirement 6)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
            role: details.role,
            department: details.department,
            deptCode: details.deptCode,
            createdAt: new Date()
        };

        users.push(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            role: newUser.role,
            department: newUser.department
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * SIGNIN ENDPOINT
 */
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate domain first
        if (!parseUserEmail(email)) {
            return res.status(403).json({ error: 'Access denied: Unauthorized domain.' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role, dept: user.deptCode },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            redirect: user.role === 'Student' ? '/student-dashboard' : '/faculty-dashboard',
            user: {
                name: user.name,
                role: user.role,
                department: user.department
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`GreenPulse Backend running on port ${PORT}`));
