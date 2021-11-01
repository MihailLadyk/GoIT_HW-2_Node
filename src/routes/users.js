const express = require("express");
const path = require("path");
const { nanoid } = require("nanoid");
const yup = require("yup");
const fs = require("fs").promises;
const schemaValidate = require("../middlewares/schemaValidate");
const router = express.Router();
const usersDbPath = path.resolve(__dirname, "../../db/users.json");
const Contact = require("../../model/Contacts");
const Contacts = require("../../model/Contacts");
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
    .max(255),
  password: yup.string().min(6),
  age: yup.number().min(14),
  email: yup.string().email(),
  favorite: yup.boolean().notRequired(),
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
    const newUser = await Contact.create(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user data
router.put("/:userId", schemaValidate(updateUserSchema), async (req, res) => {
  try {
    const Updateduser = await Contact.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// router.patch("/:userId/favorite", async (req, res, next) => {
//   try {
//     const user = await Contact.findById(req.params.userId);
//     if (req.body.favorite !== undefined) {
//       return res.status(400), json({ message: "123" });
//     }
//     const Updateduser = await Contact.findByIdAndUpdate(
//       req.params.userId,

//       {
//         new: true,
//       },
//       {
//         favorite: req.body.favorite,
//       }
//     );
//     res.json(Updateduser);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

/// find all
router.get("/", async (req, res) => {
  try {
    const users = await Contacts.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

/// find user by id
router.get("/:userId", async (req, res) => {
  try {
    const targetUser = await Contact.findById(req.params.userId);
    res.json(targetUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.userId);
    res.json({ message: "deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
