import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from "mongoose";
import {
	loginValidation,
	postCreateValidation,
	registerValidation,
} from "./utils/validations.js";
import { checkAuth } from "./utils/checkAuth.js";
import { login, getMe, register } from "./controllers/userController.js";
import {
	create,
	getAll,
	getLastTags,
	getOne,
	remove,
	update,
} from "./controllers/postController.js";
import multer from "multer";
import handleValidationsError from "./utils/handleValidationsError.js";

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

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.post(
	"/auth/register",
	registerValidation,
	handleValidationsError,
	register
);

app.post("/auth/login", loginValidation, handleValidationsError, login);

app.get("/auth/me", checkAuth, getMe);

app.use("/uploads", express.static("src/uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
	try {
		res.json({
			message: "File uploaded successfully",
			file: req.file,
		});
	} catch (error) {
		res.status(500).json({
			message: "File upload failed",
		});
	}
});

app.get("/posts", getAll);

app.get("/posts/:id", getOne);

app.post("/posts", checkAuth, handleValidationsError, postCreateValidation, create);

app.delete("/posts/:id", checkAuth, remove);

app.patch("/posts/:id", checkAuth, handleValidationsError, update);

app.get("/tags", getLastTags);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
