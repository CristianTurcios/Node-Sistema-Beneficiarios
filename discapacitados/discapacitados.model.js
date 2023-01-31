const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        identidad: { type: DataTypes.STRING, allowNull: false },
        bornDate: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        department: { type: DataTypes.STRING, allowNull: false },
        municipality: { type: DataTypes.STRING, allowNull: false },
        village: { type: DataTypes.STRING, allowNull: false },
        barrio: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: true },
        discapacidad: { type: DataTypes.STRING, allowNull: false },
        identidadPersonInCharge: { type: DataTypes.STRING, allowNull: true },
        fullNamePersonInCharge:{ type: DataTypes.STRING, allowNull: true },
        phonePersonInCharge:  { type: DataTypes.STRING, allowNull: true },
        bornDatePersonInCharge: { type: DataTypes.STRING, allowNull: true },
        sex: { type: DataTypes.STRING, allowNull: true },
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Discapacitados', attributes, options);
}