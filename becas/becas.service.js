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
  
  const data = await db.Becas.findAndCountAll({
    where: condition,
    limit,
    offset,
  });

  return getPagingData(data, page, limit);
}

async function getById(id) {
    return await getRegistro(id);
}

async function create(params) {
    // validate
    if (await db.Becas.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    if (params.grade < 75) {
        throw 'Indice Academico debe ser igual o mayor a 75%';
    }

    // save user
    await db.Becas.create(params);
}

async function update(id, params) {
    const becas = await getRegistro(id);

    // validate
    const identidadChanged = params.identidad && becas.identidad !== params.identidad;
    if (identidadChanged && await db.Becas.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    if (params.grade < 75) {
        throw 'Indice Academico debe ser igual o mayor a 75%';
    }

    // copy params to user and save
    await db.Becas.update(params, { where: { id } });
    return await getRegistro(id);
}

async function _delete(id) {
    const becas = await getRegistro(id);
    await becas.destroy();
}

// helper functions
async function getRegistro(id) {
    const beca = await db.Becas.findByPk(id);
    if (!beca) throw 'Registro no encontrado';
    return beca;
}