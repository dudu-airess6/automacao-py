document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const btnCadastrar = document.getElementById('btnCadastrar');
    const mensagemFeedback = document.getElementById('mensagemFeedback');

    loginForm.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const credencial = document.getElementById('credencial').value;
        const senha = document.getElementById('senha').value;

        try {
            // Rota e porta atualizadas para a API unificada na porta 8001
            const resposta = await fetch('http://127.0.0.1:8001/auth/login', {
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
                // Salva o Token JWT e as informações do perfil para uso na Busca e RBAC
                if (dados.access_token) {
                    localStorage.setItem('token', dados.access_token);
                    localStorage.setItem('tipo_usuario', dados.tipo_usuario);
                    localStorage.setItem('nome_usuario', dados.nome);
                }

                mensagemFeedback.style.color = '#77dd77';
                mensagemFeedback.textContent = dados.mensagem || 'Login realizado com sucesso! Redirecionando...';
                
                // Exemplo de redirecionamento:
                // setTimeout(() => { window.location.href = '/busca.html'; }, 1200);
            } else {
                mensagemFeedback.style.color = '#ef4444';
                mensagemFeedback.textContent = dados.detail || dados.mensagem || 'Credenciais inválidas.';
            }

        } catch (erro) {
            console.error('Erro na requisição:', erro);
            mensagemFeedback.style.color = '#ef4444';
            mensagemFeedback.textContent = 'Erro de conexão com o servidor. Verifique se o backend está ativo na porta 8001.';
        }
    });

    btnCadastrar.addEventListener('click', () => {
        mensagemFeedback.style.color = '#4a4a4a';
        mensagemFeedback.textContent = 'Redirecionando para a tela de registro...';
        // window.location.href = '/cadastro.html'; 
    });
});