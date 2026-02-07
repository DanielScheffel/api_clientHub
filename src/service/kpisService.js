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

export async function kpiClientePorUsuarioService(usuarioLogado) {

    let filtroUsuario = '';
    let valores = [];

    if(usuarioLogado.tipo_usuario !== 'admin') {
        filtroUsuario = ' WHERE u.id_usuario = $1';
        valores.push(usuarioLogado.id)
    }

    const query = `
        SELECT 
            u.id_usuario,
            u.nome,
            COUNT(c.id_cliente) AS total_clientes
        FROM usuario u
        LEFT JOIN cliente c 
            ON c.usuario_id = u.id_usuario
        ${filtroUsuario}
        GROUP BY u.id_usuario, u.nome
        ORDER BY total_clientes DESC
    `;

    const result = await pool.query(query, valores);

    return result.rows;

}