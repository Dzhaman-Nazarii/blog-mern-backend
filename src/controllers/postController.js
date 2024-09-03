import { Post } from "../models/post.js";

export const getAll = async (req, res) => {
	try {
		const posts = await Post.find().populate("user").exec();
		res.json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Unable to get posts",
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await Post.findByIdAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: "after" }
		)
			.populate("user")
			.exec();

		if (!doc) {
			return res.status(404).json({
				message: "Post not found",
			});
		}

		res.json(doc);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Unable to get posts",
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new Post({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.text,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		});
		const post = await doc.save();
		res.status(201).json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Unable to create post",
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findByIdAndDelete(postId);

		if (!post) {
			return res.status(404).json({
				message: "Post not found",
			});
		}

		res.json({
			message: "Post deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Unable to remove post",
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findByIdAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				iamgeUrl: req.body.iamgeUrl,
				user: req.body.user,
			},
			{
				returnDocument: "after",
			}
		);
		if (!post) {
			return res.status(404).json({
				message: "Post not found",
			});
		}
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Unable to update post",
		});
	}
};

export const getLastTags = async (req,res) => {
	try {
		const posts = await Post.find().limit(5).exec();
		const tags = posts.map(obj => obj.tags).flat().splice(0, 5)
		res.json(tags);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Unable to get posts",
		});
	}
}