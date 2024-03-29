const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const discapacitadosService = require('./discapacitados.service');

// routes
router.post('/', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get("/report", authorize(), getReport);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        identidad: Joi.string().min(13).required(),
        bornDate: Joi.string().required(),
        phone: Joi.string().min(8).required(),
        department: Joi.string().required(),
        municipality: Joi.string().required(),
        village: Joi.string().required(),
        barrio: Joi.string().required(),
        name: Joi.string().optional().allow(''),
        lastName: Joi.string().optional().allow(''),
        discapacidad: Joi.string().required(),
        identidadPersonInCharge: Joi.string().optional().min(13).allow('').allow(null),
        fullNamePersonInCharge: Joi.string().optional().allow('').allow(null),
        phonePersonInCharge: Joi.string().optional().min(8).allow('').allow(null),
        bornDatePersonInCharge: Joi.string().optional().allow('').allow(null),
        sex: Joi.string().optional().allow('').allow(null),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    discapacitadosService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    const { id, page, size } = req.query;
    discapacitadosService.getAll(id, page, size)
        .then(users => res.json(users))
        .catch(next);
}

function getReport(req, res, next) {
  discapacitadosService
    .getReport()
    .then((data) => res.json(data))
    .catch(next);
}

function getById(req, res, next) {
    discapacitadosService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        identidad: Joi.string().min(13).required(),
        bornDate: Joi.string().required(),
        phone: Joi.string().min(8).required(),
        department: Joi.string().required(),
        municipality: Joi.string().required(),
        village: Joi.string().required(),
        barrio: Joi.string().required(),
        name: Joi.string().optional().allow(''),
        lastName: Joi.string().optional().allow(''),
        discapacidad: Joi.string().required(),
        identidadPersonInCharge: Joi.string().optional().min(13).allow('').allow(null),
        fullNamePersonInCharge: Joi.string().optional().allow('').allow(null),
        phonePersonInCharge: Joi.string().optional().min(8).allow('').allow(null),
        bornDatePersonInCharge: Joi.string().optional().allow('').allow(null),
        sex: Joi.string().optional().allow('').allow(null),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    discapacitadosService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    discapacitadosService.delete(req.params.id)
        .then(() => res.json({ message: 'Registro Borrado con exito' }))
        .catch(next);
}