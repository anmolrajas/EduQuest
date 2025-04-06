const { getUser } = require("../service/auth");

const checkAuth = (req, res) => {
    try {
        console.log("I'm in the backend...");
        const token = req.cookies.authToken; // Read authToken from cookies
        console.log("This is token in backend:- ", token);
        if (!token) return res.status(401).json({ message: "Not Authenticated" });

        const user = getUser(token); // Decode token
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = { checkAuth };