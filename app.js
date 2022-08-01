const PORT =3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(express.cors());

app.get("/outfit", (req, res) => {
	const tops = ["Black", "White", "Pink", "Blue"];
	const bottoms = ["Skirt", "Short", "jeans", "pants"];
	const shoes = ["sneakers", "high heels", "flats"];

	res.json({
		top: _.sample(tops),
		bottoms: _.sample(bottoms),
		shoes: _.sample(shoes)
	});
});

app.get("/comments/:id", async (req, res) => {
	const id = req.params.id;
	let content;

	try {
		content = await fs.readFile(`data/comments/${id}.txt`, "utf-8");
	} catch (err) {
		return res.sendStatus(404);
	}

	res.json({
		content: content
	});
});

app.post("/comments", async (req, res) => {
	const id = uuid();
	const content = req.body.content;

	if (!content) {
		return res.sendStatus(400);
	}

	await fs.mkdir("data/comments", { recursive: true });
	await fs.writeFile(`data/comments/${id}.txt`, content);

	res.status(201).json({
		id: id
	});
});

app.listen(3000, () => console.log("API Server is running..."));