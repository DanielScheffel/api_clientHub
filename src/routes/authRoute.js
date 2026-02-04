import express from 'express';
import { cadastroUsuarioController, loginUsuarioController } from '../controllers/authController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/login', loginUsuarioController);

router.post('/cadastro',
    authMiddleware,
    adminMiddleware,
    cadastroUsuarioController
);

export default router;