import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { kpiClientePorStatusController } from '../controllers/kpiController.js';

const router = express.Router();

router.get('/kpis/clientes-por-status',
    authMiddleware,
    kpiClientePorStatusController
)

export default router;