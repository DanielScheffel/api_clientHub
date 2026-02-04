import { cadastroUsuarioService, loginUsuarioService } from '../service/authService.js';

export async function loginUsuarioController(req, res) {
    
    const { email, senha } = req.body;

    const result = await loginUsuarioService(email, senha);

    return res.status(200).json(result);

}

export async function cadastroUsuarioController(req, res) {

    const { nome, email, senha, tipo_usuario } = req.body;

    const result = await cadastroUsuarioService( nome, email, senha, tipo_usuario );

    return res.status(201).json(result);

}