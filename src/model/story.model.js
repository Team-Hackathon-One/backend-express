import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
const Story = sequelize.define(
  "Story",
  {
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    // },

    search_query: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    plant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    plant_family: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    plant_origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    plant_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    plant_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    plant_uses: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    recipes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    poisonous_parts: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    safety_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "search_story",
    paranoid: true,
    timestamps: true,
  }
);

export default Story;
