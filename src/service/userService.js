import pool  from '../database/config.js';

export async function cadastrarClienteService(dadosCliente) {

    const { nome, email, contato, empresa, origem, status, observacao, usuarioId } = dadosCliente;

    const result = await pool.query(
        'INSERT INTO cliente (nome, email, contato, empresa, origem, status, observacao, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [nome, email, contato, empresa, origem, status, observacao, usuarioId]
    )

    return result.rows[0];

}

export async function listarClienteService(usuarioId) {

    const result = await pool.query(
        `SELECT * FROM cliente WHERE usuario_id = $1`,
        [usuarioId]
    );

    return result.rows;

}

export async function atualizarStatusClienteService({ clienteId, novoStatus, usuarioId }) {

    const statusAtualizado = ["novo", "contatado", "negociacao", "perdido", "fechado"];

    if(!statusAtualizado.includes(novoStatus)) {
        throw new Error('Status inválido.');
    }

    const result = await pool.query(
        "SELECT status FROM cliente WHERE id_cliente = $1 AND usuario_id = $2",
        [clienteId, usuarioId]        
    );

    if(result.rows.length === 0) {
        throw new Error('Cliente não encontrado.');
    }

    const statusAtual = result.rows[0].status;

    const statusOrdem = {
        novo: ["contatado"],
        contatado: ["negociacao", "perdido"],
        negociacao: ["fechado", "perdido"],
        perdido: [],
        fechado: []
    }

    if(!statusOrdem[statusAtual].includes(novoStatus)) {
        throw new Error(`Transição de status inválido de ${statusAtual} para ${novoStatus}.`);
    }

    await pool.query(
        "UPDATE cliente SET status = $1 WHERE id_cliente = $2",
        [novoStatus, clienteId]
    )

}