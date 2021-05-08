import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export let sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
});


export const createConnection = async (sequelize) => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    } finally {
        await sequelize.sync();
    }
};