// ==============================================================================
// URNA ELETRÔNICA - SCRIPT COMPLETO DE FUNCIONAMENTO E APURAÇÃO (TURNO ÚNICO)
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // BASE DE DADOS E CONFIGURAÇÕES
    let tipoUrna = 'padrao'; // 'padrao' ou 'mestra'
    let numeroUrnaPadrao = 1;
    let qtdUrnasAuxiliares = 4;

    let senhaEncerramento = ""; 
    let candidatos = {}; 
    let votosCandidatos = {}; 
    let votosBrancos = 0;
    let votosNulos = 0;
    let totalGeralVotos = 0;

    // ELEMENTOS DE SELEÇÃO DO TIPO DE URNA
    const telaTipoUrna = document.getElementById('tela-tipo-urna');
    const instrucaoTipoUrna = document.getElementById('instrucao-tipo-urna');
    const containerBotoesTipoUrna = document.getElementById('container-botoes-tipo-urna');
    const btnUrnaPadrao = document.getElementById('btn-urna-padrao');
    const btnUrnaMestra = document.getElementById('btn-urna-mestra');
    const boxConfigUrnaPadrao = document.getElementById('box-config-urna-padrao');
    const boxConfigUrnaMestra = document.getElementById('box-config-urna-mestra');
    const cfgNumeroUrna = document.getElementById('cfg-numero-urna');
    const cfgQtdUrnasAuxiliares = document.getElementById('cfg-qtd-urnas-auxiliares');
    const btnConfirmarPadrao = document.getElementById('btn-confirmar-padrao');
    const btnConfirmarMestra = document.getElementById('btn-confirmar-mestra');

    // TELAS DE SEGURANÇA E CONFIGURAÇÃO
    const telaSenha = document.getElementById('tela-senha');
    const formSenha = document.getElementById('form-senha');
    const cfgSenha = document.getElementById('cfg-senha');

    const telaConfiguracao = document.getElementById('tela-configuracao');
    const formConfiguracao = document.getElementById('form-configuracao'); 
    const cfgTopo = document.getElementById('cfg-topo');
    const cfgRodape = document.getElementById('cfg-rodape');
    const textoTopo = document.getElementById('texto-topo');
    const textoRodape = document.getElementById('texto-rodape');

    // TELAS
    const telaCadastro = document.getElementById('tela-cadastro');
    const telaVotacao = document.getElementById('tela-votacao');
    const telaConcluido = document.getElementById('tela-concluido');
    const telaResultado = document.getElementById('tela-resultado');
    const telaConsolidacaoMestra = document.getElementById('tela-consolidação-mestra');

    // CADASTRO
    const formCadastro = document.getElementById('form-cadastro');
    const cadNumero = document.getElementById('cad-numero');
    const cadNome = document.getElementById('cad-nome');
    const cadFoto = document.getElementById('cad-foto');
    const msgCadastro = document.getElementById('msg-cadastro');
    const btnIniciarEleicao = document.getElementById('btn-iniciar-eleicao');

    // VOTAÇÃO
    const votoNumero = document.getElementById('voto-numero');
    const votoNome = document.getElementById('voto-nome');
    const votoFoto = document.getElementById('voto-foto'); 
    const btnBranco = document.getElementById('btn-branco');
    const btnCorrige = document.getElementById('btn-corrige');
    const btnConfirma = document.getElementById('btn-confirma');
    const btnEncerrar = document.getElementById('btn-encerrar');

    // AUTENTICAÇÃO DE ENCERRAMENTO
    const boxAutenticacaoEncerrar = document.getElementById('box-autenticacao-encerrar');
    const senhaConfirmacao = document.getElementById('senha-confirmacao');
    const btnValidarEncerramento = document.getElementById('btn-validar-encerramento');
    const btnCancelarEncerramento = document.getElementById('btn-cancelar-encerramento');

    // AUTENTICAÇÃO DE PRÓXIMO ELEITOR
    const boxAutenticacaoProximo = document.getElementById('box-autenticacao-proximo');
    const senhaConfirmacaoProximo = document.getElementById('senha-confirmacao-proximo');
    const btnValidarProximo = document.getElementById('btn-validar-proximo');
    const btnCancelarProximo = document.getElementById('btn-cancelar-proximo');

    // RELATÓRIO FINAL E CONSOLIDAÇÃO
    const tituloRelatorioTipo = document.getElementById('titulo-relatorio-tipo');
    const cardVencedorDestaque = document.getElementById('card-vencedor-destaque');
    const nomeVencedorDestaque = document.getElementById('nome-vencedor-destaque');
    const fotoVencedorDestaque = document.getElementById('foto-vencedor-destaque');
    const corpoRanking = document.getElementById('corpo-ranking');
    const totalValidos = document.getElementById('total-validos');
    const totalBranco = document.getElementById('total-branco');
    const totalNulos = document.getElementById('total-nulos');
    const totalGeral = document.getElementById('total-geral');
    const containerBtnApuracaoMestra = document.getElementById('container-btn-apuracao-mestra');
    const btnIrApuracaoMestra = document.getElementById('btn-ir-apuracao-mestra');
    const containerEntradasUrnasPadrao = document.getElementById('container-entradas-urnas-padrao');
    const btnCalcularResultadoGeral = document.getElementById('btn-calcular-resultado-geral');
    const btnVoltarRelatorioMestra = document.getElementById('btn-voltar-relatorio-mestra');

    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnPdf = document.getElementById('btn-pdf'); 
    const btnProximoEleitor = document.getElementById('btn-proximo-eleitor');

    // ==========================================================================
    // ETAPA PRELIMINAR: SELEÇÃO DE URNA PADRÃO VS MESTRA
    // ==========================================================================
    if (btnUrnaPadrao && btnUrnaMestra) {
        btnUrnaPadrao.addEventListener('click', () => {
            tipoUrna = 'padrao';
            if (containerBotoesTipoUrna) containerBotoesTipoUrna.classList.add('tela-oculta');
            if (instrucaoTipoUrna) instrucaoTipoUrna.innerText = "Configuração da Urna Padrão (Seccional):";
            if (boxConfigUrnaPadrao) boxConfigUrnaPadrao.classList.remove('tela-oculta');
            if (boxConfigUrnaMestra) boxConfigUrnaMestra.classList.add('tela-oculta');
        });

        btnUrnaMestra.addEventListener('click', () => {
            tipoUrna = 'mestra';
            if (containerBotoesTipoUrna) containerBotoesTipoUrna.classList.add('tela-oculta');
            if (instrucaoTipoUrna) instrucaoTipoUrna.innerText = "Configuração da Urna Mestra (Consolidadora):";
            if (boxConfigUrnaMestra) boxConfigUrnaMestra.classList.remove('tela-oculta');
            if (boxConfigUrnaPadrao) boxConfigUrnaPadrao.classList.add('tela-oculta');
        });
    }

    if (btnConfirmarPadrao) {
        btnConfirmarPadrao.addEventListener('click', () => {
            const num = parseInt(cfgNumeroUrna.value, 10);
            numeroUrnaPadrao = num > 0 ? num : 1;
            avancarParaSenha();
        });
    }

    if (btnConfirmarMestra) {
        btnConfirmarMestra.addEventListener('click', () => {
            const qtd = parseInt(cfgQtdUrnasAuxiliares.value, 10);
            qtdUrnasAuxiliares = qtd > 0 ? qtd : 1;
            avancarParaSenha();
        });
    }

    function avancarParaSenha() {
        if (telaTipoUrna) telaTipoUrna.classList.add('tela-oculta');
        if (telaSenha) telaSenha.classList.remove('tela-oculta');
        setTimeout(() => { if (cfgSenha) cfgSenha.focus(); }, 50);
    }

    // ==========================================================================
    // ETAPA 0.1: CADASTRO DA SENHA DE SEGURANÇA
    // ==========================================================================
    if (formSenha) {
        formSenha.addEventListener('submit', (e) => {
            e.preventDefault();
            const senhaDigitada = cfgSenha.value.trim();

            if (!senhaDigitada) {
                alert("Por favor, digite uma senha válida.");
                return;
            }

            senhaEncerramento = senhaDigitada;

            if (telaSenha) telaSenha.classList.add('tela-oculta');
            if (telaConfiguracao) telaConfiguracao.classList.remove('tela-oculta');

            setTimeout(() => { if (cfgTopo) cfgTopo.focus(); }, 50);
        });
    }

    // ==========================================================================
    // ETAPA 0.2: CONFIGURAÇÃO DE TEXTOS
    // ==========================================================================
    if (formConfiguracao) {
        formConfiguracao.addEventListener('submit', (e) => {
            e.preventDefault();

            if (textoTopo && cfgTopo) textoTopo.innerText = cfgTopo.value.trim().toUpperCase();
            if (textoRodape && cfgRodape) textoRodape.innerText = cfgRodape.value.trim().toUpperCase();

            if (telaConfiguracao) telaConfiguracao.classList.add('tela-oculta');
            if (telaCadastro) telaCadastro.classList.remove('tela-oculta');

            setTimeout(() => { if (cadNumero) cadNumero.focus(); }, 50);
        });
    }

    // ==========================================================================
    // SOM DA URNA ("PILILI")
    // ==========================================================================
    function tocarSomUrna() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        try {
            const ctx = new AudioContext();
            const tempoAtual = ctx.currentTime;
            const oscilador = ctx.createOscillator();
            const ganho = ctx.createGain();

            oscilador.type = 'square'; 

            oscilador.frequency.setValueAtTime(1050, tempoAtual);         
            oscilador.frequency.setValueAtTime(1175, tempoAtual + 0.07);   
            oscilador.frequency.setValueAtTime(1320, tempoAtual + 0.14);   
            oscilador.frequency.setValueAtTime(940, tempoAtual + 0.22);    

            ganho.gain.setValueAtTime(0, tempoAtual);
            ganho.gain.linearRampToValueAtTime(0.2, tempoAtual + 0.005);
            ganho.gain.setValueAtTime(0.2, tempoAtual + 1.15);
            ganho.gain.linearRampToValueAtTime(0, tempoAtual + 1.16);

            oscilador.connect(ganho);
            ganho.connect(ctx.destination);

            oscilador.start(tempoAtual);
            oscilador.stop(tempoAtual + 1.17); 
        } catch (err) {
            console.warn("Áudio não suportado:", err);
        }
    }

    // ==========================================================================
    // ETAPA 1: CADASTRO DE CANDIDATOS
    // ==========================================================================
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();

            const numero = cadNumero.value.trim();
            const nome = cadNome.value.trim();
            const arquivoFoto = cadFoto.files[0];

            if (!numero || !nome || !arquivoFoto) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Por favor, preencha todos os campos e selecione uma foto.";
                }
                return;
            }

            if (candidatos[numero]) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Este número de candidato já foi registrado.";
                }
                return;
            }

            const leitor = new FileReader();
            leitor.onload = function(evento) {
                const fotoBase64 = evento.target.result;

                candidatos[numero] = {
                    nome: nome,
                    foto: fotoBase64
                };
                votosCandidatos[numero] = 0;

                if (msgCadastro) {
                    msgCadastro.style.color = '#27ae60';
                    msgCadastro.innerText = `Candidato ${nome} (${numero}) cadastrado com sucesso!`;
                }

                formCadastro.reset();
                cadNumero.focus();
            };

            leitor.readAsDataURL(arquivoFoto);
        });
    }

    if (btnIniciarEleicao) {
        btnIniciarEleicao.addEventListener('click', (e) => {
            e.preventDefault();
            if (Object.keys(candidatos).length === 0) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Cadastre pelo menos 1 candidato antes de iniciar!";
                }
                return;
            }
            iniciarVotacao();
        });
    }

    function iniciarVotacao() {
        if (telaCadastro) telaCadastro.classList.add('tela-oculta');
        if (telaVotacao) telaVotacao.classList.remove('tela-oculta');
        limparCamposVoto();
    }

    // ==========================================================================
    // ETAPA 2: VOTAÇÃO
    // ==========================================================================
    if (votoNumero) {
        votoNumero.addEventListener('input', () => {
            const numDigitado = votoNumero.value.trim();

            if (numDigitado === '') {
                if (votoNome) votoNome.innerText = '...';
                if (votoFoto) {
                    votoFoto.src = '';
                    votoFoto.classList.add('tela-oculta');
                }
                return;
            }

            if (candidatos[numDigitado]) {
                if (votoNome) votoNome.innerText = candidatos[numDigitado].nome;
                if (votoFoto) {
                    votoFoto.src = candidatos[numDigitado].foto;
                    votoFoto.classList.remove('tela-oculta');
                }
            } else {
                if (votoNome) votoNome.innerText = 'VOTO NULO (Candidato não encontrado)';
                if (votoFoto) {
                    votoFoto.src = '';
                    votoFoto.classList.add('tela-oculta');
                }
            }
        });
    }

    if (btnBranco) {
        btnBranco.addEventListener('click', (e) => {
            e.preventDefault();
            if (votoNumero) {
                votoNumero.value = '';
                votoNumero.disabled = true;
            }
            if (votoNome) votoNome.innerText = 'VOTO EM BRANCO';
            if (votoFoto) {
                votoFoto.src = '';
                votoFoto.classList.add('tela-oculta');
            }
        });
    }

    if (btnCorrige) {
        btnCorrige.addEventListener('click', (e) => {
            e.preventDefault();
            limparCamposVoto();
        });
    }

    if (btnConfirma) {
        btnConfirma.addEventListener('click', (e) => {
            e.preventDefault();
            const numVoto = votoNumero ? votoNumero.value.trim() : '';
            const textoNome = votoNome ? votoNome.innerText : '';

            if (numVoto === '' && textoNome === '...') {
                alert('Por favor, digite um número ou vote em Branco antes de confirmar.');
                return;
            }

            if (textoNome === 'VOTO EM BRANCO') {
                votosBrancos++;
            } else if (candidatos[numVoto]) {
                votosCandidatos[numVoto]++;
            } else {
                votosNulos++;
            }

            totalGeralVotos++;
            tocarSomUrna();

            if (telaVotacao) telaVotacao.classList.add('tela-oculta');
            if (telaConcluido) telaConcluido.classList.remove('tela-oculta');

            if (boxAutenticacaoProximo) boxAutenticacaoProximo.classList.add('tela-oculta');
            if (btnProximoEleitor) btnProximoEleitor.classList.remove('tela-oculta');
        });
    }

    function limparCamposVoto() {
        if (votoNumero) {
            votoNumero.value = '';
            votoNumero.disabled = false;
            votoNumero.focus();
        }
        if (votoNome) votoNome.innerText = '...';
        if (votoFoto) {
            votoFoto.src = '';
            votoFoto.classList.add('tela-oculta');
        }
    }

    // ==========================================================================
    // VALIDAÇÃO DE SENHA PARA PRÓXIMO ELEITOR
    // ==========================================================================
    if (btnProximoEleitor) {
        btnProximoEleitor.addEventListener('click', (e) => {
            e.preventDefault();
            if (boxAutenticacaoProximo) {
                boxAutenticacaoProximo.classList.remove('tela-oculta');
                if (btnProximoEleitor) btnProximoEleitor.classList.add('tela-oculta');
                if (senhaConfirmacaoProximo) {
                    senhaConfirmacaoProximo.value = '';
                    senhaConfirmacaoProximo.focus();
                }
            }
        });
    }

    if (btnCancelarProximo) {
        btnCancelarProximo.addEventListener('click', (e) => {
            e.preventDefault();
            if (boxAutenticacaoProximo) boxAutenticacaoProximo.classList.add('tela-oculta');
            if (btnProximoEleitor) btnProximoEleitor.classList.remove('tela-oculta');
        });
    }

    if (btnValidarProximo) {
        btnValidarProximo.addEventListener('click', (e) => {
            e.preventDefault();
            const senhaDigitada = senhaConfirmacaoProximo ? senhaConfirmacaoProximo.value.trim() : '';

            if (senhaDigitada === senhaEncerramento) {
                if (boxAutenticacaoProximo) boxAutenticacaoProximo.classList.add('tela-oculta');
                limparCamposVoto();
                if (telaConcluido) telaConcluido.classList.add('tela-oculta');
                if (telaVotacao) telaVotacao.classList.remove('tela-oculta');
            } else {
                alert("Senha incorreta! Apenas o mesário pode liberar o próximo voto.");
                if (senhaConfirmacaoProximo) {
                    senhaConfirmacaoProximo.value = '';
                    senhaConfirmacaoProximo.focus();
                }
            }
        });
    }

    // ==========================================================================
    // VALIDAÇÃO DE SENHA PARA ENCERRAMENTO
    // ==========================================================================
    if (btnEncerrar) {
        btnEncerrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (boxAutenticacaoEncerrar) {
                boxAutenticacaoEncerrar.classList.remove('tela-oculta');
                if (senhaConfirmacao) {
                    senhaConfirmacao.value = '';
                    senhaConfirmacao.focus();
                }
            }
        });
    }

    if (btnCancelarEncerramento) {
        btnCancelarEncerramento.addEventListener('click', (e) => {
            e.preventDefault();
            if (boxAutenticacaoEncerrar) boxAutenticacaoEncerrar.classList.add('tela-oculta');
        });
    }

    if (btnValidarEncerramento) {
        btnValidarEncerramento.addEventListener('click', (e) => {
            e.preventDefault();
            const senhaDigitada = senhaConfirmacao ? senhaConfirmacao.value.trim() : '';

            if (senhaDigitada === senhaEncerramento) {
                if (boxAutenticacaoEncerrar) boxAutenticacaoEncerrar.classList.add('tela-oculta');
                if (telaVotacao) telaVotacao.classList.add('tela-oculta');
                if (telaConcluido) telaConcluido.classList.add('tela-oculta');
                if (telaResultado) telaResultado.classList.remove('tela-oculta');

                gerarRelatorioFinal();
            } else {
                alert("Senha incorreta! Não foi possível encerrar a votação.");
                if (senhaConfirmacao) {
                    senhaConfirmacao.value = '';
                    senhaConfirmacao.focus();
                }
            }
        });
    }

    // ==========================================================================
    // ETAPA 3: APURAÇÃO E RELATÓRIO DA URNA (TURNO ÚNICO)
    // ==========================================================================
    function gerarRelatorioFinal(votosConsolidadosTotais = null) {
        if (!corpoRanking) return;
        corpoRanking.innerHTML = ''; 

        if (cardVencedorDestaque) cardVencedorDestaque.classList.add('tela-oculta');
        if (containerBtnApuracaoMestra) containerBtnApuracaoMestra.classList.add('tela-oculta');

        if (tipoUrna === 'padrao') {
            if (tituloRelatorioTipo) tituloRelatorioTipo.innerText = `Boletim da Urna Seccional Nº ${numeroUrnaPadrao}`;
        } else {
            if (tituloRelatorioTipo) tituloRelatorioTipo.innerText = votosConsolidadosTotais ? "Resultado Geral Consolidado da Eleição" : "Boletim Local da Urna Mestra";
            if (!votosConsolidadosTotais && containerBtnApuracaoMestra) {
                containerBtnApuracaoMestra.classList.remove('tela-oculta');
            }
        }

        const contagemCandidatos = votosConsolidadosTotais ? votosConsolidadosTotais.candidatos : votosCandidatos;
        const contagemBrancos = votosConsolidadosTotais ? votosConsolidadosTotais.brancos : votosBrancos;
        const contagemNulos = votosConsolidadosTotais ? votosConsolidadosTotais.nulos : votosNulos;
        const contagemTotal = votosConsolidadosTotais ? votosConsolidadosTotais.total : totalGeralVotos;

        const listaCandidatos = Object.keys(candidatos).map(num => ({
            numero: num,
            nome: candidatos[num].nome,
            foto: candidatos[num].foto,
            votos: contagemCandidatos[num] || 0
        })).sort((a, b) => b.votos - a.votos);

        const totalVotosValidos = contagemTotal - (contagemBrancos + contagemNulos);

        const eUrnaPadraoSemConsolidar = (tipoUrna === 'padrao') || (tipoUrna === 'mestra' && !votosConsolidadosTotais);

        // Se for a Urna Mestra após a consolidação geral, exibe imediatamente o vencedor absoluto (1º lugar)
        if (!eUrnaPadraoSemConsolidar && listaCandidatos.length > 0) {
            const vencedor = listaCandidatos[0];
            if (cardVencedorDestaque && nomeVencedorDestaque && fotoVencedorDestaque) {
                nomeVencedorDestaque.innerText = vencedor.nome;
                fotoVencedorDestaque.src = vencedor.foto;
                cardVencedorDestaque.classList.remove('tela-oculta');
            }
        }

        listaCandidatos.forEach((cand, index) => {
            const percValidos = totalVotosValidos > 0 ? ((cand.votos / totalVotosValidos) * 100).toFixed(1) : "0.0";
            const percGeral = contagemTotal > 0 ? ((cand.votos / contagemTotal) * 100).toFixed(1) : "0.0";

            const tr = document.createElement('tr');

            // O mais votado absoluto é considerado o eleito na apuração final consolidada da Urna Mestra
            const eEleito = !eUrnaPadraoSemConsolidar && index === 0 && cand.votos > 0;
            const badgeEleito = eEleito ? '<span class="badge-eleito">Eleito</span>' : '';

            const colunaEstatistica = eUrnaPadraoSemConsolidar 
                ? `<strong>${cand.votos} votos válidos</strong>` 
                : `<strong>${percValidos}% válidos</strong> (${percGeral}% total)`;

            tr.innerHTML = `
                <td class="col-posicao"><strong>${index + 1}º</strong></td>
                <td class="col-numero"><strong>${cand.numero}</strong></td>
                <td class="col-nome">${cand.nome} ${badgeEleito}</td>
                <td class="col-votos"><strong>${cand.votos} votos</strong></td>
                <td class="col-porcentagem">${colunaEstatistica}</td>
            `;
            corpoRanking.appendChild(tr);
        });

        const percBrancos = contagemTotal > 0 ? ((contagemBrancos / contagemTotal) * 100).toFixed(1) : "0.0";
        const percNulos = contagemTotal > 0 ? ((contagemNulos / contagemTotal) * 100).toFixed(1) : "0.0";
        const percValidosTotal = contagemTotal > 0 ? ((totalVotosValidos / contagemTotal) * 100).toFixed(1) : "0.0";

        if (totalValidos) totalValidos.innerText = eUrnaPadraoSemConsolidar ? totalVotosValidos : `${totalVotosValidos} (${percValidosTotal}%)`;
        if (totalBranco) totalBranco.innerText = eUrnaPadraoSemConsolidar ? contagemBrancos : `${contagemBrancos} (${percBrancos}%)`;
        if (totalNulos) totalNulos.innerText = eUrnaPadraoSemConsolidar ? contagemNulos : `${contagemNulos} (${percNulos}%)`;
        if (totalGeral) totalGeral.innerText = contagemTotal;
    }

    // ==========================================================================
    // ETAPA 4: TELA DE CONSOLIDAÇÃO GERAL (URNA MESTRA)
    // ==========================================================================
    if (btnIrApuracaoMestra) {
        btnIrApuracaoMestra.addEventListener('click', () => {
            if (telaResultado) telaResultado.classList.add('tela-oculta');
            if (telaConsolidacaoMestra) telaConsolidacaoMestra.classList.remove('tela-oculta');

            if (containerEntradasUrnasPadrao) {
                containerEntradasUrnasPadrao.innerHTML = '';

                for (let i = 1; i <= qtdUrnasAuxiliares; i++) {
                    const cardUrna = document.createElement('div');
                    cardUrna.className = 'card-urna-seccional-input';

                    let inputsCandidatosHTML = '';
                    Object.keys(candidatos).forEach(num => {
                        inputsCandidatosHTML += `
                            <div class="campo-form">
                                <label>Votos para ${candidatos[num].nome} (Nº ${num}):</label>
                                <input type="number" class="voto-aux-cand" data-urna="${i}" data-numero="${num}" min="0" value="0">
                            </div>
                        `;
                    });

                    cardUrna.innerHTML = `
                        <h4>Boletim de Urna Nº ${i}</h4>
                        <div class="grid-inputs-candidatos">
                            ${inputsCandidatosHTML}
                            <div class="campo-form">
                                <label>Votos em Branco:</label>
                                <input type="number" class="voto-aux-branco" data-urna="${i}" min="0" value="0">
                            </div>
                            <div class="campo-form">
                                <label>Votos Nulos:</label>
                                <input type="number" class="voto-aux-nulo" data-urna="${i}" min="0" value="0">
                            </div>
                        </div>
                    `;
                    containerEntradasUrnasPadrao.appendChild(cardUrna);
                }
            }
        });
    }

    if (btnVoltarRelatorioMestra) {
        btnVoltarRelatorioMestra.addEventListener('click', () => {
            if (telaConsolidacaoMestra) telaConsolidacaoMestra.classList.add('tela-oculta');
            if (telaResultado) telaResultado.classList.remove('tela-oculta');
        });
    }

    if (btnCalcularResultadoGeral) {
        btnCalcularResultadoGeral.addEventListener('click', () => {
            let somatorioCandidatos = { ...votosCandidatos };
            let somatorioBrancos = votosBrancos;
            let somatorioNulos = votosNulos;
            let somatorioTotal = totalGeralVotos;

            const inputsCand = document.querySelectorAll('.voto-aux-cand');
            inputsCand.forEach(input => {
                const num = input.getAttribute('data-numero');
                const qtd = parseInt(input.value, 10) || 0;
                somatorioCandidatos[num] = (somatorioCandidatos[num] || 0) + qtd;
                somatorioTotal += qtd;
            });

            const inputsBranco = document.querySelectorAll('.voto-aux-branco');
            inputsBranco.forEach(input => {
                const qtd = parseInt(input.value, 10) || 0;
                somatorioBrancos += qtd;
                somatorioTotal += qtd;
            });

            const inputsNulo = document.querySelectorAll('.voto-aux-nulo');
            inputsNulo.forEach(input => {
                const qtd = parseInt(input.value, 10) || 0;
                somatorioNulos += qtd;
                somatorioTotal += qtd;
            });

            if (telaConsolidacaoMestra) telaConsolidacaoMestra.classList.add('tela-oculta');
            if (telaResultado) telaResultado.classList.remove('tela-oculta');

            gerarRelatorioFinal({
                candidatos: somatorioCandidatos,
                brancos: somatorioBrancos,
                nulos: somatorioNulos,
                total: somatorioTotal
            });
        });
    }

    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            window.location.reload();
        });
    }

    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            window.print();
        });
    }
});
