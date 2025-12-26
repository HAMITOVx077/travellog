const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        },
        password_hash: {
            type: DataTypes.TEXT, 
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.STRING(255),
            allowNull: true, //NULL, если аватарка не загружена
        },
    }, {
        tableName: 'users',
        timestamps: true, //включаем created_at и updated_at
    });

    return User;
};