import { body } from "express-validator";


export const loginUsuario = [

    body('email')
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido'),

    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória')
]

export const cadastroUsuario = [

    body('nome')
        .notEmpty().withMessage('Nome é obrigatório'),

    body('email')
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido'),

    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isString()
        .withMessage('Senha deve ser uma string')
        .isLength({ min: 8})
        .withMessage('Senha deve ter no mínimo 8 caracteres'),

    body('tipo_usuario')
        .isIn(['admin', 'usuario'])
        .withMessage('Tipo de usuário inválido. Deve ser admin ou usuario')
]