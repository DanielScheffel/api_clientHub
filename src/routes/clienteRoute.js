import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { atualizarStatusClienteController, 
    buscarClienteIdController, 
    cadastroClienteController, 
    deletarClienteController, 
    editarClienteController, 
    listarClientesController, 
    listarHistoricoClienteController} 
from '../controllers/userController.js';
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

router.get('/cliente/:clienteId',
    authMiddleware,
    buscarClienteIdController
)

router.get('/cliente/:clienteId/historico',
    authMiddleware,
    listarHistoricoClienteController
)

router.put('/cliente/:clienteId',
    authMiddleware,
    editarClienteController
)

router.patch('/cliente/:clienteId/status',
    authMiddleware,
    atualizarStatusClienteController
)

router.delete('/cliente/:clienteId',
    authMiddleware,
    deletarClienteController
)

export default router;