// script.js
const form = document.getElementById('form-aluno');
const tabela = document.querySelector('#tabela-alunos tbody');
let alunos = [];
let editandoCpf = null;

async function getAlunos() {
  try {
    const response = await fetch('https://gympasser-api.vercel.app/user');
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    alunos = await response.json();
    renderTabela();
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    mensagemErro('Erro ao carregar os alunos.');
  }
}

function renderTabela() {
  tabela.innerHTML = '';
  alunos.forEach((aluno) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.user}</td>
      <td>${aluno.cpf}</td>
      <td>${aluno.status}</td>
      <td>${aluno.id}</td>
      <td>
        <button onclick="editarAluno('${aluno.cpf}')">Editar</button>
        <button onclick="excluirAluno('${aluno.cpf}')">Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const status = document.getElementById('status').value;

  const alunoData = {
    user: nome,
    cpf: cpf,
    status: status
  };

  try {
    let response;
    if (editandoCpf) {
      response = await fetch(`https://gympasser-api.vercel.app/user/${editandoCpf}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alunoData),
      });
      if (response.ok) {
        mensagemSucesso(`Aluno com CPF ${editandoCpf} atualizado!`);
      } else if (response.status === 404) {
        mensagemErro(`Erro ao atualizar: Aluno com CPF ${editandoCpf} não encontrado.`);
        return;
      } else {
        throw new Error(`Erro ao atualizar aluno: ${response.status}`);
      }
      editandoCpf = null;
    } else {
      response = await fetch('https://gympasser-api.vercel.app/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alunoData),
      });
      if (response.status === 201) {
        mensagemSucesso('Aluno adicionado com sucesso!');
      } else if (response.status === 409) {
        mensagemErro('Erro ao adicionar: CPF já cadastrado!');
        return;
      } else {
        throw new Error(`Erro ao adicionar aluno: ${response.status}`);
      }
    }
    await getAlunos();
    form.reset();
  } catch (error) {
    console.error('Erro ao salvar/atualizar aluno:', error);
    mensagemErro('Erro ao salvar as informações do aluno.');
  }
});

async function editarAluno(cpf) {
  try {
    const response = await fetch(`https://gympasser-api.vercel.app/user/${cpf}`, {method: 'GET',});
    if (!response.ok) {
      throw new Error(`Erro ao buscar aluno para edição: ${response.status}`);
    }
    const aluno = await response.json()
    
    console.log(aluno)

    document.getElementById('nome').value = aluno.user;
    document.getElementById('cpf').value = aluno.cpf;
    document.getElementById('status').value = aluno.status;
    editandoCpf = aluno.cpf;

  } catch (error) {
      console.error('Erro ao buscar dados do aluno para edição:', error);
      mensagemErro('Erro ao carregar dados para edição.');
    };
}

async function excluirAluno(cpf) {
  if (confirm(`Tem certeza que deseja excluir o aluno com CPF ${cpf}?`)) {
    try {
      const response = await fetch(`https://gympasser-api.vercel.app/user/${cpf}`, {
        method: 'DELETE',
        body: {'cpf': cpf}
      });
      if (response.ok) {
        mensagemSucesso(`Aluno com CPF ${cpf} excluído com sucesso!`);
        getAlunos();
      } else if (response.status === 404) {
        mensagemErro(`Erro ao excluir: Aluno com CPF ${cpf} não encontrado.`);
      } else {
        throw new Error(`Erro ao excluir aluno: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      mensagemErro('Erro ao excluir o aluno.');
    }
  }
}

function mensagemSucesso(mensagem) {
  alert(`Sucesso! ${mensagem}`);
}

function mensagemErro(mensagem) {
  alert(`Ops! ${mensagem}`);
}

async function autenticarCPF(cpf) {
  try {
    const response = await fetch(`https://gympasser-api.vercel.app/user/${cpf}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert('CPF não cadastrado. Procure a secretaria da academia.');
      } else {
        alert('Erro ao verificar CPF. Tente novamente mais tarde.');
      }
      return false;
    }
    const aluno = await response.json();
    if (aluno.status === 'inactive') {
      alert('Acesso bloqueado. Procure a secretaria da academia.');
      return false;
    }
    alert(`Acesso liberado! Bem-vindo(a), ${aluno.user}`);
    return true;
  } catch (error) {
    console.error('Erro ao autenticar CPF:', error);
    alert('Erro ao verificar CPF. Tente novamente mais tarde.');
    return false;
  }
}

getAlunos();