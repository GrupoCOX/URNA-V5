// ==============================================================================
// URNA ELETRÔNICA - SCRIPT COMPLETO DE FUNCIONAMENTO E APURAÇÃO
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // BASE DE DADOS E CONTADORES
    let turnoSelecionado = 1; 
    let senhaEncerramento = ""; // Armazena a senha cadastrada
    let candidatos = {}; 
    let votosCandidatos = {}; 
    let votosBrancos = 0;
    let votosNulos = 0;
    let totalGeralVotos = 0;
    let contadorOrdemCadastro = 0; 
    let candidatosSegundoTurno = []; 

    // ELEMENTOS DAS TELAS INICIAIS
    const telaTurno = document.getElementById('tela-turno');
    const btnPrimeiroTurno = document.getElementById('btn-primeiro-turno');
    const btnSegundoTurno = document.getElementById('btn-segundo-turno');

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

    // CADASTRO
    const formCadastro = document.getElementById('form-cadastro');
    const cadNumero = document.getElementById('cad-numero');
    const cadNome = document.getElementById('cad-nome');
    const msgCadastro = document.getElementById('msg-cadastro');
    const btnIniciarEleicao = document.getElementById('btn-iniciar-eleicao');
    const subTituloCadastro = document.getElementById('sub-titulo-cadastro');

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

    // RELATÓRIO FINAL
    const corpoRanking = document.getElementById('corpo-ranking');
    const totalValidos = document.getElementById('total-validos');
    const totalBranco = document.getElementById('total-branco');
    const totalNulos = document.getElementById('total-nulos');
    const totalGeral = document.getElementById('total-geral');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnPdf = document.getElementById('btn-pdf'); 
    const btnProximoEleitor = document.getElementById('btn-proximo-eleitor');
    const alertaSegundoTurno = document.getElementById('alerta-segundo-turno');
    const btnIrSegundoTurno = document.getElementById('btn-ir-segundo-turno');

    // ==========================================================================
    // ETAPA 0: SELEÇÃO DE TURNO
    // ==========================================================================
    if (btnPrimeiroTurno && btnSegundoTurno) {
        btnPrimeiroTurno.addEventListener('click', () => {
            turnoSelecionado = 1;
            avancarParaSenha();
        });

        btnSegundoTurno.addEventListener('click', () => {
            turnoSelecionado = 2;
            avancarParaSenha();
        });
    }

    function avancarParaSenha() {
        if (telaTurno) telaTurno.style.display = 'none';
        if (telaSenha) telaSenha.style.display = 'block';
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

            if (telaSenha) telaSenha.style.display = 'none';
            if (telaConfiguracao) telaConfiguracao.style.display = 'block';

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

            if (telaConfiguracao) telaConfiguracao.style.display = 'none';
            if (telaCadastro) telaCadastro.style.display = 'block';

            if (subTituloCadastro) {
                if (turnoSelecionado === 2) {
                    subTituloCadastro.innerText = "Segundo Turno: Você deve cadastrar exatamente 2 candidatos.";
                    if (btnIniciarEleicao) btnIniciarEleicao.style.display = 'none';
                } else {
                    subTituloCadastro.innerText = "Primeiro Turno: Sem limite de candidatos.";
                    if (btnIniciarEleicao) btnIniciarEleicao.style.display = 'block';
                }
            }

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

            if (!numero || !nome) {
                if (msgCadastro) {
                    msgCadastro.style.color = '#e74c3c';
                    msgCadastro.innerText = "Por favor, preencha o número e o nome do candidato.";
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

            contadorOrdemCadastro++;

            candidatos[numero] = {
                nome: nome,
                ordemFoto: contadorOrdemCadastro
            };
            votosCandidatos[numero] = 0;

            const totalCadastrados = Object.keys(candidatos).length;

            if (msgCadastro) {
                msgCadastro.style.color = '#27ae60';
                msgCadastro.innerText = `Candidato ${nome} (${numero}) cadastrado com sucesso! Foto: foto/${contadorOrdemCadastro}.jpg`;
            }

            formCadastro.reset();
            cadNumero.focus();

            if (turnoSelecionado === 2 && totalCadastrados === 2) {
                setTimeout(() => {
                    alert("Segundo turno: 2 candidatos cadastrados com sucesso. Iniciando votação!");
                    iniciarVotacao();
                }, 400);
            }
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
        if (telaCadastro) telaCadastro.style.display = 'none';
        if (telaVotacao) telaVotacao.style.display = 'block';
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
                if (votoFoto) votoFoto.style.display = 'none';
                return;
            }

            if (candidatos[numDigitado]) {
                if (votoNome) votoNome.innerText = candidatos[numDigitado].nome;
                if (votoFoto) {
                    votoFoto.src = `foto/${candidatos[numDigitado].ordemFoto}.jpg`;
                    votoFoto.style.display = 'block'; 
                }
            } else {
                if (votoNome) votoNome.innerText = 'VOTO NULO (Candidato não encontrado)';
                if (votoFoto) votoFoto.style.display = 'none'; 
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
            if (votoFoto) votoFoto.style.display = 'none'; 
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

            if (telaVotacao) telaVotacao.style.display = 'none';
            if (telaConcluido) telaConcluido.style.display = 'block';
        });
    }

    function limparCamposVoto() {
        if (votoNumero) {
            votoNumero.value = '';
            votoNumero.disabled = false;
            votoNumero.focus();
        }
        if (votoNome) votoNome.innerText = '...';
        if (votoFoto) votoFoto.style.display = 'none'; 
    }

    if (btnProximoEleitor) {
        btnProximoEleitor.addEventListener('click', (e) => {
            e.preventDefault();
            limparCamposVoto();
            if (telaConcluido) telaConcluido.style.display = 'none';
            if (telaVotacao) telaVotacao.style.display = 'block';
        });
    }

    // ==========================================================================
    // VALIDAÇÃO DE SENHA PARA ENCERRAMENTO
    // ==========================================================================
    if (btnEncerrar) {
        btnEncerrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (boxAutenticacaoEncerrar) {
                boxAutenticacaoEncerrar.style.display = 'block';
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
            if (boxAutenticacaoEncerrar) boxAutenticacaoEncerrar.style.display = 'none';
        });
    }

    if (btnValidarEncerramento) {
        btnValidarEncerramento.addEventListener('click', (e) => {
            e.preventDefault();
            const senhaDigitada = senhaConfirmacao ? senhaConfirmacao.value.trim() : '';

            if (senhaDigitada === senhaEncerramento) {
                if (boxAutenticacaoEncerrar) boxAutenticacaoEncerrar.style.display = 'none';
                if (telaVotacao) telaVotacao.style.display = 'none';
                if (telaConcluido) telaConcluido.style.display = 'none';
                if (telaResultado) telaResultado.style.display = 'block';

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
    // ETAPA 3: APURAÇÃO E RELATÓRIO
    // ==========================================================================
    function gerarRelatorioFinal() {
        if (!corpoRanking) return;
        corpoRanking.innerHTML = ''; 

        if (alertaSegundoTurno) alertaSegundoTurno.style.display = 'none';

        const listaCandidatos = Object.keys(candidatos).map(num => ({
            numero: num,
            nome: candidatos[num].nome,
            votos: votosCandidatos[num] || 0,
            ordemFoto: candidatos[num].ordemFoto
        })).sort((a, b) => b.votos - a.votos);

        const totalVotosValidos = totalGeralVotos - (votosBrancos + votosNulos);

        let temVencedorPrimeiroTurno = false;
        if (listaCandidatos.length > 0 && totalVotosValidos > 0) {
            const votosMaisVotado = listaCandidatos[0].votos;
            if ((votosMaisVotado / totalVotosValidos) > 0.5) {
                temVencedorPrimeiroTurno = true;
            }
        }

        if (turnoSelecionado === 1 && listaCandidatos.length >= 2 && !temVencedorPrimeiroTurno) {
            if (alertaSegundoTurno) alertaSegundoTurno.style.display = 'block';
            candidatosSegundoTurno = [listaCandidatos[0], listaCandidatos[1]];
        }

        listaCandidatos.forEach((cand, index) => {
            const percValidos = totalVotosValidos > 0 ? ((cand.votos / totalVotosValidos) * 100).toFixed(1) : "0.0";
            const percGeral = totalGeralVotos > 0 ? ((cand.votos / totalGeralVotos) * 100).toFixed(1) : "0.0";

            const tr = document.createElement('tr');

            const eEleito = (turnoSelecionado === 2 && index === 0 && cand.votos > 0) || (turnoSelecionado === 1 && temVencedorPrimeiroTurno && index === 0);
            const badgeEleito = eEleito ? '<span class="badge-eleito" style="background: #27ae60; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; margin-left: 10px;">Eleito</span>' : '';

            tr.innerHTML = `
                <td style="padding: 10px; text-align: center;"><strong>${index + 1}º</strong></td>
                <td style="padding: 10px; text-align: center;"><strong>${cand.numero}</strong></td>
                <td style="padding: 10px;">${cand.nome} ${badgeEleito}</td>
                <td style="padding: 10px; text-align: right;"><strong>${cand.votos} votos</strong></td>
                <td style="padding: 10px; text-align: right; color: #27ae60;"><strong>${percValidos}% válidos</strong> (${percGeral}% total)</td>
            `;
            corpoRanking.appendChild(tr);
        });

        const percBrancos = totalGeralVotos > 0 ? ((votosBrancos / totalGeralVotos) * 100).toFixed(1) : "0.0";
        const percNulos = totalGeralVotos > 0 ? ((votosNulos / totalGeralVotos) * 100).toFixed(1) : "0.0";
        const percValidosTotal = totalGeralVotos > 0 ? ((totalVotosValidos / totalGeralVotos) * 100).toFixed(1) : "0.0";

        if (totalValidos) totalValidos.innerText = `${totalVotosValidos} (${percValidosTotal}%)`;
        if (totalBranco) totalBranco.innerText = `${votosBrancos} (${percBrancos}%)`;
        if (totalNulos) totalNulos.innerText = `${votosNulos} (${percNulos}%)`;
        if (totalGeral) totalGeral.innerText = totalGeralVotos;
    }

    if (btnIrSegundoTurno) {
        btnIrSegundoTurno.addEventListener('click', () => {
            votosCandidatos = {};
            votosBrancos = 0;
            votosNulos = 0;
            totalGeralVotos = 0;
            candidatos = {}; 

            turnoSelecionado = 2;

            candidatosSegundoTurno.forEach(cand => {
                candidatos[cand.numero] = {
                    nome: cand.nome,
                    ordemFoto: cand.ordemFoto
                };
                votosCandidatos[cand.numero] = 0;
            });

            if (telaResultado) telaResultado.style.display = 'none';
            if (telaVotacao) telaVotacao.style.display = 'block';

            alert(`2º Turno Iniciado!\nDisputa entre: ${candidatosSegundoTurno[0].nome} (${candidatosSegundoTurno[0].numero}) vs ${candidatosSegundoTurno[1].nome} (${candidatosSegundoTurno[1].numero})`);

            limparCamposVoto();
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