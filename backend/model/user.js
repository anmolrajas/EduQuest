const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

userSchema.static("matchPassword", async function (email, password){
    const user = await this.findOne({email});

    console.log("User:- ", user);

    if(!user) return {"status": false, "msg": "User Not Found!"};
    
    if (!user.salt || !user.password) {
        console.log("yaha aaya");
        return { status: false, msg: "User has invalid credentials stored!" };
    }

    const salt = user.salt;

    const hashedPassword = user.password;


    const usrProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest('hex');

    if (usrProvidedPassword !== hashedPassword) {
        return { status: false, msg: "Invalid Credentials!" };
    }

    const userObj = user.toObject();
    userObj.password = undefined;
    userObj.salt = undefined;

    return { status: true, user: userObj };
})

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString('hex');

    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    user.salt = salt;
    user.password = hashedPassword;

    next();
})

const USER = mongoose.model("User", userSchema);

module.exports = USER;