import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/dbconnection.util"
import Review from "./Review"
class Restaurant extends Model { }

Restaurant.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: DataTypes.STRING,
    price_range: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // deletedAt: {
    //     type: DataTypes.DATE
    // }
},
    {
        sequelize,
        timestamps: false,
        paranoid: true,
        tableName: "restaurants",
        modelName: "Restaurant",
    })



export default Restaurant