import { Sequelize } from "sequelize";
import configs from '../config/config';
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || 'development'
const config = configs[env];
export let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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