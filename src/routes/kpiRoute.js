import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { kpiClientePorStatusController, kpiClientePorUsuarioController, kpiConversaoController, kpiTempoMedioStatusController } from '../controllers/kpiController.js';

const router = express.Router();

router.get('/kpis/clientes-por-status',
    authMiddleware,
    kpiClientePorStatusController
)

router.get('/kpis/cliente-por-usuario',
    authMiddleware,
    kpiClientePorUsuarioController
)

router.get('/kpis/conversao',
    authMiddleware,
    kpiConversaoController
)

router.get(
    '/kpis/tempo-status',
    authMiddleware,
    kpiTempoMedioStatusController
);


export default router;