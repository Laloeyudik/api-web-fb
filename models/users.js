const db = require('../database/dbConfig.js')
const sequelize = require('sequelize')

const { DataTypes } = sequelize;
const users = db.define('tb_users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: false,
        }
    },

})

module.exports = users