import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import userService from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contextData/AuthContextData";

const LoginSignup = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [signUpUser, setSignUpUser] = useState({
        name: "",
        password: "",
        email: "",
        profilePicture: ""
    });
    const [loginUser, setLoginUser] = useState({
        email: "",
        password: ""
    });
    const { user, setUser, loading } = useContext(AuthContext);

    const navigate = useNavigate();

    // Variants for one-by-one effect
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.8 // Each child appears one by one every 0.5s
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 1.0 } }
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSignUpChange = (e) => {
        setSignUpUser({ ...signUpUser, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
    };

    const handleSignUpSubmit = async(e) => {
        e.preventDefault();

        console.log("This is signup form data:- ", signUpUser);

        if(!signUpUser.email)   return toast.info("Please enter your email");

        if(!signUpUser.password)    return toast.info("Please enter your password");

        if(!signUpUser.name)   return toast.info("Please enter your name"); 

        if (!emailRegex.test(signUpUser.email)) {
            return toast.error("Please enter a valid email address");
        }

        try{
            const res = await userService.signUp(signUpUser);
            console.log("This is signup res in frontend:- ", res);
            toast.success("Signup Successfull");
            navigate('/home');
        }
        catch(error){
            if(error.status === 401){
                console.error("User already exists", error);
                return toast.error("User already exisits");
            }
            console.error("Failed to signup user ", error);
            return toast.error("Failed to SignUp user");
        }

    }

    const handleLoginSubmit = async(e) => {
        e.preventDefault();

        console.log("This is login form data:- ", loginUser);

        if(!loginUser.email)   return toast.info("Please enter your email");

        if(!loginUser.password)    return toast.info("Please enter your password");

        if (!emailRegex.test(loginUser.email)) {
            return toast.error("Please enter a valid email address");
        }

        try{
            const res = await userService.logIn(loginUser);
            console.log("This is login res in frontend:- ", res);
            setUser(res.user);
            toast.success("Login Successfull");
            navigate('/home');
        }
        catch(error){
            console.error("Failed to login user ", error?.response?.data?.msg);
            return toast.error("Invalid email or password");
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#1E3A8A]">
            {/* Left Section: Login/Signup */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1.5 }}
                className="w-full md:w-1/2 flex flex-col justify-center items-center bg-[#22D3EE] p-6"
            >
                <div className="w-full max-w-md p-8 bg-[#1E3A8A] text-white rounded-lg shadow-lg">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.8 }}
                        className="flex mb-6"
                    >
                        <button
                            className={`w-1/2 py-3 text-xl font-bold ${
                                activeTab === "login" ? "border-b-2 border-[#F59E0B]" : "text-gray-400"
                            }`}
                            onClick={() => setActiveTab("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`w-1/2 py-3 text-xl font-bold ${
                                activeTab === "signup" ? "border-b-2 border-[#F59E0B]" : "text-gray-400"
                            }`}
                            onClick={() => setActiveTab("signup")}
                        >
                            Signup
                        </button>
                    </motion.div>

                    {activeTab === "login" ? (
                        <form onSubmit={handleLoginSubmit}>
                            <input type="text" placeholder="📧 Email" name="email" className="w-full p-3 border rounded mb-3 bg-[#334155] text-white" value={loginUser.email} onChange={handleLoginChange} />
                            <input type="password" placeholder="🔒 Password" name="password" className="w-full p-3 border rounded mb-3 bg-[#334155] text-white" value={loginUser.password} onChange={handleLoginChange} />
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                type="submit" 
                                className="w-full bg-[#F59E0B] text-black py-3 rounded font-bold"
                            >
                                Login
                            </motion.button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUpSubmit}>
                            <input type="text" placeholder="📝 Name" name="name" className="w-full p-3 border rounded mb-3 bg-[#334155] text-white" value={signUpUser.name} onChange={handleSignUpChange}  />
                            <input type="text" placeholder="📧 Email" name="email" className="w-full p-3 border rounded mb-3 bg-[#334155] text-white" value={signUpUser.email} onChange={handleSignUpChange} />
                            <input type="password" placeholder="🔒 Password" name="password" className="w-full p-3 border rounded mb-3 bg-[#334155] text-white" value={signUpUser.password} onChange={handleSignUpChange} />
                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                type="submit" 
                                className="w-full bg-[#F59E0B] text-black py-3 rounded font-bold"
                            >
                                Signup
                            </motion.button>
                        </form>
                    )}
                </div>
            </motion.div>

            {/* Right Section: Learning Platform Info with One-by-One Effect */}
            <motion.div 
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="w-full md:w-1/2 flex flex-col justify-center items-center bg-[#1E3A8A] text-white p-10 text-center"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold mb-6 text-[#F59E0B]"
                >
                    🚀 Welcome to EduQuest!
                </motion.h1>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-3">
                    📚 <strong>Learn Smart:</strong> Access high-quality courses & assessments.
                </motion.p>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-3">
                    🎯 <strong>Test Your Knowledge:</strong> Take interactive quizzes & track your progress.
                </motion.p>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-3">
                    📊 <strong>AI Analytics:</strong> Get insights into your strengths & improvement areas.
                </motion.p>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-3">
                    🏆 <strong>Earn Certifications:</strong> Boost your career with skill-based achievements.
                </motion.p>
                <motion.p variants={itemVariants} className="text-lg md:text-xl mt-3">
                    🔥 <strong>Join Now!</strong> Start your journey today & level up your skills!
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoginSignup;