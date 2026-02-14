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

    body('tipo_cliente')
        .notEmpty()
        .withMessage('Tipo de cliente é obrigatório')
        .isIn(['pf', 'pj', 'mei'])
        .withMessage('Tipo de cliente deve ser pf, pj ou mei'),

    // CPF obrigatório se for PF
    body('cpf')
        .if(body('tipo_cliente').equals('pf'))
        .notEmpty()
        .withMessage('CPF é obrigatório para pessoa física')
        .bail()
        .matches(/^[0-9]{11}$/)
        .withMessage('CPF deve conter 11 números'),

    // CNPJ obrigatório se for PJ ou MEI
    body('cnpj')
        .if(body('tipo_cliente').isIn(['pj', 'mei']))
        .notEmpty()
        .withMessage('CNPJ é obrigatório para PJ ou MEI')
        .bail()
        .matches(/^[0-9]{14}$/)
        .withMessage('CNPJ deve conter 14 números'),

    body('cidade')
        .optional()
        .isString()
        .withMessage('Cidade deve ser uma string'),

    body('estado')
        .optional()
        .isLength({ min: 2, max: 2 })
        .withMessage('Estado deve ter 2 caracteres (UF)'),

    body('observacao')
        .optional()
        .isString().withMessage('Observação deve ser uma string')
]