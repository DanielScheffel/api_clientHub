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
            AND c.deletado = false
        WHERE u.status = 'ativo'
        GROUP BY u.id_usuario, u.nome
        ORDER BY total_clientes DESC
    `;

    const result = await pool.query(query, valores);

    return result.rows;

}

export async function kpiConversaoGlobalService() {
    const result = await pool.query(`
        SELECT 
            COUNT(*) FILTER (WHERE status = 'fechado') AS fechados,
            COUNT(*) AS total,
            ROUND(
                COUNT(*) FILTER (WHERE status = 'fechado') * 100.0 
                / NULLIF(COUNT(*), 0),
                2
            ) AS taxa_conversao
        FROM cliente
    `);

    return result.rows[0];
}

export async function kpiConversaoPorUsuarioService() {
    const result = await pool.query(`
        SELECT 
            u.id_usuario,
            u.nome,
            COUNT(*) FILTER (WHERE c.status = 'fechado') AS fechados,
            COUNT(c.id_cliente) AS total,
            ROUND(
                COUNT(*) FILTER (WHERE c.status = 'fechado') * 100.0 
                / NULLIF(COUNT(c.id_cliente), 0),
                2
            ) AS taxa_conversao
        FROM usuario u
        LEFT JOIN cliente c 
            ON c.usuario_id = u.id_usuario
        GROUP BY u.id_usuario, u.nome
        ORDER BY taxa_conversao DESC
    `);

    return result.rows;
}

export async function kpiTempoMedioStatusService() {
    const result = await pool.query(`
        WITH tempos AS (
            SELECT
                status_novo AS status,
                EXTRACT(EPOCH FROM (
                    LEAD(data_mudanca) OVER (
                        PARTITION BY cliente_id
                        ORDER BY data_mudanca
                    ) - data_mudanca
                )) / 3600 AS tempo_horas
            FROM cliente_status_historico
        )
        SELECT
            status,
            ROUND(AVG(tempo_horas)::numeric, 2) AS tempo_medio_horas
        FROM tempos
        WHERE tempo_horas IS NOT NULL
        GROUP BY status
        ORDER BY status;
    `);

    return result.rows;
}

export async function kpiPorTipoClienteService(usuarioLogado) {
    let query = `
        SELECT tipo_cliente, COUNT(*) AS quantidade
        FROM cliente
    `;

    const params = [];

    // Se não for admin, filtra pelos clientes do usuário
    if(usuarioLogado.tipo_usuario !== 'admin') {
        params.push(usuarioLogado.id);
        query += ` WHERE usuario_id = $1`;
    }
    // console.log(usuarioLogado);

    query += ` GROUP BY tipo_cliente ORDER BY tipo_cliente`;

    const result = await pool.query(query, params);

    return result.rows.map(item => ({
        tipo_cliente: item.tipo_cliente,
        quantidade: Number(item.quantidade),
    }))
}