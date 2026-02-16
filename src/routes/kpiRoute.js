import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { kpiClienteMesController, kpiClientePorStatusController, 
    kpiClientePorUsuarioController, 
    kpiClientesUltimosDiasController, 
    kpiConversaoController, 
    kpiFunilStatusController, 
    kpiPorOrigemController, 
    kpiPorTipoClienteController, 
    kpiTempoMedioStatusController, 
    kpiTotalClientesController} from '../controllers/kpiController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/kpis/total',
    authMiddleware,
    adminMiddleware,
    kpiTotalClientesController
)

router.get('/kpis/clientes-por-status',
    authMiddleware,
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

router.get('/kpis/origem',
    authMiddleware,
    adminMiddleware,
    kpiPorOrigemController
)

router.get('/kpis/funil',
    authMiddleware,
    adminMiddleware,
    kpiFunilStatusController
)

router.get('/kpis/clientes/mes',
    authMiddleware,
    adminMiddleware,
    kpiClienteMesController
)

router.post('/kpis/clientes/ultimos-dias',
    authMiddleware,
    adminMiddleware,
    kpiClientesUltimosDiasController
)


export default router;