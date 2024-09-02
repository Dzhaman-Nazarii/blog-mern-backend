import express from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Get");
});

app.post("/auth/login", (req, res) => {
	const token = jwt.sign({
		email: req.body.email,
		name: req.body.name,
	}, "secretWord123")
	res.json({
		success: true,
		token
	})
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
