import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { registerValidation } from "./utils/validations.js";
import { checkAuth } from "./utils/checkAuth.js";
import { login, getMe, register } from "./controllers/userController.js";

dotenv.config();

mongoose
	.connect(process.env.DB_URI)
	.then(() => {
		console.log("Database connection successfully");
	})
	.catch((e) => {
		console.log("Database connection failed:" + e);
	});

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.post("/auth/register", registerValidation, register);

app.post("/auth/login", login);

app.get("/auth/me", checkAuth, getMe);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
