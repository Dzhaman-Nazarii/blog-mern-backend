import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
	const token = (req.headers.authorization || "").replace(/Bearer\s/, "");
	if (!token) {
		return res.status(403).json({ message: "No access" });
	}

	try {
		const decoded = jwt.verify(token, "secretWord123");
		req.userId = decoded._id;
		next();
	} catch (error) {
		console.log(error);
		return res.status(403).json({ message: "No access" });
	}
};