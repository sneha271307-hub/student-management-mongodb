const express = require("express");
const connectDB = require("./db");
const Student = require("./models/Student");

const app = express();
const PORT = 3000;

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Student Management API is running");
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students." });
    }
});

app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({
            error: "Invalid student ID."
        });
    }
});

app.post("/students", async (req, res) => {
    try {
        const { name, age, course } = req.body;

        if (!name || age === undefined || !course) {
            return res.status(400).json({
                error: "Name, age and course are required."
            });
        }

        const student = await Student.create({
            name,
            age,
            course
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

app.put("/students/:id", async (req, res) => {
    try {
        const { name, age, course } = req.body;

        if (!name || age === undefined || !course) {
            return res.status(400).json({
                error: "Name, age and course are required."
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name, age, course },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({
            error: "Invalid student ID or data."
        });
    }
});

app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: "Student not found."
            });
        }

        res.status(200).json({
            message: "Student deleted successfully.",
            student
        });
    } catch (error) {
        res.status(400).json({
            error: "Invalid student ID."
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found."
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});