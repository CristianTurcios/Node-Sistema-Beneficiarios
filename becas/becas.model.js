const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        identidad: { type: DataTypes.STRING, allowNull: false },
        sex: { type: DataTypes.STRING, allowNull: false },
        bornDate: { type: DataTypes.STRING, allowNull: false },
        age: { type: DataTypes.NUMBER, allowNull: false },
        // *** Born Address information ***
        department: { type: DataTypes.STRING, allowNull: false },
        municipality: { type: DataTypes.STRING, allowNull: false },
        village: { type: DataTypes.STRING, allowNull: false },
        barrio: { type: DataTypes.STRING, allowNull: false },
        currentAddress: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: true },
        // *** General information
        ethnicity: { type: DataTypes.STRING, allowNull: false },
        vulnerableGroup: { type: DataTypes.JSON, allowNull: false },
        civilStatus: { type: DataTypes.STRING, allowNull: false },
        numberOfChildren: { type: DataTypes.NUMBER, allowNull: true },
        // *** Institution Information  ****
        educationalCenterName: { type: DataTypes.STRING, allowNull: false },
        educationalCenterAddress: { type: DataTypes.STRING, allowNull: false },
        academicLevel: { type: DataTypes.STRING, allowNull: false },
        grade: { type: DataTypes.NUMBER, allowNull: false },
        // *** Fathers or tutors information ***
        motherOrFatherName: { type: DataTypes.STRING, allowNull: true },
        motherOrFatherLastName: { type: DataTypes.STRING, allowNull: true },
        numberOfChildrenFathers: { type: DataTypes.NUMBER, allowNull: true },
        educationalLevelMotherOrFather: { type: DataTypes.STRING, allowNull: true },
        fathersAddress: { type: DataTypes.STRING, allowNull: true },
        motherOrFatherWork: { type: DataTypes.STRING, allowNull: true },
        identidadMotherOrFather: { type: DataTypes.STRING, allowNull: true },
        monthlyIncome: { type: DataTypes.STRING, allowNull: true },
        fathersPhone: { type: DataTypes.STRING, allowNull: true },
        observation: { type: DataTypes.STRING, allowNull: true },
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

    return sequelize.define('Becas', attributes, options);
}