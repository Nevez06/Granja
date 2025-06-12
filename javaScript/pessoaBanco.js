// Inicialização do Supabase
const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para carregar e exibir a lista de ovos
async function carregarPessoa() {
    try {
        const { data, error } = await supabaseClient
            .from('produtores') // Nome da tabela no Supabase
            .select('*'); // Seleciona todos os campos

        if (error) throw error;

        const lista = document.getElementById('produtor-list');
        lista.innerHTML = ''; // Limpa a tabela antes de recarregar os dados

        data.forEach((item) => {
            const tr = document.createElement('tr');

            // Coluna: Cor da Casca
            const tdTipo = document.createElement('td');
            tdTipo.textContent = item.tipo;
            tr.appendChild(tdTipo);

            // Coluna: Tamanho
            const tdcpf = document.createElement('td');
            tdcpf.textContent = item.cpf;
            tr.appendChild(tdcpf);

            // Coluna: Ações
            const tdAcoes = document.createElement('td');
            
            // Botão de editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                const novoTipo = prompt('Digite o novo tipo de pessoa:', item.tipo);
                const novocpf = prompt('Digite o novo CPF:', item.cpf);

                if (novoTipo && novocpf) {
                    alterarPessoa(item.id, novoTipo, novocpf);
                }
            };

            // Botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => excluirPessoa(item.id);

            tdAcoes.appendChild(editButton);
            tdAcoes.appendChild(deleteButton);
            tr.appendChild(tdAcoes);

            lista.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        alert('Erro ao carregar os dados: ' + error.message);
    }
}

// Função para alterar dados
async function alterarPessoa(id, novoTipo, novocpf) {
    try {
        const { error } = await supabaseClient
            .from('produtores')
            .update({ tipo: novoTipo, cpf: novocpf })
            .eq('id', id);

        if (error) throw error;

        alert('Alteração salva com sucesso!');
        carregarPessoa(); // Atualiza a lista após a alteração
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Erro ao salvar alterações: ' + error.message);
    }
}

// Função para excluir um registro
async function excluirPessoa(id) {
    try {
        const { error } = await supabaseClient
            .from('produtores')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Item excluído com sucesso!');
        carregarPessoa(); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir o item:', error);
        alert('Erro ao excluir item: ' + error.message);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPessoa);

 