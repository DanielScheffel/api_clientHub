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

    return result.rows.map(row => ({
        status: row.status,
        total: Number(row.total)
    }));

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

export async function kpiConversaoGlobalService(usuarioLogado) {
    let query = `
        SELECT 
            COUNT(*) FILTER (WHERE status = 'fechado') AS fechados,
            COUNT(*) AS total,
            ROUND(
                COUNT(*) FILTER (WHERE status = 'fechado') * 100.0 
                / NULLIF(COUNT(*), 0),
                2
            ) AS taxa_conversao
        FROM cliente
    `;

    const params = [];

    if (usuarioLogado.tipo_usuario !== 'admin') {
        query += ` WHERE usuario_id = $1`;
        params.push(usuarioLogado.id);
    }

    const result = await pool.query(query, params);

    return {
        fechados: Number(result.rows[0].fechados),
        total: Number(result.rows[0].total),
        taxa_conversao: Number(result.rows[0].taxa_conversao)
    };
}

export async function kpiConversaoPorUsuarioService(usuarioLogado) {
    let query = `
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
    `;

    const params = [];

    if (usuarioLogado.tipo_usuario !== 'admin') {
        query += ` WHERE u.id_usuario = $1`;
        params.push(usuarioLogado.id);
    }

    query += `
        GROUP BY u.id_usuario, u.nome
        ORDER BY taxa_conversao DESC
    `;

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
        id_usuario: row.id_usuario,
        nome: row.nome,
        fechados: Number(row.fechados),
        total: Number(row.total),
        taxa_conversao: Number(row.taxa_conversao)
    }));
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

export async function kpiPorOrigemService(usuarioLogado) {
    let query = `SELECT 
            origem,
            COUNT(*) AS total,
            ROUND(
                COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (),
                2
            ) AS percentual
        FROM cliente`;

    const params = [];

    if (usuarioLogado.tipo_usuario !== 'admin') {
        query += ` WHERE usuario_id = $1`;
        params.push(usuarioLogado.id);
    }

    query += ` GROUP BY origem
        ORDER BY total DESC`;

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
        origem: row.origem,
        total: Number(row.total),
        percentual: Number(row.pe)
    }))
}

export async function kpiFunilStatusService(usuarioLogado) {
    let query = `SELECT 
            status,
            COUNT(*) AS total,
            ROUND(
                COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (),
                2
            ) AS percentual
        FROM cliente`;

    const params = [];

    if(usuarioLogado.tipo_usuario !== 'admin') {
        query += ` WHERE usuario_id = $1`
        params.push(usuarioLogado.id)
    }

    query += ` GROUP BY status ORDER BY total DESC`

    const result = await pool.query(query, params);

    return result.rows.map(r => ({
        status: r.status,
        total: Number(r.total),
        percentual: Number(r.percentual)
    }))
}

export async function kpiClienteMesService() {
    const result = await pool.query(`SELECT COUNT(*) AS total
        FROM cliente
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`);

    return Number(result.rows[0].total);
}