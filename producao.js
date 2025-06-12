const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function cadastrarProducao() {
    const raca = document.getElementById('raca').value;
    const producao = document.getElementById('meses').value;
    const idade_galinha = document.getElementById('galinha').value;

    if (!raca || !producao || !idade_galinha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    console.log('Dados a serem inseridos:', { raca, producao, idade_galinha });

    try {
        const { data, error } = await supabase
            .from('producoes')
            .insert([{ raca, producao, idade_galinha }]);

        console.log('Resposta do Supabase:', { data, error });

        if (error) {
            throw error;
        }

        alert('Produções cadastradas com sucesso!');
        document.getElementById('producaoForm').reset();
    } catch (error) {
        console.error('Erro ao salvar produções:', error);
        alert('Erro ao salvar produções: ' + error.message);
    }
}
