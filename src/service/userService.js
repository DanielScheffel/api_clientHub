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