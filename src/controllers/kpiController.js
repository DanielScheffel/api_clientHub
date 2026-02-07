import { kpiClientePorStatusService, kpiClientePorUsuarioService, kpiConversaoGlobalService, kpiConversaoPorUsuarioService } from "../service/kpisService.js";


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

export async function kpiClientePorUsuarioController(req, res) {
    try {
        const usuarioLogado = req.user;

        const dados = await kpiClientePorUsuarioService(usuarioLogado);

        return res.status(200).json(dados);

    } catch (error) {
        console.error('Erro ao buscar KPI clientes por usuario: ', error);

        return res.status(400).json({
            message: error.message
        })
    }

}

export async function kpiConversaoController(req, res) {
    try {
        const { tipo } = req.query;

        let resultado;

        if (tipo === 'usuario') {
            resultado = await kpiConversaoPorUsuarioService();
        } else {
            // default: global
            resultado = await kpiConversaoGlobalService();
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error('Erro KPI conversão', error);
        return res.status(400).json({ message: error.message });
    }
}
