import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { cadastroClienteController, listarClientesController } from '../controllers/userController.js';



const router = express.Router();

router.post('/cadastro/cliente',
    authMiddleware,
    cadastroClienteController
)

router.get('/clientes',
    authMiddleware,
    listarClientesController
)


export default router;