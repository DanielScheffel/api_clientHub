import { kpiClienteMesService, kpiClientePorStatusService, 
    kpiClientePorUsuarioService, 
    kpiClientesUltimosDiasService, 
    kpiConversaoGlobalService, 
    kpiConversaoPorUsuarioService, 
    kpiFunilStatusService, 
    kpiPorOrigemService, 
    kpiPorTipoClienteService, 
    kpiTempoMedioStatusService, 
    kpiTotalClientesService} 
from "../service/kpisService.js";


export async function kpiTotalClientesController(req, res) {
    try {
        const resultado = await kpiTotalClientesService();

        return res.status(200).json({
            message: 'Total de Clientes:',
            resultado
        })
    } catch (error) {
        console.error('Erro na KPI total de clientes', error)

        return res.status(500).json({
            message: 'Erro ao buscar KPI total de clientes',
            error
        })
    }
}

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

        const usuarioLogado = {
            id: req.user.id,
            tipo_usuario: req.user.tipo_usuario
        };

        let resultado;

        if (tipo === 'usuario') {
            resultado = await kpiConversaoPorUsuarioService(usuarioLogado);
        } else {
            // default: conversão geral (mas respeitando regra admin/user)
            resultado = await kpiConversaoGlobalService(usuarioLogado);
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error('Erro KPI conversão', error);
        return res.status(500).json({
            message: 'Erro ao buscar KPI de conversão'
        });
    }
}

export async function kpiTempoMedioStatusController(req, res) {
    try {
        const dados = await kpiTempoMedioStatusService();

        return res.status(200).json(dados);

    } catch (error) {
        console.error('Erro KPI tempo médio por status', error);

        return res.status(500).json({
            message: 'Erro ao calcular KPI'
        });
    }
}

export async function kpiPorTipoClienteController(req, res) {
    try {
        const usuarioLogado = {
            id: req.user.id,
            tipo_usuario: req.user.tipo_usuario,
        }

        const kpi = await kpiPorTipoClienteService(usuarioLogado)

        // console.log("REQ.USER:", req.user);

        return res.status(200).json(kpi);

    } catch (err) {
        console.error("Erro completo: ", err);

        return res.status(500).json({
            message: "Erro ao buscar KPI por tipo."
        })
    }
}

export async function kpiPorOrigemController(req, res) {
    try {
        const usuarioLogado = {
            id: req.user.id,
            tipo_usuario: req.user.tipo_usuario
        }

        const result = await kpiPorOrigemService(usuarioLogado);

        return res.status(200).json(result)
    } catch (err) {
        console.error("ERRO KPI por origem: ", err)
        return res.status(500).json({
            message: "Erro ao buscar KPI por origem"
        })
    }
}

export async function kpiFunilStatusController(req, res) {
    try {
        const usuarioLogado = {
            id: Number(req.user.id),
            tipo_usuario: req.user.tipo_usuario
        }

        // console.log("User: ", req.user);
        // console.log("usuarioLogado: ", usuarioLogado);

        const resultado = await kpiFunilStatusService(usuarioLogado);

        return res.status(200).json(resultado)
    } catch (error) {
        console.error('Erro KPI funil', error)

        return res.status(500).json({
            message: 'Erro ao buscar KPI de funil'
        })
    }
}

export async function kpiClienteMesController(req, res) {
    try {
        const total = await kpiClienteMesService();

        return res.status(200).json({ total })
    } catch (error) {
        console.error('Erro KPI clientes mÊs (admin)', error);

        return res.status(500).json({
            message: 'Erro ao buscar KPI de clientes do mês'
        })
    }
}

export async function kpiClientesUltimosDiasController(req, res) {
    try {
        const { dias } = req.query;

        if(!dias || isNaN(dias)) {
            return res.status(400).json({
                message: 'Informe um número válido de dias'
            })
        }

        const total = await kpiClientesUltimosDiasService(Number(dias));

        return res.status(200).json({ total })
    } catch (error) {
        console.error('Erro KPI últimos dias', error)
        return res.status(500).json({
            message: 'Erro ao buscar KPI dos últimos dias'
        })
    }
}