const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function cadastrarOvos() {
    const tamanho = document.getElementById('tamanho').value;
    const corDaCasca = document.getElementById('corDaCasca').value;

    if (!tamanho || !corDaCasca) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('ovos')
            .insert([{ tamanho, corDaCasca }]);

        if (error) {
            throw error;
        }

        alert('Ovos cadastrados com sucesso!');
        document.getElementById('ovosForm').reset();
    } catch (error) {
        alert('Erro ao salvar ovos: ' + error.message);
    }
}
