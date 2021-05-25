import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/dbconnection.util";



export const createRestaurant = () => {
  class Restaurant extends Model {}

  Restaurant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      price_range: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      paranoid: true,
      tableName: "restaurants",
      modelName: "Restaurant",
    }
  );

  return Restaurant;
};
