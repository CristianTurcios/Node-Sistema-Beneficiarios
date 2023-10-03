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

  const data = await db.Discapacitados.findAndCountAll({
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
    if (await db.Discapacitados.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    // Actualmente los discapacitados van tener libre el limite de edad
    const year = new Date().getFullYear();

    if(params?.bornDatePersonInCharge) {
        const bornDatePersonInCharge = new Date(params.bornDatePersonInCharge).getFullYear();
        
        if (year - bornDatePersonInCharge < 18) {
            throw 'Fecha de nacimiento invalida';
        }
    }

    // save user
    await db.Discapacitados.create(params);
}

async function update(id, params) {
    const discapacitados = await getRegistro(id);

    // validate
    const identidadChanged = params.identidad && discapacitados.identidad !== params.identidad;
    if (identidadChanged && await db.Discapacitados.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    // copy params to user and save
    await db.Discapacitados.update(params, { where: { id } });
    return discapacitados.get();
}

async function _delete(id) {
    const discapacitados = await getRegistro(id);
    await discapacitados.destroy();
}

// helper functions
async function getRegistro(id) {
    const discapacitado = await db.Discapacitados.findByPk(id);
    if (!discapacitado) throw 'Registro no encontrado';
    return discapacitado;
}