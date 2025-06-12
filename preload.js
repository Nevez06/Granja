const { contextBridge } = require('electron');
const supabase = require('./supabase');
const bcrypt = require('bcrypt');

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

// Função para validar telefone
function validarTelefone(telefone) {
    telefone = telefone.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    return telefone.length === 11; // Verifica se o telefone tem 11 dígitos
}

// Expondo funções para o contexto do Electron
contextBridge.exposeInMainWorld('electronAPI', {
    validarCPF: (cpf) => validarCPF(cpf),
    validarTelefone: (telefone) => validarTelefone(telefone),

    cadastrarUsuario: async (usuario) => {
        const { nome, cpf, telefone, dataNascimento, email, senha } = usuario;

        // Valida se os campos obrigatórios estão preenchidos
        if (!nome || !cpf || !telefone || !dataNascimento || !email || !senha) {
            return { error: 'Preencha todos os campos.' };
        }

        // Valida o CPF
        if (!validarCPF(cpf)) {
            return { error: 'CPF inválido. O CPF deve conter 11 dígitos e ser válido.' };
        }

        // Valida o telefone
        if (!validarTelefone(telefone)) {
            return { error: 'Telefone inválido. O telefone deve conter 11 dígitos.' };
        }

        // Remove a formatação do CPF e telefone para salvar no banco de dados
        const cpfLimpo = cpf.replace(/[^\d]+/g, '');
        const telefoneLimpo = telefone.replace(/[^\d]+/g, '');

        // Formata a data de nascimento para o formato ISO
        const dataNascimentoFormatada = new Date(dataNascimento).toISOString();

        try {
            // Criptografa a senha usando bcrypt
            const saltRounds = 10;
            const hashedSenha = await bcrypt.hash(senha, saltRounds);

            // Insere o usuário no banco de dados
            const { data, error } = await supabase
                .from('usuarios')
                .insert([
                    { 
                        nome, 
                        cpf: cpfLimpo, 
                        telefone: telefoneLimpo, 
                        data_nascimento: dataNascimentoFormatada, 
                        email, 
                        senha: hashedSenha 
                    }
                ]);

            if (error) throw error;

            return { success: true, data: data };
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            return { error: 'Erro ao cadastrar: ' + error.message };
        }
    }
});

// Função para lidar com o login
async function Login() {
    // Obtém os valores dos campos de entrada
    const email = document.getElementById('email').value; // Captura o valor do campo de email
    const senha = document.getElementById('senha').value; // Captura o valor do campo de senha

    // Verifica se os campos obrigatórios estão preenchidos
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        // Tenta fazer login com o Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        // Verifica se houve erro
        if (error) {
            alert('Erro ao fazer login: ' + error.message);
        } else {
            // Redireciona para a página principal ou para uma página específica
            window.location.href = 'menu.html'; // Altere 'menu.html' para a página desejada
        }
    } catch (error) {
        // Captura e exibe erros inesperados
        console.error('Erro inesperado ao fazer login:', error);
        alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
}

// Adiciona o evento de clique no botão de login
document.getElementById('login-button').addEventListener('click', Login);
// Função para salvar a produção
async function salvarProducao() {
    const idadeGalinha = document.getElementById('galinha').value;
    const raca = document.getElementById('raca').value;
    const producao = document.getElementById('meses').value;

    // Validação dos campos
    if (!idadeGalinha || !raca || !producao) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Log dos valores obtidos
    console.log('Valores obtidos:', { idadeGalinha, raca, producao });

    try {
        const { data, error } = await supabase
            .from('producoes')
            .insert([{ idade_galinha: idadeGalinha, raca: raca, producao: producao }]);

        console.log('Dados retornados do Supabase:', data, error);

        if (error) {
            alert('Erro ao salvar dados: ' + error.message);
        } else {
            // Limpa os campos após o sucesso
            document.getElementById('galinha').value = '';
            document.getElementById('raca').value = '';
            document.getElementById('meses').value = '';
            // Chama a função para carregar produções
            carregarProducoes();
            alert('Produção salva com sucesso!'); // Mensagem de sucesso
        }
    } catch (err) {
        console.error('Erro inesperado:', err);
        alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
}

// Adiciona o evento de clique no botão de salvar
document.querySelector('.action-button').addEventListener('click', salvarProducao);
// Função para salvar ovos
async function salvarOvos() {
    // Obtém os valores dos campos de entrada
    const corDaCasca = document.getElementById('corDaCasca').value;
    const tamanho = document.getElementById('tamanho').value;

    // Validação dos campos
    if (!corDaCasca || !tamanho) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Adiciona os dados no Supabase
    try {
        const { data, error } = await supabase
            .from('ovos')  // Substitua 'ovos' pelo nome correto da tabela
            .insert([{ cor_da_casca: corDaCasca, tamanho: tamanho }]);

        // Verifica se houve erro
        if (error) throw error;

        // Limpa os campos após o salvamento
        document.getElementById('corDaCasca').value = '';
        document.getElementById('tamanho').value = '';
        
        // Atualiza a lista de ovos
        carregarOvos();
        alert('Ovo salvo com sucesso!'); // Mensagem de sucesso
    } catch (error) {
        alert('Erro ao salvar dados: ' + error.message);
    }
}

// Função para carregar e exibir a lista de ovos
async function carregarOvos() {
    try {
        const { data, error } = await supabase
            .from('ovos')  // Substitua 'ovos' pelo nome correto da tabela
            .select('*');

        // Verifica se houve erro
        if (error) throw error;

        const lista = document.getElementById('ovo-list');
        lista.innerHTML = ''; // Limpa a lista existente

        // Cria uma lista com os dados
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `Cor da Casca: ${item.cor_da_casca}, Tamanho: ${item.tamanho}`;

            // Adiciona botão de excluir para cada item
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => excluirOvo(item.id);
            div.appendChild(deleteButton);
            lista.appendChild(div);
        });
    } catch (error) {
        alert('Erro ao carregar dados: ' + error.message);
    }
}

// Função para excluir um ovo
async function excluirOvo(id) {
    try {
        const { error } = await supabase
            .from('ovos')  // Substitua 'ovos' pelo nome correto da tabela
            .delete()
            .match({ id: id });

        if (error) throw error;

        // Atualiza a lista após exclusão
        carregarOvos();
    } catch (error) {
        alert('Erro ao excluir dados: ' + error.message);
    }
}

// Adiciona o evento de carregamento da página para atualizar a lista
document.addEventListener('DOMContentLoaded', carregarOvos);

// Adiciona o evento de clique no botão de salvar
document.querySelector('.action-button').addEventListener('click', salvarOvos);
// Função para salvar os dados de recolhimento
async function salvarRecolhimento() {
    // Obtém os valores dos campos de entrada
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const quantidade = document.getElementById('quantidade').value;

    // Validação dos campos
    if (!data || !hora || !quantidade) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Adiciona os dados no Supabase
    try {
        const { data: result, error } = await supabase
            .from('recolhimentos')  // Substitua 'recolhimentos' pelo nome correto da tabela
            .insert([{ data: data, hora: hora, quantidade: quantidade }]);

        // Verifica se houve erro
        if (error) throw error;

        // Limpa os campos após o salvamento
        document.getElementById('data').value = '';
        document.getElementById('hora').value = '';
        document.getElementById('quantidade').value = '';

        // Atualiza a lista de recolhimentos
        carregarRecolhimentos();
        alert('Recolhimento salvo com sucesso!'); // Mensagem de sucesso
    } catch (error) {
        alert('Erro ao salvar dados: ' + error.message);
    }
}

// Função para carregar e exibir a lista de recolhimentos
async function carregarRecolhimentos() {
    try {
        const { data, error } = await supabase
            .from('recolhimentos')  // Substitua 'recolhimentos' pelo nome correto da tabela
            .select('*');

        // Verifica se houve erro
        if (error) throw error;

        const lista = document.getElementById('recolhimento-list');
        lista.innerHTML = ''; // Limpa a lista existente

        // Cria uma lista com os dados
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `Data: ${item.data}, Hora: ${item.hora}, Quantidade Recolhida: ${item.quantidade}`;
            // Adiciona botão de excluir para cada item
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => excluirRecolhimento(item.id);
            div.appendChild(deleteButton);
            lista.appendChild(div);
        });
    } catch (error) {
        alert('Erro ao carregar dados: ' + error.message);
    }
}

// Função para excluir um recolhimento
async function excluirRecolhimento(id) {
    try {
        const { error } = await supabase
            .from('recolhimentos')  // Substitua 'recolhimentos' pelo nome correto da tabela
            .delete()
            .match({ id: id });

        if (error) throw error;

        // Atualiza a lista após exclusão
        carregarRecolhimentos();
    } catch (error) {
        alert('Erro ao excluir dados: ' + error.message);
    }
}

// Adiciona o evento de carregamento da página para atualizar a lista
document.addEventListener('DOMContentLoaded', carregarRecolhimentos);

// Adiciona o evento de clique no botão de salvar
document.querySelector('.action-button').addEventListener('click', salvarRecolhimento);
// Função para salvar os dados do produtor
async function salvarProdutor() {
    // Obtém os valores dos campos de entrada
    const tipo = document.getElementById('tipo').value;
    const cpf = document.getElementById('cpf').value;

    // Validação simples dos campos
    if (!tipo || !cpf) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Adiciona os dados no Supabase
    try {
        const { data, error } = await supabase
            .from('pessoas')  // Certifique-se de que o nome da tabela está correto
            .insert([{ tipo: tipo, cpf: cpf }]);

        // Verifica se houve erro
        if (error) {
            throw error;
        }

        // Exibe uma mensagem de sucesso
        alert('Produtor salvo com sucesso!');

        // Limpa os campos após o salvamento
        document.getElementById('tipo').value = '';
        document.getElementById('cpf').value = '';

        // Atualiza a lista de produtores
        carregarProdutores();

    } catch (error) {
        // Exibe uma mensagem de erro
        alert('Erro ao salvar dados: ' + error.message);
    }
}

// Função para carregar e exibir a lista de produtores
async function carregarProdutores() {
    try {
        const { data, error } = await supabase
            .from('pessoas')  // Certifique-se de que o nome da tabela está correto
            .select('*');

        // Verifica se houve erro
        if (error) {
            throw error;
        }

        const lista = document.getElementById('produtor-list');
        lista.innerHTML = ''; // Limpa a lista existente

        // Cria uma lista com os dados
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `Tipo: ${item.tipo}, CPF: ${item.cpf}`;
            lista.appendChild(div);
        });

    } catch (error) {
        // Exibe uma mensagem de erro
        alert('Erro ao carregar dados: ' + error.message);
    }
}

// Adiciona o evento de carregamento da página para atualizar a lista
document.addEventListener('DOMContentLoaded', carregarProdutores);

// Adiciona o evento de clique no botão de salvar
document.querySelector('.action-button').addEventListener('click', salvarProdutor);
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});

async function carregarDados() {
    try {
        const { data, error } = await supabase
            .from('ovos')  // Certifique-se de que o nome da tabela está correto
            .select('*');

        if (error) throw error;

        const tbody = document.querySelector('#dados-tabela-ovos tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');

            const tdCorDaCasca = document.createElement('td');
            const tdTamanho = document.createElement('td');
            const tdAcoes = document.createElement('td');

            const inputCorDaCasca = document.createElement('input');
            inputCorDaCasca.type = 'text';
            inputCorDaCasca.value = item.cor_da_casca;
            inputCorDaCasca.disabled = true;

            const inputTamanho = document.createElement('input');
            inputTamanho.type = 'text';
            inputTamanho.value = item.tamanho;
            inputTamanho.disabled = true;

            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => editarLinha(item.id, inputCorDaCasca, inputTamanho, btnEditar);

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.onclick = () => excluirOvo(item.id);

            tdCorDaCasca.appendChild(inputCorDaCasca);
            tdTamanho.appendChild(inputTamanho);
            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnExcluir);

            tr.appendChild(tdCorDaCasca);
            tr.appendChild(tdTamanho);
            tr.appendChild(tdAcoes);

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar dados: ', error);
    }
}

function editarLinha(id, inputCorDaCasca, inputTamanho, btnEditar) {
    if (btnEditar.textContent === 'Editar') {
        inputCorDaCasca.disabled = false;
        inputTamanho.disabled = false;
        btnEditar.textContent = 'Salvar';
    } else {
        atualizarOvo(id, inputCorDaCasca.value, inputTamanho.value)
            .then(() => {
                inputCorDaCasca.disabled = true;
                inputTamanho.disabled = true;
                btnEditar.textContent = 'Editar';
            })
            .catch(error => {
                console.error('Erro ao atualizar dados: ', error);
            });
    }
}

async function atualizarOvo(id, corDaCasca, tamanho) {
    try {
        const { error } = await supabase
            .from('ovos')  // Certifique-se de que o nome da tabela está correto
            .update({ cor_da_casca: corDaCasca, tamanho: tamanho })
            .eq('id', id);

        if (error) throw error;
        alert('Ovo atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar ovo: ', error);
        alert('Erro ao atualizar ovo: ' + error.message);
    }
}

async function excluirOvo(id) {
    try {
        const { error } = await supabase
            .from('ovos')  // Certifique-se de que o nome da tabela está correto
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Ovo excluído com sucesso!');
        carregarDados();
    } catch (error) {
        console.error('Erro ao excluir ovo: ', error);
        alert('Erro ao excluir ovo: ' + error.message);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    carregarDados('producoes', '#dados-tabela-producoes tbody');
});

function carregarDados(chave, tabelaSeletor) {
    const dados = JSON.parse(localStorage.getItem(chave)) || [];
    const tbody = document.querySelector(tabelaSeletor);

    tbody.innerHTML = ''; // Limpa o tbody antes de adicionar novos dados

    dados.forEach((item, index) => {
        const tr = document.createElement('tr');

        const tdIdade = document.createElement('td');
        const tdRaca = document.createElement('td');
        const tdProducao = document.createElement('td');
        const tdAcoes = document.createElement('td');

        const inputIdade = document.createElement('input');
        inputIdade.type = 'text';
        inputIdade.value = item.idade;
        inputIdade.disabled = true;

        const inputRaca = document.createElement('input');
        inputRaca.type = 'text';
        inputRaca.value = item.raca;
        inputRaca.disabled = true;

        const inputProducao = document.createElement('input');
        inputProducao.type = 'text';
        inputProducao.value = item.producao;
        inputProducao.disabled = true;

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarLinha(index, inputIdade, inputRaca, inputProducao, btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => excluirLinha(index);

        tdIdade.appendChild(inputIdade);
        tdRaca.appendChild(inputRaca);
        tdProducao.appendChild(inputProducao);
        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdIdade);
        tr.appendChild(tdRaca);
        tr.appendChild(tdProducao);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });
}

function editarLinha(index, inputIdade, inputRaca, inputProducao, btnEditar) {
    if (btnEditar.textContent === 'Editar') {
        // Ativa os campos de edição
        inputIdade.disabled = false;
        inputRaca.disabled = false;
        inputProducao.disabled = false;
        btnEditar.textContent = 'Salvar';
    } else {
        // Salva as alterações e desativa os campos novamente
        salvarEdicao(index, inputIdade.value, inputRaca.value, inputProducao.value);
        inputIdade.disabled = true;
        inputRaca.disabled = true;
        inputProducao.disabled = true;
        btnEditar.textContent = 'Editar'; // Volta ao estado de edição
    }
}

function salvarEdicao(index, idade, raca, producao) {
    const dados = JSON.parse(localStorage.getItem('producoes')) || [];
    dados[index] = { idade, raca, producao };
    localStorage.setItem('producoes', JSON.stringify(dados));
    carregarDados('producoes', '#dados-tabela-producoes tbody'); // Atualiza a tabela
}

function excluirLinha(index) {
    // Confirmação de exclusão
    if (confirm('Tem certeza que deseja excluir este item?')) {
        const dados = JSON.parse(localStorage.getItem('producoes')) || [];
        dados.splice(index, 1); // Remove o item da lista
        localStorage.setItem('producoes', JSON.stringify(dados));
        carregarDados('producoes', '#dados-tabela-producoes tbody'); // Atualiza a tabela
    }
}
document.addEventListener('DOMContentLoaded', () => {
    carregarDados('recolhimentos', '#dados-tabela-recolhimentos tbody');
});

function carregarDados(chave, tabelaSeletor) {
    const dados = JSON.parse(localStorage.getItem(chave)) || [];
    const tbody = document.querySelector(tabelaSeletor);

    tbody.innerHTML = ''; // Limpa o tbody antes de adicionar novos dados

    dados.forEach((item, index) => {
        const tr = document.createElement('tr');

        const tdData = document.createElement('td');
        const tdHora = document.createElement('td');
        const tdQuantidade = document.createElement('td');
        const tdAcoes = document.createElement('td');

        const inputData = document.createElement('input');
        inputData.type = 'text';
        inputData.value = item.data;
        inputData.disabled = true;

        const inputHora = document.createElement('input');
        inputHora.type = 'text';
        inputHora.value = item.hora;
        inputHora.disabled = true;

        const inputQuantidade = document.createElement('input');
        inputQuantidade.type = 'text';
        inputQuantidade.value = item.quantidade;
        inputQuantidade.disabled = true;

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarLinha(index, inputData, inputHora, inputQuantidade, btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => excluirLinha(index);

        tdData.appendChild(inputData);
        tdHora.appendChild(inputHora);
        tdQuantidade.appendChild(inputQuantidade);
        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdData);
        tr.appendChild(tdHora);
        tr.appendChild(tdQuantidade);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });
}

function editarLinha(index, inputData, inputHora, inputQuantidade, btnEditar) {
    if (btnEditar.textContent === 'Editar') {
        // Habilita os campos para edição
        inputData.disabled = false;
        inputHora.disabled = false;
        inputQuantidade.disabled = false;
        btnEditar.textContent = 'Salvar';
    } else {
        // Validação dos campos
        if (inputData.value === '' || inputHora.value === '' || inputQuantidade.value === '') {
            alert('Por favor, preencha todos os campos antes de salvar.');
        } else {
            salvarEdicao(index, inputData.value, inputHora.value, inputQuantidade.value);
            btnEditar.textContent = 'Editar'; // Volta ao estado de edição
        }
    }
}

function salvarEdicao(index, data, hora, quantidade) {
    const dados = JSON.parse(localStorage.getItem('recolhimentos')) || [];
    dados[index] = { data, hora, quantidade };
    localStorage.setItem('recolhimentos', JSON.stringify(dados));
    carregarDados('recolhimentos', '#dados-tabela-recolhimentos tbody'); // Atualiza a tabela
}

function excluirLinha(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        const dados = JSON.parse(localStorage.getItem('recolhimentos')) || [];
        dados.splice(index, 1);
        localStorage.setItem('recolhimentos', JSON.stringify(dados));
        carregarDados('recolhimentos', '#dados-tabela-recolhimentos tbody'); // Atualiza a tabela
    }
}
