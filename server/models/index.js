const { sequelize } = require('../config/db.config');

//импорт всех моделей
const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Place = require('./Place')(sequelize);
const UserPlace = require('./UserPlace')(sequelize);


//Связи аутентификации

//User (пользователь) принадлежит Role (роли) - (1:М)
User.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'RESTRICT'
});
Role.hasMany(User, {
    foreignKey: 'role_id'
});


//Связи журнала путешествий

//User (пользователь) имеет много UserPlace (записей журнала) - (1:М)
User.hasMany(UserPlace, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
UserPlace.belongsTo(User, {
    foreignKey: 'user_id'
});

//Place (место) имеет много UserPlace (записей журнала) - (1:М)
Place.hasMany(UserPlace, {
    foreignKey: 'place_id',
    onDelete: 'CASCADE'
});
UserPlace.belongsTo(Place, {
    foreignKey: 'place_id'
});


//экспорт объектов
module.exports = {
    sequelize, //экземпляр подключения
    Role,
    User,
    Place,
    UserPlace
};