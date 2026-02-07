import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { kpiClientePorStatusController, 
    kpiClientePorUsuarioController, 
    kpiConversaoController, 
    kpiTempoMedioStatusController } from '../controllers/kpiController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/kpis/clientes-por-status',
    authMiddleware,
    adminMiddleware,
    kpiClientePorStatusController
)

router.get('/kpis/cliente-por-usuario',
    authMiddleware,
    adminMiddleware,
    kpiClientePorUsuarioController
)

// KPI 3 - Conversão (Global ou por usuário) ?tipo=global
router.get('/kpis/conversao',
    authMiddleware,
    adminMiddleware,
    kpiConversaoController
)

router.get(
    '/kpis/tempo-status',
    authMiddleware,
    adminMiddleware,
    kpiTempoMedioStatusController
);


export default router;