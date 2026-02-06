import { atualizarStatusUsuarioService, 
    atualizarUsuarioService, 
    cadastroUsuarioService, 
    loginUsuarioService } 
    from '../service/authService.js';

export async function loginUsuarioController(req, res) {
    try {
            
        const { email, senha } = req.body;

        const result = await loginUsuarioService(email, senha);

        return res.status(200).json(result);
    } catch (error) {
        // console.log(error)
        if(error.messge === 'Usuário inativo. Acesso bloqueado') {
            return res.status(403).json({
                message: error.message
            })
        }

        // console.log(error);

        return res.status(500).json({
            message: 'Erro interno no servidor'
        })
    }

}

export async function cadastroUsuarioController(req, res) {

    const { nome, email, senha, tipo_usuario } = req.body;

    const result = await cadastroUsuarioService( nome, email, senha, tipo_usuario );

    return res.status(201).json(result);

}

export async function atualizarUsuarioController(req, res) {

    try {
        const { usuarioId } = req.params;
        const dados = req.body;
        const usuarioLogado = req.user;


        const usuarioAtualizado = await atualizarUsuarioService({
            usuarioId,
            dados,
            usuarioLogado
        });

        return res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            usuario: usuarioAtualizado
        });


    } catch (error) {
        console.error('Erro ao atualizar usuário: ', error);

        return res.status(400).json({
            message: error.message
        })
    }

}

export async function atualizarStatusUsuarioController(req, res) {

    try {
        const { usuarioId } = req.params;
        const { status } = req.body;
        const usuarioLogado = req.user;

        const usuario = await atualizarStatusUsuarioService(
            usuarioId,
            status,
            usuarioLogado
        )

        return res.status(200).json({
            message: 'Status do usuário atualizado com sucesso',
            usuario
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}