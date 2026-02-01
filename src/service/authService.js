import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../database/config.js';

export async function loginUsuarioService(email, password) {

    //Buscando usuário no banco de dados
    const result = await pool.query('SELECT id_usuario, nome, email, senha, status, tipo_usuario FROM usuario WHERE email = $1', [email]);
    const rows = result.rows;
    
    if(rows.length === 0) {
        throw new Error('Usuário não encontrado');
    };
    const user = rows[0];

    // Verificando se o usuário está ativo
    if(user.status !== "ativo") {
        throw new Error('Usuário inativo');
    };

    // Verificando a senha
    const passValid = await bcrypt.compare(password, user.senha);
    if(!passValid){
        throw new Error('Senha inválida');
    };

    // Gerando o token JWT
    const token = jwt.sign(
        {
            id: user.id_usuario,
            nome: user.nome,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        message: "Login realizado com sucesso!",
        token: token
    };
};