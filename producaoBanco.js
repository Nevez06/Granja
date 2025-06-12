// Inicialização do Supabase
const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para carregar e exibir a lista de ovos
async function carregarProducao() {
    try {
        const { data, error } = await supabaseClient
            .from('producoes') // Nome da tabela no Supabase
            .select('*'); // Seleciona todos os campos

        if (error) throw error;

        const lista = document.getElementById('producao-list');
        lista.innerHTML = ''; // Limpa a tabela antes de recarregar os dados

        data.forEach((item) => {
            const tr = document.createElement('tr');

            // Coluna: Cor da Casca
            const tdraca = document.createElement('td');
            tdraca.textContent = item.raca;
            tr.appendChild(tdraca);

            const tdidade_galinha = document.createElement('td');
            tdidade_galinha.textContent = item.idade_galinha;
            tr.appendChild(tdidade_galinha);

            // Coluna: Tamanho
            const tdproducao = document.createElement('td');
            tdproducao.textContent = item.producao;
            tr.appendChild(tdproducao);

            // Coluna: Ações
            const tdAcoes = document.createElement('td');
            
            // Botão de editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                const novoraca = prompt('Digite a nova raça:', item.raca);
                const novoproducao = prompt('Digite a nova produção:', item.producao);
                const novoidade_galinha = prompt('Digite a nova idade da galinha:', item.idade_galinha);

                if (novoraca && novoproducao && novoidade_galinha) {
                    alterarProducao(item.id, novoraca, novoproducao, novoidade_galinha);
                }
            };

            // Botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => excluirProducao(item.id);

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
async function alterarProducao(id, novoraca, novoproducao, novoidade_galinha) {
    try {
        const { error } = await supabaseClient
            .from('producoes')
            .update({ raca: novoraca, producao: novoproducao, idade_galinha: novoidade_galinha })
            .eq('id', id);

        if (error) throw error;

        alert('Alteração salva com sucesso!');
        carregarProducao(); // Atualiza a lista após a alteração
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Erro ao salvar alterações: ' + error.message);
    }
}

// Função para excluir um registro
async function excluirProducao(id) {
    try {
        const { error } = await supabaseClient
            .from('producoes')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Item excluído com sucesso!');
        carregarOvos(); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir o item:', error);
        alert('Erro ao excluir item: ' + error.message);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarProducao);

 