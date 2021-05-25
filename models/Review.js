import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/dbconnection.util";



export const createReview = () => {
  class Review extends Model {}

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Restaurant",
          key: "id",
        },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      paranoid: true,
      tableName: "reviews",
      modelName: "Review",
    }
  );

  return Review;
};
