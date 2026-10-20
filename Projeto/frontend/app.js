document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://127.0.0.1:8001';

    // ============================================================
    // 1. TELA DE LOGIN (index.html)
    // ============================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const btnCadastrar = document.getElementById('btnCadastrar');
        const mensagemFeedback = document.getElementById('mensagemFeedback');

        loginForm.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const credencial = document.getElementById('credencial').value;
            const senha = document.getElementById('senha').value;

            try {
                const resposta = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario: credencial,
                        senha: senha
                    })
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    if (dados.access_token) {
                        localStorage.setItem('token', dados.access_token);
                        localStorage.setItem('tipo_usuario', dados.tipo_usuario);
                        localStorage.setItem('nome_usuario', dados.nome);
                    }

                    mensagemFeedback.style.color = '#77dd77';
                    mensagemFeedback.textContent = dados.mensagem || 'Login realizado com sucesso! Redirecionando...';

                    // Redireciona para a busca se for Farmacêutico
                    setTimeout(() => {
                        if (dados.tipo_usuario === 'Farmaceutico') {
                            window.location.href = 'busca.html';
                        } else {
                            mensagemFeedback.style.color = '#ef4444';
                            mensagemFeedback.textContent = 'Apenas farmacêuticos têm permissão de acesso à busca.';
                        }
                    }, 1000);

                } else {
                    mensagemFeedback.style.color = '#ef4444';
                    mensagemFeedback.textContent = dados.detail || dados.mensagem || 'Credenciais inválidas.';
                }

            } catch (erro) {
                console.error('Erro na requisição de login:', erro);
                mensagemFeedback.style.color = '#ef4444';
                mensagemFeedback.textContent = 'Erro de conexão. Verifique se o servidor na porta 8001 está ativo.';
            }
        });

        if (btnCadastrar) {
            btnCadastrar.addEventListener('click', () => {
                window.location.href = 'cadastro.html';
            });
        }
    }

    // ============================================================
    // 2. TELA DE CADASTRO (cadastro.html)
    // ============================================================
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        const mensagemFeedbackCad = document.getElementById('mensagemFeedback');
        const btnVoltarLogin = document.getElementById('btnVoltarLogin');

        cadastroForm.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const nome = document.getElementById('nome').value;
            const login = document.getElementById('login').value;
            const senha = document.getElementById('senha').value;
            const tipo_usuario = document.getElementById('tipo_usuario').value;
            const crf = document.getElementById('crf') ? document.getElementById('crf').value : null;

            try {
                const resposta = await fetch(`${API_BASE}/auth/cadastro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome,
                        login,
                        senha,
                        tipo_usuario,
                        crf
                    })
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    mensagemFeedbackCad.style.color = '#77dd77';
                    mensagemFeedbackCad.textContent = 'Usuário cadastrado com sucesso! Redirecionando para login...';
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                } else {
                    mensagemFeedbackCad.style.color = '#ef4444';
                    mensagemFeedbackCad.textContent = dados.detail || 'Erro ao realizar cadastro.';
                }
            } catch (erro) {
                console.error('Erro na requisição de cadastro:', erro);
                mensagemFeedbackCad.style.color = '#ef4444';
                mensagemFeedbackCad.textContent = 'Erro de conexão com o servidor.';
            }
        });

        if (btnVoltarLogin) {
            btnVoltarLogin.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }

    // ============================================================
    // 3. TELA DE BUSCA / DASHBOARD (busca.html)
    // ============================================================
    const formBusca = document.getElementById('formBusca');
    if (formBusca) {
        // Validação de Sessão/Token
        const token = localStorage.getItem('token');
        const tipoUsuario = localStorage.getItem('tipo_usuario');
        const nomeUsuario = localStorage.getItem('nome_usuario');

        if (!token || tipoUsuario !== 'Farmaceutico') {
            alert('Acesso negado. Faça login como Farmacêutico.');
            localStorage.clear();
            window.location.href = 'index.html';
            return;
        }

        const labelUsuario = document.getElementById('labelUsuario');
        if (labelUsuario) {
            labelUsuario.textContent = `Farm. ${nomeUsuario || 'Usuário'}`;
        }

        const inputQuery = document.getElementById('inputQuery');
        const selectForma = document.getElementById('selectForma');
        const gridResultados = document.getElementById('gridResultados');
        const infoTotal = document.getElementById('infoTotal');
        const paginacao = document.getElementById('paginacao');
        const btnAnterior = document.getElementById('btnAnterior');
        const btnProxima = document.getElementById('btnProxima');
        const labelPagina = document.getElementById('labelPagina');
        const btnLogout = document.getElementById('btnLogout');

        let paginaAtual = 1;
        const limitePorPagina = 9;

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        }

        formBusca.addEventListener('submit', (e) => {
            e.preventDefault();
            paginaAtual = 1;
            executarBusca();
        });

        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                if (paginaAtual > 1) {
                    paginaAtual--;
                    executarBusca();
                }
            });
        }

        if (btnProxima) {
            btnProxima.addEventListener('click', () => {
                paginaAtual++;
                executarBusca();
            });
        }

        async function executarBusca() {
            const query = inputQuery.value.trim();
            const forma = selectForma.value;

            const params = new URLSearchParams({
                page: paginaAtual,
                limit: limitePorPagina
            });
            if (query) params.append('q', query);
            if (forma) params.append('forma', forma);

            gridResultados.innerHTML = '<p>Buscando medicamentos...</p>';

            try {
                const resposta = await fetch(`${API_BASE}/api/v1/buscar?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (resposta.status === 401 || resposta.status === 403) {
                    alert('Sessão expirada ou não autorizada. Faça login novamente.');
                    localStorage.clear();
                    window.location.href = 'index.html';
                    return;
                }

                if (!resposta.ok) {
                    throw new Error('Erro na consulta');
                }

                const dados = await resposta.json();
                renderizarResultados(dados);

            } catch (erro) {
                console.error('Erro na busca:', erro);
                gridResultados.innerHTML = '<p style="color: red;">Erro ao carregar medicamentos. Verifique se o backend está rodando.</p>';
            }
        }

        function renderizarResultados(dados) {
            const { total_encontrados, resultados, pagina, limite } = dados;

            if (infoTotal) {
                infoTotal.textContent = `Total de registros encontrados: ${total_encontrados}`;
            }

            gridResultados.innerHTML = '';

            if (!resultados || resultados.length === 0) {
                gridResultados.innerHTML = '<p>Nenhum medicamento encontrado para os filtros selecionados.</p>';
                if (paginacao) paginacao.classList.add('hidden');
                return;
            }

            resultados.forEach(med => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${med.nome_comercial || med.nome || 'N/A'}</h3>
                    <p><strong>Princípio Ativo:</strong> ${med.principio_ativo || 'N/A'}</p>
                    <p><strong>Concentração:</strong> ${med.concentracao || 'N/A'}</p>
                    <p><strong>Instruções:</strong> ${med.instrucoes_prescricao || 'N/A'}</p>
                    <span class="tag-forma">${med.forma_farmaceutica || 'Líquido'}</span>
                `;
                gridResultados.appendChild(card);
            });

            if (paginacao) {
                paginacao.classList.remove('hidden');
                labelPagina.textContent = `Página ${pagina}`;
                btnAnterior.disabled = (pagina <= 1);
                btnProxima.disabled = (pagina * limite >= total_encontrados);
            }
        }

        // Executa uma busca inicial assim que a página abre
        executarBusca();
    }
});