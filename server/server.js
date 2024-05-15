import express from 'express';
import pool from './db.js';
import cors from 'cors';
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());
// We are accessing a secret variable for our port, Or if one doesn't exist then well use port 8000
const PORT = process.env.PORT ?? 8000;
pool.connect();

// get all todos
app.get("/todos/:userEmail", async (req, res) => {
    const { userEmail } = req.params;
    try {
        const todos = await pool.query("SELECT * FROM todos WHERE user_email=$1",
            [userEmail]
        );
        res.json(todos.rows);
    } catch (err) {
        console.error(err);
    }
});

// Create a new todo
app.post("/todos", async (req, res) => {
    const { user_email, title, progress, date } = req.body;
    // Creating a unique id
    const id = uuidv4();
    try {
        const newToDo = await pool.query("INSERT INTO todos VALUES ($1, $2, $3, $4, $5)",
            [id, user_email, title, progress, date]
        );

        res.json(newToDo);
    } catch (err) {
        console.error(err);
    }
})

// Edit a todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body;
    try {
        const editedToDo = await pool.query("UPDATE todos SET user_email = $2, title = $3, progress = $4, date = $5 WHERE id = $1;",
            [id, user_email, title, progress, date]
        );

        res.json(editedToDo);
    } catch (err) {
        console.error(err);
    }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleteToDo = await pool.query("DELETE FROM todos WHERE id = $1;",
            [id]
        );

        res.json(deleteToDo);
    } catch (err) {
        console.error(err);
    }
})

// signup
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    // Hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        const signUp = await pool.query(`INSERT INTO users VALUES ($1, $2);`,
            [email, hashedPassword]
        );

        // Generate a token that helps us keep signin
        const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
        res.json({ email, token });
    } catch (err) {
        console.error(err);
        if (err) {
            res.json({ detail: err.detail })
        }
    }
})

// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query(`SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (!user.rows.length) res.json({ detail: "User does not exist!" });

        const passwordCheck = await bcrypt.compare(password, user.rows[0].hashed_password);
        if (passwordCheck) {
            // Generate a token that helps us keep signin
            const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
            res.json({ "email": user.rows[0].email, token })
        } else {
            res.json({ detail: "Password incorrect! Please try again." });
        }
    } catch (err) {
        console.error(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server started running successfully on port ${PORT}`);
});