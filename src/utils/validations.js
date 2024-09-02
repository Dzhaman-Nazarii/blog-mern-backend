import { body } from "express-validator";

export const registerValidation = [
	body("name")
		.isLength({ min: 3 })
		.withMessage("The name must contain at least 3 characters"),
	body("email").isEmail().withMessage("Incorrect email format"),
	body("password")
		.isLength({ min: 5 })
		.withMessage("The password must contain at least 5 characters"),
	body("avatar").optional().isURL(),
];

export const loginValidation = [
	body("email").isEmail().withMessage("Incorrect email format"),
	body("password")
		.isLength({ min: 5 })
		.withMessage("The password must contain at least 5 characters"),
];

export const postCreateValidation = [
	body("title").isString().isLength({min: 3}).withMessage("Enter the title of the post"),
	body("text").isString().isLength({min: 5}).withMessage("Enter the text of the post"),
	body("tags").optional().isString().withMessage("Incorrect tag format"),
	body("imageUrl").optional().isString().withMessage("Incorrect link image"),
]