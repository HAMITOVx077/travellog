const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Place = sequelize.define('Place', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: true, //NULL, если изображение не загружено
        },
    }, {
        tableName: 'places',
        timestamps: true,
    });

    return Place;
};