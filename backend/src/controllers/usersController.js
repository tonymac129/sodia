import User from "../models/User.js";

export async function createUser(req, res) {
  try {
    const { username, password, displayName } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (password === existingUser.password) {
        return res.status(200).json({ message: "Logged in", username: username });
      }
      return res.status(400).json({ message: "Wrong password" });
    } else {
      const newUser = new User({ username, password, displayName });
      await newUser.save();
      res.status(201).json({ message: "Logged in", username: username });
    }
  } catch (error) {
    console.error("Error: " + error);
  }
}

export async function getUser(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findOne({ username: id });
    if (user) {
      return res.status(200).json(user);
    } else {
      res.status(404).json({ message: "No user found!" });
    }
  } catch (error) {
    console.error("Error: " + error);
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    await User.findOneAndDelete({ username: id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error: " + error);
  }
}

export async function editUser(req, res) {
  try {
    const id = req.params.id;
    const { displayName,pfp } = req.body;
    const updatedUser = await User.findOneAndReplace({ username: id }, { ...req.body, displayName: displayName,pfp:pfp });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error: " + error);
  }
}
