// script.js
const form = document.getElementById('form-aluno');
const tabela = document.querySelector('#tabela-alunos tbody');
let alunos = JSON.parse(localStorage.getItem('alunos')) || [
  { nome: 'Ana Silva', cpf: '12345678900', status: 'ativo' },
  { nome: 'Carlos Souza', cpf: '98765432100', status: 'bloqueado' },
  { nome: 'Maria Oliveira', cpf: '45612378900', status: 'ativo' }
];
let editandoId = null;

function salvarAlunos() {
  localStorage.setItem('alunos', JSON.stringify(alunos));
}

function renderTabela() {
  tabela.innerHTML = '';
  alunos.forEach((aluno, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.cpf}</td>
      <td>${aluno.status}</td>
      <td>
        <button onclick="editarAluno(${index})">Editar</button>
        <button onclick="excluirAluno(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const status = document.getElementById('status').value;

  if (editandoId !== null) {
    alunos[editandoId] = { nome, cpf, status };
    editandoId = null;
  } else {
    alunos.push({ nome, cpf, status });
  }

  salvarAlunos();
  renderTabela();
  form.reset();
});

function editarAluno(index) {
  const aluno = alunos[index];
  document.getElementById('nome').value = aluno.nome;
  document.getElementById('cpf').value = aluno.cpf;
  document.getElementById('status').value = aluno.status;
  editandoId = index;
}

function excluirAluno(index) {
  alunos.splice(index, 1);
  salvarAlunos();
  renderTabela();
}

// Tela de autenticação de CPF
function autenticarCPF(cpf) {
  const aluno = alunos.find(a => a.cpf === cpf);
  if (!aluno) {
    alert('CPF não cadastrado. Procure a secretaria da academia.');
    return false;
  }
  if (aluno.status === 'bloqueado') {
    alert('Acesso bloqueado. Procure a secretaria da academia.');
    return false;
  }
  alert('Acesso liberado! Bem-vindo(a), ' + aluno.nome);
  return true;
}

// Exemplo de uso da autenticação
// autenticarCPF('12345678900'); // Libera
// autenticarCPF('98765432100'); // Bloqueado

// Inicializa tabela e salva dados
salvarAlunos();
renderTabela(); 