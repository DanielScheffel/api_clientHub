import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { kpiClientePorStatusController, 
    kpiClientePorUsuarioController, 
    kpiConversaoController, 
    kpiPorTipoClienteController, 
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
    kpiConversaoController
)

router.get(
    '/kpis/tempo-status',
    authMiddleware,
    adminMiddleware,
    kpiTempoMedioStatusController
);

router.get('/kpis/tipo-cliente',
    authMiddleware,
    kpiPorTipoClienteController
)


export default router;