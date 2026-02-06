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
    if(user.status !== 'ativo') {
        throw new Error('Usuário inativo. Acesso bloqueado.')
    }

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

export async function cadastroUsuarioService( nome, email, senha, tipo_usuario ) {

    // Verificando se o email já está cadastrado
    const result = await pool.query('SELECT id_usuario FROM usuario WHERE email = $1', [email]);
    const rows = result.rows;

    if(rows.length > 0) {
        throw new Error('Email já cadastrado');
    };

    // Validando o tipo de usuário
    if(!['admin', 'usuario'].includes(tipo_usuario)) {
        throw new Error('Tipo de usuário inválido');
    }

    const hashPass = await bcrypt.hash(senha, 10);

    // Inserindo o novo usuário no banco de dados
    await pool.query(
        'INSERT INTO usuario (nome, email, senha, tipo_usuario, status) VALUES ($1, $2, $3, $4, $5)',
        [nome, email, hashPass, tipo_usuario, 'ativo']
    )

    return {
        message: 'Usuário cadastrado com sucesso!'
    };

}

export async function atualizarUsuarioService({ usuarioId, dados, usuarioLogado }) {
    const { nome, email, tipo_usuario } = dados;


    const result = await pool.query(
        `SELECT id_usuario, tipo_usuario FROM usuario WHERE id_usuario = $1`,
        [usuarioId]
    );

    if(result.rows.length === 0) {
        throw new Error('Usuário não encontrado')
    }

    const usuarioAlvo = result.rows[0];


    if(
        usuarioLogado.tipo_usuario !== 'admin' &&
        usuarioLogado.id !== usuarioAlvo.id_usuario
    ) {
        throw new Error('Sem permissão para editar este usuário');
    }

    if(usuarioLogado.tipo_usuario !== 'admin' && tipo_usuario) {
        throw new Error('Usuário comum não pode alterar tipo de usuário')
    };

    const atualizado = await pool.query(
        `UPDATE usuario SET nome = COALESCE($1, nome), email = COALESCE($2, email),
        tipo_usuario = COALESCE($3, tipo_usuario)
        WHERE id_usuario = $4
        RETURNING id_usuario, nome, email, tipo_usuario, status`,
        [nome, email, tipo_usuario, usuarioId]
    )

    return atualizado.rows[0];
}

export async function atualizarStatusUsuarioService(usuarioId, status, usuarioLogado) {

    if(usuarioLogado.tipo_usuario !== 'admin'){
        throw new Error('Apenas administradores podem alterar status de usuário')
    }

    if(!['ativo', 'inativo'].includes(status)){
        throw new Error('Status inválido');
    }

    const result = await pool.query(
        `UPDATE usuario
        SET status = $1
        WHERE id_usuario = $2
        RETURNING id_usuario, nome, email, tipo_usuario, status`,
        [status, usuarioId]
    )

    if(result.rows.length === 0) {
        throw new Error('Usuário não encontrado')
    }

    return result.rows[0];

}