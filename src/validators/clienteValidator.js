import { body } from 'express-validator';

export const createUsuarioValidator = [

    body('nome')
        .notEmpty().withMessage('Nome é obrigatório'),
    
    body('email')
        .optional()
        .isEmail().withMessage('Email inválido'),
    
    body('contato')
        .optional()
        .isLength({ min: 11, max: 15})
        .notEmpty().withMessage('Contato é obrigatório'),

    body('empresa')
        .optional()
        .notEmpty().withMessage('Empresa é obrigatório'),

    body('origem')
        .optional()
        .isIn(['site', 'indicacao', 'whatsapp'])
        .withMessage('Origem é obrigatório'),

    body('observacao')
        .optional()
        .isString().withMessage('Observação deve ser uma string')
]