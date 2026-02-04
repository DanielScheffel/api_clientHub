import { cadastroUsuarioService, loginUsuarioService } from '../service/authService.js';

export async function loginUsuarioController(req, res) {
    
    const { email, password } = req.body;

    try {

        if(!email || !password){
            return res.status(400).json({
                message: 'Email e senha são obrigatórios'
            });
        };
    
        const result = await loginUsuarioService(email, password);
        // console.log(result);
        return res.status(200).json(result);
    } catch (err) {
        if(err.message === "Usuário não existe") {
            return res.status(404).json({ message: err.message });
        }

        if(err.message === "USUARIO_INATIVO") {
            return res.status(403).json({ message: "Usuário inativo. Contate o gerente." });
        }

        if(err.message === "Senha inválida") {
            return res.status(401).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }


}

export async function cadastroUsuarioController(req, res) {

    const { nome, email, password, tipo_usuario } = req.body;

    try {

        if(!nome || !email || !password || !tipo_usuario){
            return res.status(400).json({
                message: 'Nome, email, senha, e tipo de usuário são obrigatórios'
            });
    }

    const result = await cadastroUsuarioService(nome, email, password, tipo_usuario)

    return res.status(201).json(result)

    } catch (err) {
        if(err.message === 'Usuário já existe' || err.message.includes('Inválido')) {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }

}