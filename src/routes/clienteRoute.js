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

/**
 * @swagger
 * tags:
 *  name: Clientes
 *  description: Funcionamento dos usuários ao clientes
 */

/**
 * @swagger
 * /cadastro/cliente:
 *   post:
 *     summary: Cadastrar novo cliente
 *     description: Cria um novo cliente vinculado ao usuário autenticado.
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - contato
 *               - empresa
 *               - tipo_cliente
 *               - cpf
 *               - cnpj
 *               - origem
 *               - status
 *               - cidade
 *               - estado
 *               - observacao
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               contato:
 *                 type: string
 *                 example: "11999999999"
 *               empresa:
 *                 type: string
 *                 example: Empresa XPTO
 *               tipo_cliente:
 *                 type: string
 *                 example: PF
 *                 description: PF, PJ ou MEI
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *               cnpj:
 *                 type: string
 *                 example: "12345678000199"
 *               origem:
 *                 type: string
 *                 example: site
 *               status:
 *                 type: string
 *                 example: novo
 *                 description: novo, contatado, negociacao, fechado ou perdido
 *               cidade:
 *                 type: string
 *                 example: São Paulo
 *               estado:
 *                 type: string
 *                 example: SP
 *               observacao:
 *                 type: string
 *                 example: Cliente interessado em plano anual
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 */
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