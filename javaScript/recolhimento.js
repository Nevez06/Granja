const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function cadastrarRecolhimento() {
    const hora = document.getElementById('hora').value;
    const quantidade = document.getElementById('quantidade').value;
    const dataRecolhimento = document.getElementById('data').value;

    if (!hora || !quantidade || !dataRecolhimento) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('recolhimentos')
            .insert([{ hora, quantidade, dataRecolhimento  }]);

        if (error) {
            throw error;
        }

        alert('Recolhimento  cadastrado com sucesso!');
        document.getElementById('recolhimentoForm').reset();
    } catch (error) {
        alert('Erro ao salvar ovos: ' + error.message);
    }
}

                        