import app from "./app.js";
import { connectDb } from "./config/db.js";


const startServer = async () => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}.`);
        })
    } catch (err) {
        console.log("Error: ", err.message);
    }
}

await startServer();