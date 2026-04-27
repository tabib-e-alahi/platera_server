import app from "./app";
import envConfig from "./config";
import { prisma } from "./lib/prisma";

const PORT = envConfig.port || 5000;

async function server() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

server();