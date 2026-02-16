import express from 'express';
import { atualizarStatusUsuarioController,
    atualizarUsuarioController, 
    cadastroUsuarioController, 
    loginUsuarioController, 
    reatribuirClientesController} 
from '../controllers/authController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { cadastroUsuario, loginUsuario } from '../validators/authValidator.js';
import { validationMiddleware } from '../middlewares/validatorMiddleware.js';

const router = express.Router();


// router.get("/me", authMiddleware, (req, res) => {
//     return res.json({
//         message: "Acesso autorizado",
//         user: req.user
//     });
// });

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Autenticação e autorização de usuários e criação de usuário
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login do usuário
 *     description: Autentica o usuário e retorna um token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: daniel@gmail.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', 
    loginUsuario, 
    validationMiddleware, 
    loginUsuarioController
);

/**
 * @swagger
 * /cadastro:
 *  post:
 *      summary: Cadastro de Usuário
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - nome
 *                          - email
 *                          - senha
 *                          - tipo_usuario
 *                      properties:
 *                          nome:
 *                              type: string
 *                              example: Douglas Silva
 *                          email:
 *                              type: string
 *                              example: douglas@gmail.com
 *                          senha:
 *                              type: string
 *                              example: "12345678"
 *                          tipo_usuario:
 *                              type: string
 *                              example: "usuario"
 *                      responses:
 *                          201:
 *                              description: Usuário cadastrado com sucesso!
 */
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

router.patch('/usuarios/:usuarioId/reatribuir-clientes',
    authMiddleware,
    reatribuirClientesController
)

export default router;