import User from "../models/User.js";

export async function login(req, res) {
  try {
    const { data } = req.body;
    let existingUser = await User.findOne({ email: data.email });
    if (!existingUser) {
      const newUser = new User({ username: data.email, email: data.email, displayName: data.name });
      await newUser.save();
      existingUser = newUser;
    }
    res.status(201).json(existingUser);
  } catch (error) {
    console.log("Error:" + error);
  }
}
