document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const btnCadastrar = document.getElementById('btnCadastrar');
    const mensagemFeedback = document.getElementById('mensagemFeedback');

    loginForm.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const credencial = document.getElementById('credencial').value;
        const senha = document.getElementById('senha').value;

        try {
            // Porta atualizada para 8000 (FastAPI)
            const resposta = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: credencial,
                    senha: senha
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                mensagemFeedback.style.color = '#77dd77';
                mensagemFeedback.textContent = dados.mensagem || 'Login realizado com sucesso! Redirecionando...';
                // window.location.href = '/dashboard.html';
            } else {
                mensagemFeedback.style.color = '#ef4444';
                // Captura a chave 'detail' padronizada do FastAPI
                mensagemFeedback.textContent = dados.detail || dados.mensagem || 'Credenciais inválidas.';
            }

        } catch (erro) {
            console.error('Erro na requisição:', erro);
            mensagemFeedback.style.color = '#ef4444';
            mensagemFeedback.textContent = 'Erro de conexão com o servidor. Verifique se o backend está ativo na porta 8000.';
        }
    });

    btnCadastrar.addEventListener('click', () => {
        mensagemFeedback.style.color = '#4a4a4a';
        mensagemFeedback.textContent = 'Redirecionando para a tela de registro...';
        // window.location.href = '/cadastro.html'; 
    });
});
