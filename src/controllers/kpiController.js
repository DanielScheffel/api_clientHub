import { kpiClientePorStatusService } from "../service/kpisService.js";


export async function kpiClientePorStatusController(req, res) {
    try {
        const usuarioLogado = req.user;

        const dados = await kpiClientePorStatusService(usuarioLogado);

        return res.status(200).json({
            message: 'KPIs: ', dados
        })
    } catch (error){
        console.error('Erro ao buscar KPI clientes por status', error)

        return res.status(500).json({
            message: 'Erro ao buscar KPI'
        })
    }

}