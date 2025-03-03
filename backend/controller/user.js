const USER = require('../model/user');

const userSignUp = async (req, res) => {
    const { name, email, password, profilePicture } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    const existingUser = await USER.findOne({ email });
    if (existingUser) {
        return res.status(401).json({ error: "User already exists" });
    }

    const User = await USER.create({
        name: name,
        email: email,
        password: password,
        profilePicture: profilePicture
    });

    return res.status(201).json({ _id: User._id, msg: "User Created Successfully" });
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const result = await USER.findOne({ email, password });

    console.log("Login result:- ",result);

    if (!result) return res.status(400).json({ msg: "User does not exists" });

    // const authToken = setUser(result);

    return res.status(200).json({ msg: "User Logged in Successfully" })
}

module.exports = {
    userSignUp,
    userLogin
}