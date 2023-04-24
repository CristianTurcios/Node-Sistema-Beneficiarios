const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const becasService = require('./becas.service');

// routes
router.post('/', authorize(), registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function registerSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        identidad: Joi.string().min(13).required(),
        sex: Joi.string().required(),
        bornDate: Joi.string().required(),
        age: Joi.number().required(),
        department: Joi.string().required().allow(''),
        municipality: Joi.string().required().allow(''),
        village: Joi.string().required().allow(''),
        barrio: Joi.string().required().allow(''),
        currentAddress: Joi.string().required(),
        phone: Joi.string().min(8).required(),
        email: Joi.string().optional().email(),
        // *** General information
        ethnicity: Joi.string().required(),
        vulnerableGroup: Joi.any().required(),
        civilStatus: Joi.string().required(),
        numberOfChildren: Joi.number().optional(),
        // *** Institution Information  ****
        educationalCenterName: Joi.string().required(),
        educationalCenterAddress: Joi.string().required(),
        academicLevel: Joi.string().required(),
        grade: Joi.number().required(),
        // *** Fathers or tutors information ***
        motherOrFatherName: Joi.string().optional().allow(''),
        motherOrFatherLastName: Joi.string().optional().allow(''),
        numberOfChildrenFathers: Joi.number().optional(),
        educationalLevelMotherOrFather: Joi.string().optional().allow(''),
        identidadMotherOrFather: Joi.string().min(13).optional().allow(''),
        fathersAddress: Joi.string().optional().allow(''),
        motherOrFatherWork: Joi.string().optional().allow(''),
        monthlyIncome: Joi.string().optional(),
        fathersPhone: Joi.string().optional().allow(''),
        observation: Joi.string().optional().allow(''),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    becasService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    becasService.getAll()
        .then(data => res.json(data))
        .catch(next);
}

function getById(req, res, next) {
    becasService.getById(req.params.id)
        .then(data => res.json(data))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        identidad: Joi.string().min(13).required(),
        sex: Joi.string().required(),
        bornDate: Joi.string().required(),
        age: Joi.number().required(),
        department: Joi.string().required().allow(''),
        municipality: Joi.string().required().allow(''),
        village: Joi.string().required().allow(''),
        barrio: Joi.string().required().allow(''),
        currentAddress: Joi.string().required(),
        phone: Joi.string().min(8).required(),
        email: Joi.string().optional().email(),
        // *** General information
        ethnicity: Joi.string().required(),
        vulnerableGroup: Joi.any().required(),
        civilStatus: Joi.string().required(),
        numberOfChildren: Joi.number().optional(),
        // *** Institution Information  ****
        educationalCenterName: Joi.string().required(),
        educationalCenterAddress: Joi.string().required(),
        academicLevel: Joi.string().required(),
        grade: Joi.number().required(),
        // *** Fathers or tutors information ***
        motherOrFatherName: Joi.string().optional().allow(''),
        motherOrFatherLastName: Joi.string().optional().allow(''),
        numberOfChildrenFathers: Joi.number().optional(),
        educationalLevelMotherOrFather: Joi.string().optional().allow(''),
        identidadMotherOrFather: Joi.string().min(13).optional().allow(''),
        fathersAddress: Joi.string().optional().allow(''),
        motherOrFatherWork: Joi.string().optional().allow(''),
        monthlyIncome: Joi.string().optional(),
        fathersPhone: Joi.string().optional().allow(''),
        observation: Joi.string().optional().allow(''),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    becasService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    becasService.delete(req.params.id)
        .then(() => res.json({ message: 'Registro Borrado con exito' }))
        .catch(next);
}
