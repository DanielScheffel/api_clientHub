import { cadastrarClienteService, listarClienteService } from "../service/userService.js";


export async function cadastroClienteController(req, res) {

    try {

        const usuarioId = req.user.id;

        const { nome, email, contato, empresa, origem, observacao } = req.body;

        if(!nome) {
            return res.status(400).json({ mensagem: "O campo 'nome' é obrigatório." });
        }

        // Lógica para cadastrar o cliente usando os dados fornecidos
        const cliente = await cadastrarClienteService({
            nome, email, contato, empresa, origem, status: "ativo", observacao, usuarioId
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