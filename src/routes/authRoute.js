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


/**
 * @swagger
 * /usuario/{usuarioId}/atualizar:
 *   put:
 *     summary: Atualizar dados do usuário
 *     description: Atualiza informações básicas do usuário. O próprio usuário pode atualizar seus dados. Admin pode atualizar qualquer usuário.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Daniel Scheffel
 *               email:
 *                 type: string
 *                 example: daniel@email.com
 *               senha:
 *                  type: string
 *                  example: 87654321
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/usuario/:usuarioId/atualizar',
    authMiddleware,
    atualizarUsuarioController
)

/**
 * @swagger
 * /usuario/{usuarioId}/status:
 *   put:
 *     summary: Atualizar status do usuário
 *     description: Ativa ou desativa um usuário. Apenas administradores.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ativo
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Status do usuário atualizado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas administradores
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/usuario/:usuarioId/status',
    authMiddleware,
    atualizarStatusUsuarioController
)

/**
 * @swagger
 * /usuarios/{usuarioId}/reatribuir-clientes:
 *   patch:
 *     summary: Reatribuir clientes de um usuário
 *     description: Reatribui todos os clientes de um usuário para outro. Apenas administradores.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário origem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novoUsuarioId
 *             properties:
 *               novoUsuarioId:
 *                 type: string
 *                 example: "b7c1e5f2-1234-4a9d-9a88-999999999999"
 *     responses:
 *       200:
 *         description: Clientes reatribuídos com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Apenas administradores
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/usuarios/:usuarioId/reatribuir-clientes',
    authMiddleware,
    reatribuirClientesController
)

export default router;