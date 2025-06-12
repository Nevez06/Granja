// Inicializa o Supabase
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

 function formatarTelefone(telefone) {
     let valor = telefone.value.replace(/\D/g, '');
     if (valor.length > 11) {
         valor = valor.slice(0, 11);
     }
     if (valor.length > 6) {
         telefone.value = valor.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
     } else if (valor.length > 2) {
         telefone.value = valor.replace(/(\d{2})(\d)/, '($1) $2');
     } else {
         telefone.value = valor;
     }
 }

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

     try {
         const { data, error } = await supabase
             .from('usuarios') // Substitua pelo nome da sua tabela
             .insert([
                 { nome, cpf, telefone, data_nascimento: dataNascimento, email, senha }
             ]);

         if (error) {
             throw error;
         }

         alert('Usuário cadastrado com sucesso!');
         // Redirecionar ou limpar o formulário após o cadastro
         document.getElementById('formCadastro').reset();
     } catch (error) {
         alert('Erro ao cadastrar usuário: ' + error.message);
     }
 }
