const { sequelize, DataTypes, Sequelize } = require("../config/mysql-sequelize");;


const Tasks = sequelize.define(
    "Tasks", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        claim_score: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        follow_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        task_under_by: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        task_add_by: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'HOLD'),
            defaultValue: 'ACTIVE',
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
        tableName: "tasks",
        timestamps: false,
        hooks: {
            beforeUpdate: (task, options) => {
                task.modified_date = new Date();
            },
        },
    }
);

module.exports = Tasks;