// Inicialização do Supabase
const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para carregar e exibir a lista de ovos
async function carregarOvos() {
    try {
        const { data, error } = await supabaseClient
            .from('ovos') // Nome da tabela no Supabase
            .select('*'); // Seleciona todos os campos

        if (error) throw error;

        const lista = document.getElementById('ovos-list');
        lista.innerHTML = ''; // Limpa a tabela antes de recarregar os dados

        data.forEach((item) => {
            const tr = document.createElement('tr');

            // Coluna: Cor da Casca
            const tdCor = document.createElement('td');
            tdCor.textContent = item.corDaCasca;
            tr.appendChild(tdCor);

            // Coluna: Tamanho
            const tdTamanho = document.createElement('td');
            tdTamanho.textContent = item.tamanho;
            tr.appendChild(tdTamanho);

            // Coluna: Ações
            const tdAcoes = document.createElement('td');
            
            // Botão de editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                const novaCor = prompt('Digite a nova cor da casca:', item.corDaCasca);
                const novoTamanho = prompt('Digite o novo tamanho:', item.tamanho);

                if (novaCor && novoTamanho) {
                    alterarOvo(item.id, novaCor, novoTamanho);
                }
            };

            // Botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => excluirOvo(item.id);

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
async function alterarOvo(id, novaCor, novoTamanho) {
    try {
        const { error } = await supabaseClient
            .from('ovos')
            .update({ corDaCasca: novaCor, tamanho: novoTamanho })
            .eq('id', id);

        if (error) throw error;

        alert('Alteração salva com sucesso!');
        carregarOvos(); // Atualiza a lista após a alteração
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Erro ao salvar alterações: ' + error.message);
    }
}

// Função para excluir um registro
async function excluirOvo(id) {
    try {
        const { error } = await supabaseClient
            .from('ovos')
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
document.addEventListener('DOMContentLoaded', carregarOvos);
