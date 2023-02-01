﻿const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    changePassword
};


const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit) - 1;

  return { totalItems, users, totalPages, currentPage };
};

async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Email or password is incorrect';

    if(!user.isActive)
        throw 'User inactive';

    // authentication successful
    const token = jwt.sign({ 
        ...omitHash(user.get()),
        sub: user.id
    }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll(email, page, size) {
    const { limit, offset } = getPagination(page, size);
    const condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

    const data =  await db.User.findAndCountAll(
        {
            where: condition,
            limit,
            offset
        }
    );
    return getPagingData(data, page, limit);
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" ya existe en el sistema';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" ya existe en el sistema';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function changePassword(id, newPassword, oldPassword) {
    if(newPassword === oldPassword) throw 'Password are the same';

    const user = await db.User.scope('withHash').findByPk(id);

    if (!user || !(await bcrypt.compare(oldPassword, user.hash)))
        throw 'Password mismatch';

    const data = {
        hash: await bcrypt.hash(newPassword, 10)
    };

    // copy params to user and save
    Object.assign(user, data);
    await user.save();
}

// helper functions
async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'Usuario no encontrado';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}