import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
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

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Failed to register, try again",
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email }).lean();
		if (!user) {
			return res.status(401).json({
				message: "Invalid login or password",
			});
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user.passwordHash
		);

		if (!isValidPass) {
			return res.status(401).json({
				message: "Invalid login or password",
			});
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			"secretWord123",
			{
				expiresIn: "30d",
			}
		);

		const { passwordHash, ...userData } = user;

		res.json({
			...userData,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Failed to login, try again",
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.userId).lean();
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		const { passwordHash, ...userData } = user;
		res.json(userData);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went wrong, try again",
		});
	}
};
