// Carregando a biblioteca Supabase e inicializando o cliente corretamente
const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para realizar login
async function login() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        // Busca o usuário pelo email
        const { data, error } = await supabase
            .from('usuarios') // Nome da tabela
            .select('*') // Seleciona todos os campos
            .eq('email', email) // Filtra pelo email
            .single(); // Espera apenas um registro

        if (error || !data) {
            alert('Usuário não encontrado.');
            return;
        }

        if (data.senha !== senha) {
            alert('Senha incorreta.');
            return;
        }

        alert('Login bem-sucedido!');
        window.location.href = 'menu.html';
    } catch (err) {
        console.error('Erro ao tentar fazer login:', err);
        alert('Ocorreu um erro inesperado.');
    }
}

document.getElementById('login-button').addEventListener('click', login);
