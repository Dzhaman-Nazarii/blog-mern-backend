import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerValidation } from "./utils/validations.js";
import { validationResult } from "express-validator";
import { User } from "./models/user.js";

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

app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new User({
			name: req.body.name,
			email: req.body.email,
			passwordHash: hash,
			avatarURL: req.body.avatarURL,
		});

		const user = await doc.save();
		const token = jwt.sign(
			{
				_id: user._id,
			},
			"secretWord123",
			{
				expiresIn: "30d",
			}
		);

		const {passwordHash, ...userData} = user._doc;

		res.json({...userData, token});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Failed to register, try again",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
