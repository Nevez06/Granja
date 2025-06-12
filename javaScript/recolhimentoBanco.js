// Inicialização do Supabase
const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para carregar e exibir a lista de ovos
async function carregarRecolhimento() {
    try {
        const { data, error } = await supabaseClient
            .from('recolhimentos') // Nome da tabela no Supabase
            .select('*'); // Seleciona todos os campos

        if (error) throw error;

        const lista = document.getElementById('recolhimento-list');
        lista.innerHTML = ''; // Limpa a tabela antes de recarregar os dados

        data.forEach((item) => {
            const tr = document.createElement('tr');

            // Coluna: Cor da Casca
            const tdhora = document.createElement('td');
            tdhora.textContent = item.hora;
            tr.appendChild(tdhora);

            const tdquantidade = document.createElement('td');
            tdquantidade.textContent = item.quantidade;
            tr.appendChild(tdquantidade);

            // Coluna: Tamanho
            const tddataRecolhimento = document.createElement('td');
            tddataRecolhimento.textContent = item.dataRecolhimento;
            tr.appendChild(tddataRecolhimento);

            // Coluna: Ações
            const tdAcoes = document.createElement('td');
            
            // Botão de editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                const novohora = prompt('Digite a nova hora:', item.hora);
                const novoquantidade = prompt('Digite a nova quantidade:', item.quantidade);
                const novodataRecolhimento = prompt('Digite a nova data de Recolhimento:', item.dataRecolhimento);

                if (novohora && novoquantidade && novodataRecolhimento) {
                    alterarRecolhimento(item.id, novohora, novoquantidade, novodataRecolhimento);
                }
            };

            // Botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => excluirRecolhimento(item.id);

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
async function alterarRecolhimento(id, novohora, novoquantidade, novodataRecolhimento) {
    try {
        const { error } = await supabaseClient
            .from('recolhimentos')
            .update({ hora: novohora, quantidade: novoquantidade, dataRecolhimento: novodataRecolhimento })
            .eq('id', id);

        if (error) throw error;

        alert('Alteração salva com sucesso!');
        carregarRecolhimento(); // Atualiza a lista após a alteração
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Erro ao salvar alterações: ' + error.message);
    }
}

// Função para excluir um registro
async function excluirProducao(id) {
    try {
        const { error } = await supabaseClient
            .from('recolhimentos')
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
document.addEventListener('DOMContentLoaded', carregarRecolhimento);

 
                       