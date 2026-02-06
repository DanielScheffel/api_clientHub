import express from 'express';
import { atualizarStatusUsuarioController,
    atualizarUsuarioController, 
    cadastroUsuarioController, 
    loginUsuarioController } 
from '../controllers/authController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { cadastroUsuario, loginUsuario } from '../validators/authValidator.js';
import { validationMiddleware } from '../middlewares/validatorMiddleware.js';

const router = express.Router();


router.post('/login', 
    loginUsuario, 
    validationMiddleware, 
    loginUsuarioController
);

router.post('/cadastro',
    authMiddleware,
    adminMiddleware,
    cadastroUsuario,
    validationMiddleware,
    cadastroUsuarioController
);

router.put('/usuario/:usuarioId/atualizar',
    authMiddleware,
    atualizarUsuarioController
)

router.put('/usuario/:usuarioId/status',
    authMiddleware,
    atualizarStatusUsuarioController
)

export default router;