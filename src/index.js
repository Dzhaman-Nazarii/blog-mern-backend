import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { loginValidation, postCreateValidation, registerValidation } from "./utils/validations.js";
import { checkAuth } from "./utils/checkAuth.js";
import { login, getMe, register } from "./controllers/userController.js";
import { create, getAll, getOne, remove, update } from "./controllers/postController.js";

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

app.post("/auth/login", loginValidation , login);

app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);

app.get("/posts/:id", getOne);

app.post("/posts", checkAuth, postCreateValidation, create);

app.delete("/posts/:id", checkAuth ,remove),

app.patch("/posts/:id", checkAuth, update)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
