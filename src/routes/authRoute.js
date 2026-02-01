import express from 'express';
import { loginUsuarioController } from '../controllers/authController.js';

const router = express.Router();


router.post('/login', loginUsuarioController);

export default router;