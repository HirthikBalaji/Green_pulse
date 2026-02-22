# GreenPulse Database Schema (PostgreSQL/MySQL)

```sql
-- Create Extended Roles
-- Role: Student or Faculty

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, -- Strict domain constraint in app logic
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'Student' or 'Faculty'
    department VARCHAR(100) NOT NULL,
    dept_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active Sessions (Optional if using JWT)
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    expires_at TIMESTAMP
);

-- Indexing for fast login
CREATE INDEX idx_user_email ON users(email);
```

### Production Security Notes
1. **Email Parsing**: Handled in `department_map.js` using Regex.
2. **Password Hashing**: Use `bcrypt` with salt rounds = 10.
3. **Environment Variables**: Store `JWT_SECRET` and DB URI in `.env` files.
4. **CORS**: Enable CORS only for the frontend domain.
