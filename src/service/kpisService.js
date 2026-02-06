import pool from '../database/config.js';


export async function kpiClientePorStatusService(usuarioLogado) {
    let query = `
        SELECT status, COUNT(*) AS total
        FROM cliente
    `;

    const params = [];

    // Se não for admin, filtra pelos clientes do usuário
    if(usuarioLogado.tipo_usuario !== 'admin') {
        query += ` WHERE usuario_id = $1`;
        params.push(usuarioLogado.id)
    }

    query += ` GROUP BY status`;

    const result = await pool.query(query, params);

    return result.rows;

}