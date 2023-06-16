const { check,body ,param} = require('express-validator');
const validateLoginUser =[
    check('email')
    .notEmpty().withMessage('El parametro email es requerido').bail()
    .isEmail().withMessage('Email invalido'),
    check('password')
    .notEmpty().withMessage('Debes completar el campo contraseña')
];

module.exports = validateLoginUser;