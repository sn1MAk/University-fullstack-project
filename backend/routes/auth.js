
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // 1. Отримуємо дані з HTTP-запиту
        const { username, email, password } = req.body;

        // 2. Перевіряємо наявність даних
        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        // 3. Перевіряємо довжину даних
        if (cleanUsername.length < 2 || cleanUsername.length > 50) {
            return res.status(400).json({
                message: "Username must contain 2-50 characters"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        if (cleanEmail.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        // 4. Перевіряємо, чи існує користувач
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // 5. Хешуємо пароль
        const passwordHash = await bcrypt.hash(password, 12);

        // 6. Записуємо користувача в PostgreSQL
        const result = await pool.query(
            `INSERT INTO users
            (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at`,
            [cleanUsername, cleanEmail, passwordHash]
        );

        // 7. Повертаємо результат
        return res.status(201).json({
            message: "Registration successful",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);

        // Захист від повторної реєстрації
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});




// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Перевіряємо отримані дані
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // 2. Шукаємо користувача в базі
        const result = await pool.query(
            "SELECT id, username, email, password_hash FROM users WHERE email = $1",
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // 3. Перевіряємо пароль
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Створюємо JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 5. Зберігаємо JWT у HttpOnly Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Для локальної розробки через HTTP
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        // 6. Повертаємо інформацію користувача
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, username, email, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    return res.json({
        message: "Logout successful"
    });
});

module.exports = router;
