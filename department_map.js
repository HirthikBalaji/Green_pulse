/**
 * Department Mapping Utility
 * Extracts department code from Amrita Student emails
 * Format: ch.en.u4[dept][year][roll]@ch.students.amrita.edu
 */

const DEPT_MAP = {
    'ece': 'Electronics & Communication Engineering',
    'rai': 'Robotics & Artificial Intelligence',
    'cse': 'Computer Science & Engineering',
    'mec': 'Mechanical Engineering',
    'eee': 'Electrical & Electronics Engineering',
    'cen': 'Chemical Engineering',
    'civ': 'Civil Engineering'
};

/**
 * Parses email to determine role and department
 * @param {string} email 
 * @returns {Object|null} { role, department, deptCode } or null if invalid
 */
function parseUserEmail(email) {
    const studentDomain = '@ch.students.amrita.edu';
    const facultyDomain = '@ch.amrita.edu';

    if (email.endsWith(studentDomain)) {
        // Example: ch.en.u4ece24056@ch.students.amrita.edu
        const username = email.split('@')[0];
        // Regex to find 3-letter dept code after u4
        const match = username.match(/u4([a-z]{3})/);

        if (match && match[1]) {
            const deptCode = match[1];
            return {
                role: 'Student',
                deptCode: deptCode,
                department: DEPT_MAP[deptCode] || 'General Engineering'
            };
        }
        return { role: 'Student', department: 'Unknown', deptCode: 'unknown' };
    }

    if (email.endsWith(facultyDomain)) {
        return {
            role: 'Faculty',
            department: 'Administration / Faculty',
            deptCode: 'fac'
        };
    }

    return null; // Invalid domain
}

if (typeof module !== 'undefined') {
    module.exports = { parseUserEmail, DEPT_MAP };
}
