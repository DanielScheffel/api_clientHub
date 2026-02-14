import { atualizarStatusClienteService,
    buscarClienteIdService, 
    cadastrarClienteService, 
    deleteClienteService, 
    editarClienteService, 
    listarClienteService, 
    listarHistoricoClienteService} 
from "../service/userService.js";


export async function cadastroClienteController(req, res) {

    try {

        const usuarioId = req.user.id;

        const { nome, email, contato, empresa, tipo_cliente, cpf, cnpj, origem, cidade, estado, observacao } = req.body;

        // Lógica para cadastrar o cliente usando os dados fornecidos
        const cliente = await cadastrarClienteService({
            nome, email, contato, empresa, tipo_cliente, cpf, cnpj, origem, cidade, estado, status: "novo", observacao, usuarioId
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

export async function listarHistoricoClienteController(req, res) {
    try {
        const usuarioId = req.user.id;
        const { clienteId } = req.params;

        const historico =await listarHistoricoClienteService(clienteId, usuarioId);

        return res.status(200).json({
            clienteId,
            total: historico.length,
            historico
        })

    } catch (error) {
        console.error('Erro ao listar histórico do cliente:', error);
        if (error.message === 'Cliente não encontrado.') {
            return res.status(404).json({ mensagem: error.message });
        }
    }
}

export async function buscarClienteIdController(req, res) {

    try {

        const usuarioId = req.user.id;
        const { clienteId } = req.params;

        const cliente = await buscarClienteIdService({ clienteId, usuarioId: usuarioId });

        return res.status(200).json({
            message: 'Cliente encontrado com sucesso.',
            cliente
        });

    } catch (error) {
        
        if(error.message === 'Cliente não encontrado.') {
            return res.status(404).json({
                message: error.message
            });
        }


        return res.status(500).json({
            message: error.message
        })
    }

}

export async function editarClienteController(req, res) {

    try {

        const usuarioId = req.user.id;
        const { clienteId } = req.params;
        const dadosCliente = req.body;

        const clienteAtualizado = await editarClienteService({ clienteId, dadosCliente, usuarioId });

        return res.status(200).json({
            message: 'Cliente atualizado com sucesso.',
            clienteAtualizado
        })
    } catch (error) {
        
        if (error.message === "CLIENTE_NAO_ENCONTRADO") {
            return res.status(404).json({
                message: "Cliente não encontrado."
            });
        }

        if (error.message === "ALTERACAO_NAO_PERMITIDA") {
            return res.status(400).json({
                message: "Não é permitido alterar este campo."
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }

}

export async function atualizarStatusClienteController(req, res) {

    try {
        const usuarioId = req.user.id;
        const { clienteId } = req.params;
        const { novoStatus } = req.body;


        const result = await atualizarStatusClienteService({
            clienteId,
            novoStatus: novoStatus,
            usuarioId
        });

        return res.status(200).json({
            message: 'Status do cliente atualizado com sucesso.',
            result
        });

    } catch(error) {
        console.error('Erro ao atualizar status do cliente:', error);
        return res.status(400).json({
            message: error.message
        });
    }
}

export async function deletarClienteController(req, res) {

    try {

        const usuarioId = req.user.id;
        const { clienteId } = req.params;

        // Lógica para deletar o cliente usando o ID fornecido
        const result = await deleteClienteService({ clienteId, usuarioId });

        return res.status(200).json({
            message: 'Cliente deletado com sucesso.',
            result
        });

    } catch (error) {
        
        if(error.message.includes('não encontrado')) {
            return res.status(404).json({ mensagem: error.message });
        }

        return res.status(500).json({ mensagem: 'Erro ao deletar cliente.' });
    }

}