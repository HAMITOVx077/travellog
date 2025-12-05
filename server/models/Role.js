const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        role_name: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false,
        },
    }, {
        tableName: 'roles',
        timestamps: false,
    });

    //автоматическая вставка базовых ролей при создании таблицы
    Role.afterSync(async () => {
        const count = await Role.count();
        if (count === 0) {
            await Role.bulkCreate([
                { role_name: 'user' },
                { role_name: 'admin' },
            ]);
            console.log('Добавлены базовые роли: user, admin');
        }
    });

    return Role;
};