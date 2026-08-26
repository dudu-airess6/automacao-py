document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const btnCadastrar = document.getElementById('btnCadastrar');
    const mensagemFeedback = document.getElementById('mensagemFeedback');

    // Lógica para o Login
    loginForm.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // Evita que a página recarregue

        const credencial = document.getElementById('credencial').value;
        const senha = document.getElementById('senha').value;

        try {
            // Aqui você substitui pela URL da sua API em Python (ex: http://localhost:5000/api/login)
            const resposta = await fetch('http://localhost:5000/api/login', {
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
                mensagemFeedback.textContent = 'Login realizado com sucesso! Redirecionando...';
                // window.location.href = '/dashboard.html'; // Redirecionar usuário
            } else {
                mensagemFeedback.style.color = '#ef4444'; // Vermelho para erro
                mensagemFeedback.textContent = dados.mensagem || 'Credenciais inválidas.';
            }

        } catch (erro) {
            console.error('Erro na requisição:', erro);
            mensagemFeedback.style.color = '#ef4444';
            mensagemFeedback.textContent = 'Erro de conexão com o servidor. O backend Python está rodando?';
        }
    });

    // Lógica para o Cadastro (Navegação ou abertura de Modal)
    btnCadastrar.addEventListener('click', () => {
        // Redireciona para a página de cadastro ou altera o formulário atual
        mensagemFeedback.style.color = '#4a4a4a';
        mensagemFeedback.textContent = 'Redirecionando para a tela de registro...';
        // window.location.href = '/cadastro.html'; 
    });
});