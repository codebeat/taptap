const {
    sequelize,
    DataTypes,
    Sequelize,
} = require("../config/mysql-sequelize");

const Earnings = sequelize.define(
    "Earnings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userid: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "tg_users",
                key: "userid",
            },
        },
        tap_score: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        referral_score: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        checkin_score: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        task: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        task_score: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        game_level: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        current_streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        enery_restore_time: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        energy_remaning: {
            type: DataTypes.INTEGER,
            defaultValue: 2000,
        },
        last_login_at: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        miner_level: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        last_mine_date: {
            type: DataTypes.DATE,
            defaultValue: null,
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
    }, {
        tableName: "earnings",
        timestamps: false,
        indexes: [{
            fields: ["userid"],
        }, ],
        hooks: {
            beforeUpdate: (earnings, options) => {
                earnings.modifiydate = new Date();
            },
        },
    }
);

module.exports = Earnings;