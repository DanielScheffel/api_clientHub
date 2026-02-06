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

export async function listarHistoricoClienteService(clienteId, usuarioId) {

    const result = await pool.query(
        `SELECT id_cliente FROM cliente 
            WHERE id_cliente = $1 
            AND usuario_id = $2 
            AND deletado = false`,
        [clienteId, usuarioId]
    )

    if(result.rows.length === 0) {
        throw new Error('Cliente não encontrado.')
    }

    const historico = await pool.query(
        `SELECT 
            status_anterior,
            status_novo,
            data_mudanca
         FROM cliente_status_historico
         WHERE cliente_id = $1
         AND usuario_id = $2
         ORDER BY data_mudanca ASC`,
        [clienteId, usuarioId]
    );

    return historico.rows;

}

export async function buscarClienteIdService({ clienteId, usuarioId }) {

    const result = await pool.query(
        `SELECT * FROM cliente WHERE id_cliente = $1 AND usuario_id = $2`,
        [clienteId, usuarioId]
    )

    if(result.rows.length === 0) {
        throw new Error('Cliente não encontrado.');
    }

    return result.rows[0];

}

export async function editarClienteService({ clienteId, dadosCliente, usuarioId }) {

    const clienteAtual = await pool.query(
        `SELECT nome, email, contato, empresa, observacao FROM cliente WHERE id_cliente = $1 AND usuario_id = $2`,
        [clienteId, usuarioId]
    )

    if (clienteAtual.rows.length === 0) {
        throw new Error('Cliente não encontrado ou sem permissão para editar.');
    }

    const cliente = clienteAtual.rows[0];

    const nome = dadosCliente.nome ?? cliente.nome;
    const email = dadosCliente.email ?? cliente.email;
    const contato = dadosCliente.contato ?? cliente.contato;
    const empresa = dadosCliente.empresa ?? cliente.empresa;
    const observacao = dadosCliente.observacao ?? cliente.observacao;

    const result = await pool.query(
        `UPDATE cliente SET nome = $1, email = $2, contato = $3, empresa = $4, observacao = $5 WHERE id_cliente = $6 AND usuario_id = $7 RETURNING *`,
        [nome, email, contato, empresa, observacao, clienteId, usuarioId]
    )

    return result.rows[0];

}

export async function atualizarStatusClienteService({
  clienteId,
  novoStatus,
  usuarioId,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const statusAtualizado = [
      "novo",
      "contatado",
      "negociacao",
      "perdido",
      "fechado",
    ];

    if (!statusAtualizado.includes(novoStatus)) {
      throw new Error("Status inválido.");
    }

    const result = await client.query(
      "SELECT status FROM cliente WHERE id_cliente = $1 AND usuario_id = $2 AND deletado = false",
      [clienteId, usuarioId],
    );

    if (result.rows.length === 0) {
      throw new Error("Cliente não encontrado.");
    }

    const statusAtual = result.rows[0].status;

    if (statusAtual === novoStatus) {
      throw new Error("O novo status deve ser diferente do status atual.");
    }

    const statusOrdem = {
      novo: ["contatado"],
      contatado: ["negociacao", "perdido"],
      negociacao: ["fechado", "perdido"],
      perdido: [],
      fechado: [],
    };

    if (!statusOrdem[statusAtual].includes(novoStatus)) {
      throw new Error(
        `Transição de status inválido de ${statusAtual} para ${novoStatus}.`,
      );
    }

    await client.query(
      "UPDATE cliente SET status = $1, updated_at = NOW() WHERE id_cliente = $2 AND usuario_id = $3",
      [novoStatus, clienteId, usuarioId],
    );

    await client.query(
      "INSERT INTO cliente_status_historico (cliente_id, usuario_id, status_anterior, status_novo, data_mudanca) VALUES ($1, $2, $3, $4, NOW())",
      [clienteId, usuarioId, statusAtual, novoStatus],
    );

    await client.query("COMMIT");

    return {
      clienteId,
      statusAnterior: statusAtual,
      statusNovo: novoStatus,
      dataMudanca: new Date(),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteClienteService({ clienteId, usuarioId }) {

    const result = await pool.query(
        "UPDATE cliente SET deletado = true WHERE id_cliente = $1 AND usuario_id = $2 AND deletado = false RETURNING *",
        [clienteId, usuarioId]
    )

    if(result.rows.length === 0) {
        throw new Error('Cliente não encontrado ou já deletado.');
    }

    return result.rows[0];
}