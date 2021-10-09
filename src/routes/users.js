const express = require("express");
const path = require("path");
const { nanoid } = require("nanoid");
const yup = require("yup");
const fs = require("fs").promises;
const schemaValidate = require("../middlewares/schemaValidate");
const router = express.Router();
const usersDbPath = path.resolve(__dirname, "../../db/users.json");

/*
  user {
    username: str
    password: str
    age: number
    email: string
  }
*/

const createUserSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username should be at least 3 characters long")
    .max(255)
    .required(),
  password: yup.string().min(6).required(),
  age: yup.number().min(14).required(),
  email: yup.string().email().required(),
});

const updateUserSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username should be at least 3 characters long")
    .max(255),
  password: yup.string().min(6),
  age: yup.number().min(14),
  email: yup.string().email(),
});

// Create new user
router.post("/", schemaValidate(createUserSchema), async (req, res) => {
  try {
    let users = await fs.readFile(usersDbPath);
    users = JSON.parse(users);

    const newUser = {
      ...req.body,
      id: nanoid(),
    };
    users.push(newUser);

    await fs.writeFile(usersDbPath, JSON.stringify(users));

    res.json(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user data
router.put("/:userId", schemaValidate(updateUserSchema), async (req, res) => {
  try {
    let users = await fs.readFile(usersDbPath);
    users = JSON.parse(users);
    users = users.map((user) =>
      user.id === req.params.userId ? { ...user, ...req.body } : user
    );
    await fs.writeFile(usersDbPath, JSON.stringify(users));

    const newUsers = await fs.readFile(usersDbPath);
    const targetUser = JSON.parse(newUsers).find(
      ({ id }) => id === req.params.userId
    );
    res.json(targetUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    let users = await fs.readFile(usersDbPath);
    users = JSON.parse(users);
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    let users = await fs.readFile(usersDbPath);
    users = JSON.parse(users);

    const targetUser = users.find((user) => user.id === req.params.userId);
    if (!targetUser) {
      res.status(404).json({ message: "Not found!" });
      return;
    }

    res.json(targetUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    let users = await fs.readFile(usersDbPath);
    users = JSON.parse(users);
    users = users.filter((user) => user.id !== req.params.userId);
    await fs.writeFile(usersDbPath, JSON.stringify(users));

    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
