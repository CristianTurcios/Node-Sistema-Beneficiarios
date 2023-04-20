const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Becas.findAll();
}

async function getById(id) {
    return await getRegistro(id);
}

async function create(params) {
    // validate
    if (await db.Becas.findOne({ where: { identidad: params.identidad } })) {
        throw 'Identidad "' + params.identidad + '" ya existe en el sistema';
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