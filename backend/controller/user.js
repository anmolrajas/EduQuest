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

const getUserDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await USER.findById(userId).lean();

    if (!user || !user.testHistory) {
      return res.json({ success: true, data: null });
    }

    const testsTaken = user.testHistory.length;
    const totalScore = user.testHistory.reduce((sum, test) => sum + test.score, 0);
    const totalCorrect = user.testHistory.reduce((sum, test) => sum + test.correct, 0);
    const totalWrong = user.testHistory.reduce((sum, test) => sum + test.wrong, 0);
    const maxMarks = user.testHistory.reduce((sum, test) => sum + test.maxMarks, 0);

    const averageScore = testsTaken > 0 ? totalScore / testsTaken : 0;
    const accuracy = totalCorrect + totalWrong > 0
      ? (totalCorrect / (totalCorrect + totalWrong)) * 100
      : 0;

    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const tests = user.testHistory.filter(test => 
        new Date(test.submittedAt).toISOString().startsWith(dateStr)
      );
      const total = tests.reduce((sum, t) => sum + t.score, 0);

      return {
        date: dateStr,
        score: total
      };
    }).reverse();

    res.json({
      success: true,
      data: {
        testsTaken,
        totalScore,
        averageScore: averageScore.toFixed(2),
        accuracy: accuracy.toFixed(2),
        maxMarks,
        totalQuestionsSolved: totalCorrect,
        weeklyPerformance: last7Days
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
    userSignUp,
    userLogin,
    getUserDashboardStats
}