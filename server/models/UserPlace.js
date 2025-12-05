const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserPlace = sequelize.define('UserPlace', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        //user_id и place_id будут определены автоматически через связи
        
        status: {
            type: DataTypes.ENUM('want_to_visit', 'visited'), //использование ENUM
            defaultValue: 'want_to_visit',
            allowNull: false,
        },
        user_review: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: { //проверка на уровне Sequelize
                min: 1,
                max: 5
            }
        },
        visited_date: {
            type: DataTypes.DATEONLY, //только дата, без времени
            allowNull: true,
        },
        //создаем UNIQUE ключ для пары user_id и place_id прямо в модели
    }, {
        tableName: 'user_places',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'place_id'] //обеспечивает UNIQUE(user_id, place_id)
            }
        ]
    });

    return UserPlace;
};