const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require("cors");




app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

/* require all the routes here */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');


/* using all the routes here */
app.use('/api/auth', authRouter);
app.use("/api/interview", interviewRouter);

app.use((error, req, res, next) => {
    console.error(`Unhandled request error (${req.method} ${req.originalUrl}):`, error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).json({ message: 'An unexpected server error occurred' });
});


module.exports = app;