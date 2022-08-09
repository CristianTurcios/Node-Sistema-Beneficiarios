const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Discapacitados.findAll();
}

async function getById(id) {
    return await getRegistro(id);
}

async function create(params) {
    // validate
    if (await db.Discapacitados.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
    }

    const year = new Date().getFullYear();
    const userDate = new Date(params.bornDate).getFullYear()

    if (year - userDate < 18) {
        throw 'Fecha de nacimiento invalida';
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