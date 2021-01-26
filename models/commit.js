'use strict';

module.exports = (sequelize, DataTypes) => {
    const Commit = sequelize.define('Commits', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                field: 'user_id',
            },
            cursor: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            committedDate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'committed_date',
            },
            additions: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            deletions: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: false
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
        {tableName: 'commits'});

    Commit.associate = function (models) {
        // A post belongs to a user
        Commit.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return Commit;
};
