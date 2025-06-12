const supabaseUrl = 'https://yzftalxqhygmgdvgtxbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6ZnRhbHhxaHlnbWdkdmd0eGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTcxMzEsImV4cCI6MjAzOTkzMzEzMX0.qkKE_6KsfCoV8eC6C-eXZs5hJHYU-kLRDJPrq0uU5AI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function formatarCPF(cpf) {
    let valor = cpf.value.replace(/\D/g, '');
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }
    cpf.value = valor.replace(/(\d{3})(\d)/, '$1.$2')
                     .replace(/(\d{3})(\d)/, '$1.$2')
                     .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

async function cadastrarPessoa() {
    const tipo = document.getElementById('tipo').value;
    const cpf = document.getElementById('cpf').value;

    if (!tipo || !cpf) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('produtores')
            .insert([{ tipo, cpf }]);

        if (error) {
            throw error;
        }

        alert('Pessoa cadastrada com sucesso!');
        document.getElementById('pessoaForm').reset();
    } catch (error) {
        alert('Erro ao salvar pessoa: ' + error.message);
    }
}
