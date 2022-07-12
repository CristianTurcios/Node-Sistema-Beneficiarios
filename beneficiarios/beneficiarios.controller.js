const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const beneficiariosService = require('./beneficiarios.service');

// routes
router.post('/', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
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
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    beneficiariosService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    beneficiariosService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    beneficiariosService.getById(req.params.id)
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
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    beneficiariosService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    beneficiariosService.delete(req.params.id)
        .then(() => res.json({ message: 'Beneficiario deleted successfully' }))
        .catch(next);
}