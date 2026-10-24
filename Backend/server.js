require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');


async function startServer() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be configured before starting the server');
    }

    await connectToDB();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});