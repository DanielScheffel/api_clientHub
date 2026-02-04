import pool from "../database/config.js";


export async function adminMiddleware(req, res, next) {

    try {

        const user = req.user;

        const result = await pool.query(
            'SELECT tipo_usuario FROM usuario WHERE id_usuario = $1',
            [user.id]
        )
        const rows = result.rows;

        if(rows.length === 0 || rows[0].tipo_usuario !== 'admin') {
            return res.status(403).json({
                message: 'Acesso negado. Recurso restrito a administradores.'
            });
        }

        return next();

    } catch (err) {
        return res.status(500).json({
            message: 'Erro no servidor'
        });
    }

}