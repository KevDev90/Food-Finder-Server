import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/dbconnection.util"
import Restaurant from "./Restaurant";
class Review extends Model { }

Review.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Restaurant",
            key: "id"
        }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    review: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
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
        tableName: "reviews",
        modelName: "Review"
    })

export default Review