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

                    setTimeout(() => {
                        if (dados.tipo_usuario === 'Farmaceutico') {
                            window.location.href = 'busca.html';
                        } else {
                            mensagemFeedback.style.color = '#ef4444';
                            mensagemFeedback.textContent = 'Apenas farmacêuticos têm permissão de acesso.';
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
        const limitePorPagina = 12;
        let totalRegistrosAtual = 0;

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

            // Busca os itens já fracionados no localStorage
            const historicoFracionados = JSON.parse(localStorage.getItem('medicamentos_fracionados') || '[]');
            const idsFracionados = historicoFracionados.map(item => String(item.id));

            // Filtra os resultados vindos da API excluindo os já fracionados
            const resultadosFiltrados = (resultados || []).filter(med => !idsFracionados.includes(String(med.id)));

            // Calcula o total real do estoque descontando a quantidade de fracionados
            totalRegistrosAtual = Math.max(0, (total_encontrados || 0) - historicoFracionados.length);

            if (infoTotal) {
                infoTotal.textContent = `Total de registros em estoque: ${totalRegistrosAtual}`;
            }

            gridResultados.innerHTML = '';

            if (resultadosFiltrados.length === 0) {
                gridResultados.innerHTML = '<p>Nenhum medicamento encontrado para os filtros selecionados.</p>';
                if (paginacao) paginacao.classList.add('hidden');
                return;
            }

            resultadosFiltrados.forEach(med => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div>
                        <h3>${med.nome_comercial || med.nome || 'N/A'}</h3>
                        <p><strong>Princípio Ativo:</strong> ${med.principio_ativo || 'N/A'}</p>
                        <p><strong>Concentração:</strong> ${med.concentracao || 'N/A'}</p>
                        <p><strong>Instruções:</strong> ${med.instrucoes_prescricao || 'N/A'}</p>
                        <span class="tag-forma">${med.forma_farmaceutica || 'Líquido'}</span>
                    </div>
                    <button class="btn-fracionar">
                        ⚙️ Fracionar Medicamento
                    </button>
                `;

                const btnFracionar = card.querySelector('.btn-fracionar');
                btnFracionar.addEventListener('click', () => {
                    fracionarMedicamentoLocal(med, card);
                });

                gridResultados.appendChild(card);
            });

            if (paginacao) {
                paginacao.classList.remove('hidden');
                labelPagina.textContent = `Página ${pagina}`;
                btnAnterior.disabled = (pagina <= 1);
                btnProxima.disabled = (pagina * limite >= total_encontrados);
            }
        }

        function fracionarMedicamentoLocal(med, cardElement) {
            const nomeMed = med.nome_comercial || med.nome || 'Medicamento';
            const confirmacao = confirm(`Deseja fracionar o medicamento "${nomeMed}"?\nEle será removido do estoque visual e salvo na tela de Fracionados.`);
            
            if (!confirmacao) return;

            const historicoFracionados = JSON.parse(localStorage.getItem('medicamentos_fracionados') || '[]');

            const novoRegistro = {
                id: String(med.id || Date.now()),
                nome_medicamento: nomeMed,
                principio_ativo: med.principio_ativo || 'N/A',
                data_hora: new Date().toLocaleString('pt-BR'),
                responsavel: localStorage.getItem('nome_usuario') || 'Usuário'
            };

            historicoFracionados.push(novoRegistro);
            localStorage.setItem('medicamentos_fracionados', JSON.stringify(historicoFracionados));

            cardElement.style.transition = 'all 0.4s ease';
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'scale(0.8)';

            setTimeout(() => {
                cardElement.remove();

                if (totalRegistrosAtual > 0) {
                    totalRegistrosAtual--;
                    if (infoTotal) {
                        infoTotal.textContent = `Total de registros em estoque: ${totalRegistrosAtual}`;
                    }
                }

                if (gridResultados.children.length === 0) {
                    gridResultados.innerHTML = '<p>Nenhum medicamento restante nesta página.</p>';
                }

            }, 400);

            alert(`Medicamento "${nomeMed}" movido para a tela de Fracionados com sucesso!`);
        }

        executarBusca();
    }

    // ============================================================
    // 4. TELA DE MEDICAMENTOS FRACIONADOS (fracionados.html)
    // ============================================================
    const tabelaFracionadosBody = document.getElementById('tabelaFracionadosBody');
    if (tabelaFracionadosBody) {
        const nomeUsuario = localStorage.getItem('nome_usuario');

        const labelUsuario = document.getElementById('labelUsuario');
        if (labelUsuario) {
            labelUsuario.textContent = `Farm. ${nomeUsuario || 'Usuário'}`;
        }

        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        }

        function carregarFracionadosLocais() {
            const dados = JSON.parse(localStorage.getItem('medicamentos_fracionados') || '[]');
            tabelaFracionadosBody.innerHTML = '';

            if (!dados || dados.length === 0) {
                tabelaFracionadosBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="padding: 20px; text-align: center; color: #888;">
                            Nenhum medicamento fracionado registrado até o momento.
                        </td>
                    </tr>`;
                return;
            }

            dados.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #e5e7eb';
                tr.innerHTML = `
                    <td style="padding: 14px 16px; font-weight: 600; color: #4a4a4a;">${item.nome_medicamento || 'N/A'}</td>
                    <td style="padding: 14px 16px; color: #6b7280;">${item.principio_ativo || 'N/A'}</td>
                    <td style="padding: 14px 16px; color: #6b7280;">${item.data_hora}</td>
                    <td style="padding: 14px 16px; color: #4a4a4a; font-weight: 500;">Farm. ${item.responsavel}</td>
                    <td style="padding: 14px 16px; text-align: center;">
                        <button class="btn-primary btn-relatorio-single" style="padding: 6px 12px; font-size: 12px;">
                            📋 Ver Relatório
                        </button>
                    </td>
                `;

                const btnRelatorio = tr.querySelector('.btn-relatorio-single');
                btnRelatorio.addEventListener('click', () => {
                    gerarRelatorioIndividual(item);
                });

                tabelaFracionadosBody.appendChild(tr);
            });
        }

        function gerarRelatorioIndividual(item) {
            const janelaImpressao = window.open('', '_blank');

            janelaImpressao.document.write(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <title>Relatório de Fracionamento - ${item.nome_medicamento}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                        .header { border-bottom: 2px solid #278527; padding-bottom: 10px; margin-bottom: 20px; }
                        .header h1 { color: #278527; margin: 0; font-size: 22px; }
                        .box { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 20px; }
                        .box p { margin: 8px 0; }
                        .btn-print { margin-top: 25px; padding: 10px 20px; background-color: #278527; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
                        @media print { .btn-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>PharmaFrac — Relatório de Fracionamento</h1>
                    </div>
                    <div class="box">
                        <p><strong>Medicamento:</strong> ${item.nome_medicamento}</p>
                        <p><strong>Princípio Ativo:</strong> ${item.principio_ativo}</p>
                        <p><strong>Data e Hora do Processo:</strong> ${item.data_hora}</p>
                        <p><strong>Responsável Operacional:</strong> Farm. ${item.responsavel}</p>
                        <p><strong>Status do Registro:</strong> Fracionado / Liberado para Dispensação</p>
                    </div>
                    <button class="btn-print" onclick="window.print()">🖨️ Imprimir Relatório</button>
                </body>
                </html>
            `);
            janelaImpressao.document.close();
        }

        const btnImprimirGeral = document.getElementById('btnImprimirRelatorioGeral');
        if (btnImprimirGeral) {
            btnImprimirGeral.addEventListener('click', () => window.print());
        }

        carregarFracionadosLocais();
    }
});