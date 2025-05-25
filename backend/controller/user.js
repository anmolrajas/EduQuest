const USER = require('../model/user');
const {setUser, getUser} = require('../service/auth')

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
    console.log(email, password);
    const result = await USER.matchPassword(email, password);

    console.log("Login result:- ",result);

    if (!result.status) return res.status(400).json({ msg: result.msg });

    const authToken = setUser({_id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role});
    console.log("This is auth token:- ",authToken);
    res.cookie("authToken", authToken, {
        httpOnly: false,  // Prevent client-side JavaScript from accessing the cookie
        secure: true,    // Send cookie only over HTTPS
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // Expires in 7 days
    });
    
    return res.status(200).json({
        msg: "User Logged in Successfully", user: {
            _id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
        }
    })
}

module.exports = {
    userSignUp,
    userLogin
}