import { model, Schema } from "mongoose";

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		avatarURL: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export const User = model("User", UserSchema);