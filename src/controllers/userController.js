import { atualizarStatusClienteService, cadastrarClienteService, listarClienteService } from "../service/userService.js";


export async function cadastroClienteController(req, res) {

    try {

        const usuarioId = req.user.id;

        const { nome, email, contato, empresa, origem, observacao } = req.body;

        // Lógica para cadastrar o cliente usando os dados fornecidos
        const cliente = await cadastrarClienteService({
            nome, email, contato, empresa, origem, status: "Novo", observacao, usuarioId
        });


        return res.status(201).json({
            message: 'Cliente cadastrado com sucesso!',
            cliente
        })


    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.' });
    };

}

export async function listarClientesController(req, res) {

    try {

        const usuarioId = req.user.id;

        const clientes = await listarClienteService(usuarioId);

        return res.status(200).json(clientes);

    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        return res.status(500).json({ mensagem: 'Erro ao listar clientes.' });
    }

}

export async function atualizarStatusClienteController(req, res) {

    try {
        const usuarioId = req.user.id;
        const { clienteId } = req.params;
        const { novoStatus } = req.body;


        const result = await atualizarStatusClienteService({
            clienteId,
            novoStatus,
            usuarioId
        });

        return res.status(200).json({
            message: 'Status do cliente atualizado com sucesso.',
            result
        });

    } catch(error) {
        console.error('Erro ao atualizar status do cliente:', error);
        return res.status(500).json({
            message: error.message
        });
    }
}