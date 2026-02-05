import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { atualizarStatusClienteController, cadastroClienteController, listarClientesController } from '../controllers/userController.js';
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

router.patch('/cliente/:clienteId/status',
    authMiddleware,
    atualizarStatusClienteController
)

export default router;