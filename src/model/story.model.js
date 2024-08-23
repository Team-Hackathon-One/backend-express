import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Story = sequelize.define(
  "Story",
  {
    plant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    plant_desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    plant_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "search_story",
    paranoid: true,
    timestamps: true,
  }
);

export default Story;
