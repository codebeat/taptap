const {
  sequelize,
  DataTypes,
  Sequelize,
} = require("../config/mysql-sequelize");

const TGUser = sequelize.define(
  "TGUser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    langauage_code: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    referral_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    referral_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ref_claim: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: false,
      defaultValue: "N",
    },
    tg_premium_user: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: false,
      defaultValue: "N",
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "tg_users",
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "modified_date",
  }
);

module.exports = TGUser;
