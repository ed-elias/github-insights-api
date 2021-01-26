'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false

            },
            login: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true

            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE,
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE,
            },
        },
        {tableName: 'users'});

    User.associate = function (models) {
        // A user can have many post
        User.hasMany(models.Commits, {foreignKey: 'user_id'});

    };

    return User;
};
