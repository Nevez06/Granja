function initializeSupabase() {
    if (typeof supabase === 'undefined' || !supabase.createClient) {
        console.log('Aguardando carregamento do Supabase...');
        setTimeout(initializeSupabase, 50);
        return;
    }

    const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
    const supabaseKey = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDM1NzEzMSwiZXhwIjoyMDM5OTMzMTMxfQ'; // Insira sua chave Supabase aqui
    const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function cadastrarUsuario() {
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const telefone = document.getElementById('telefone').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
    
        // Validação simples dos campos
        if (!nome || !cpf || !telefone || !dataNascimento || !email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        const usuario = { nome, cpf, telefone, data_nascimento: dataNascimento, email, senha };
    
        try {
            const { data, error } = await supabaseClient
                .from('usuarios') // Substitua pelo nome correto da sua tabela
                .insert([usuario]);
    
            if (error) throw error;
    
            alert('Usuário cadastrado com sucesso!');
            fetchData(); // Chama a função para buscar os dados após o cadastro
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar: ' + error.message);
        }
    }
    
    // Função para buscar dados
    async function fetchData() {
        try {
            const { data, error } = await supabaseClient
                .from('usuarios') // Substitua pelo nome correto da sua tabela
                .select('*');
    
            if (error) throw error;
    
            const dataList = document.getElementById('dataList');
            dataList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = JSON.stringify(item);
                dataList.appendChild(listItem);
            });
    
            // Chama a função para exibir o modal (se necessário)
            showModal();
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            alert('Erro ao carregar os dados');
        }
    }
    
    // Aguarda o carregamento do DOM e inicializa o Supabase
    document.addEventListener('DOMContentLoaded', () => {
        // Adiciona o evento de clique ao botão "Cadastrar"
        document.getElementById('cadastrar').addEventListener('click', cadastrarUsuario);
    
        // Adiciona o evento de clique ao botão de buscar dados
        document.getElementById('fetchDataButton').addEventListener('click', fetchData);
    
        // Atualiza o texto do modal
        const text = document.querySelector('#txtConfirm');
        text.innerText = 'Bora Sair? :)';
    
    })
};
