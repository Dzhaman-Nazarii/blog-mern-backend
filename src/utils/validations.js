import { body } from "express-validator";

export const registerValidation = [
	body("name")
		.isLength({ min: 3 })
		.withMessage("The name must contain at least 3 characters"),
	body("email").isEmail(),
	body("password")
		.isLength({ min: 5 })
		.withMessage("The password must contain at least 5 characters"),
	body("avatar").optional().isURL(),
];
