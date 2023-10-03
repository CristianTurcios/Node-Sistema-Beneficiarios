const db = require('_helpers/db');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { getPagination, getPagingData } = require("_helpers/pagination");

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(id, page, size) {
  const { limit, offset } = getPagination(page, size);

  const condition = id ? { identidad: { [Op.like]: `%${id}%` } } : null;

  const data = await db.Beneficiarios.findAndCountAll({
    where: condition,
    limit,
    offset,
  });

  return getPagingData(data, page, limit);
}

async function getById(id) {
    return await getBeneficiario(id);
}

async function create(params) {
    // validate
    if (await db.Beneficiarios.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    const year = new Date().getFullYear();
    const userDate = new Date(params.bornDate).getFullYear()

    if (year - userDate < 65) {
        throw 'Fecha de nacimiento invalida';
    }

    // save user
    await db.Beneficiarios.create(params);
}

async function update(id, params) {
    const beneficiario = await getBeneficiario(id);

    // validate
    const identidadChanged = params.identidad && beneficiario.identidad !== params.identidad;
    if (identidadChanged && await db.Beneficiarios.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    // copy params to user and save
    await db.Beneficiarios.update(params, { where: { id } });
    return beneficiario.get();
}

async function _delete(id) {
    const beneficiario = await getBeneficiario(id);
    await beneficiario.destroy();
}

// helper functions
async function getBeneficiario(id) {
    const beneficiario = await db.Beneficiarios.findByPk(id);
    if (!beneficiario) throw 'Beneficiario no encontrado';
    return beneficiario;
}