import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { cadastroClienteController, listarClientesController } from '../controllers/userController.js';
import { validationMiddleware } from '../middlewares/validatorMiddleware.js';
import { createUsuarioValidator } from '../validators/clienteValidator.js';



const router = express.Router();

router.post('/cadastro/cliente',
    authMiddleware,
    createUsuarioValidator,
    validationMiddleware,
    cadastroClienteController
)

router.get('/clientes',
    authMiddleware,
    listarClientesController
)


export default router;