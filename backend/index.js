const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectMongoDB = require('./connection')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const subjectRoutes = require('./routes/subjectRoutes')
const topicRoutes = require('./routes/topicRoutes')
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');
const app = express();
require('dotenv').config();
const allowedOrigins = ['http://localhost:5173', 'https://upgradist.vercel.app', 'https://eduquest-git-production-anmolrajas-projects.vercel.app'];

connectMongoDB(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB Connected Successfully");
}).catch((err) => {
    console.log("MogoDB Connection Error:- ", err);
})

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);

app.get('/', (req, res) => {
    return res.end('Hello from server');
})

app.listen(process.env.PORT, () => {
    console.log(`Server Started at PORT: ${process.env.PORT}`);
})