// ==============================================================================
// URNA ELETRÔNICA - SCRIPT COMPLETO DE FUNCIONAMENTO E APURAÇÃO
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // BASE DE DADOS E CONTADORES
    let turnoSelecionado = 1; 
    let senhaEncerramento = ""; 
    let candidatos = {}; 
    let votosCandidatos = {}; 
    let votosBrancos = 0;
    let votosNulos = 0;
    let totalGeralVotos = 0;
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
    const cadFoto = document.getElementById('cad-foto');
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

    // AUTENTICAÇÃO DE PRÓXIMO ELEITOR
    const boxAutenticacaoProximo = document.getElementById('box-autenticacao-proximo');
    const senhaConfirmacaoProximo = document.getElementById('senha-confirmacao-proximo');
    const btnValidarProximo = document.getElementById('btn-validar-proximo');
    const btnCancelarProximo = document.getElementById('btn-cancelar-proximo');

    // RELATÓRIO FINAL
    const cardVencedorDestaque = document.getElementById('card-vencedor-destaque');
    const nomeVencedorDestaque = document.getElementById('nome-vencedor-destaque');
    const fotoVencedorDestaque = document.getElementById('foto-vencedor-destaque');
    const alertaSegundoTurno = document.getElementById('alerta-segundo-turno');
    const containerClassificadosSegundoTurno = document.getElementById('container-classificados-segundo-turno');
    const corpoRanking = document.getElementById('corpo-ranking');
    const totalValidos = document.getElementById('total-validos');
    const totalBranco = document.getElementById('total-branco');
    const totalNulos = document.getElementById('total-nulos');
    const totalGeral = document.getElementById('total-geral');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnPdf = document.getElementById('btn-pdf'); 
    const btnProximoEleitor = document.getElementById('btn-proximo-eleitor');
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
        if (telaTurno) telaTurno.classList.add('tela-oculta');
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

            if (subTituloCadastro) {
                if (turnoSelecionado === 2) {
                    subTituloCadastro.innerText = "Segundo Turno: Você deve cadastrar exatamente 2 candidatos.";
                    if (btnIniciarEleicao) btnIniciarEleicao.classList.add('tela-oculta');
                } else {
                    subTituloCadastro.innerText = "Primeiro Turno: Sem limite de candidatos.";
                    if (btnIniciarEleicao) btnIniciarEleicao.classList.remove('tela-oculta');
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
    // ETAPA 1: CADASTRO DE CANDIDATOS COM UPLOAD DE FOTO (FileReader API)
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

            // Lê a imagem selecionada e converte em DataURL (Base64)
            const leitor = new FileReader();
            leitor.onload = function(evento) {
                const fotoBase64 = evento.target.result;

                candidatos[numero] = {
                    nome: nome,
                    foto: fotoBase64
                };
                votosCandidatos[numero] = 0;

                const totalCadastrados = Object.keys(candidatos).length;

                if (msgCadastro) {
                    msgCadastro.style.color = '#27ae60';
                    msgCadastro.innerText = `Candidato ${nome} (${numero}) cadastrado com sucesso!`;
                }

                formCadastro.reset();
                cadNumero.focus();

                if (turnoSelecionado === 2 && totalCadastrados === 2) {
                    setTimeout(() => {
                        alert("Segundo turno: 2 candidatos cadastrados com sucesso. Iniciando votação!");
                        iniciarVotacao();
                    }, 400);
                }
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
    // ETAPA 3: APURAÇÃO E RELATÓRIO COM DESTAQUES VISUAIS (FOTOS E NOME)
    // ==========================================================================
    function gerarRelatorioFinal() {
        if (!corpoRanking) return;
        corpoRanking.innerHTML = ''; 

        if (alertaSegundoTurno) alertaSegundoTurno.classList.add('tela-oculta');
        if (cardVencedorDestaque) cardVencedorDestaque.classList.add('tela-oculta');
        if (containerClassificadosSegundoTurno) containerClassificadosSegundoTurno.innerHTML = '';

        const listaCandidatos = Object.keys(candidatos).map(num => ({
            numero: num,
            nome: candidatos[num].nome,
            foto: candidatos[num].foto,
            votos: votosCandidatos[num] || 0
        })).sort((a, b) => b.votos - a.votos);

        const totalVotosValidos = totalGeralVotos - (votosBrancos + votosNulos);

        let temVencedorPrimeiroTurno = false;
        if (listaCandidatos.length > 0 && totalVotosValidos > 0) {
            const votosMaisVotado = listaCandidatos[0].votos;
            if ((votosMaisVotado / totalVotosValidos) > 0.5) {
                temVencedorPrimeiroTurno = true;
            }
        }

        const eDefinido = (turnoSelecionado === 2 && listaCandidatos.length > 0 && listaCandidatos[0].votos > 0) || (turnoSelecionado === 1 && temVencedorPrimeiroTurno);

        // 1. CASO HAJA CAMPEÃO/ELEITO
        if (eDefinido) {
            const vencedor = listaCandidatos[0];
            if (cardVencedorDestaque && nomeVencedorDestaque && fotoVencedorDestaque) {
                nomeVencedorDestaque.innerText = vencedor.nome;
                fotoVencedorDestaque.src = vencedor.foto;
                cardVencedorDestaque.classList.remove('tela-oculta');
            }
        } 
        // 2. CASO VÁ PARA O SEGUNDO TURNO (LADO A LADO SEM NÚMERO)
        else if (turnoSelecionado === 1 && listaCandidatos.length >= 2) {
            if (alertaSegundoTurno) alertaSegundoTurno.classList.remove('tela-oculta');

            let candidatosClassificados = [];
            
            if (listaCandidatos[0].votos === listaCandidatos[1].votos) {
                const votosEmpatadosTopo = listaCandidatos[0].votos;
                candidatosClassificados = listaCandidatos.filter(c => c.votos === votosEmpatadosTopo);
            } else {
                const votosSegundoLugar = listaCandidatos[1].votos;
                candidatosClassificados = listaCandidatos.filter(c => c.votos >= votosSegundoLugar);
            }

            candidatosSegundoTurno = candidatosClassificados;

            // Renderiza os cards dos classificados lado a lado (Apenas Nome e Foto)
            if (containerClassificadosSegundoTurno) {
                candidatosSegundoTurno.forEach(cand => {
                    const cardItem = document.createElement('div');
                    cardItem.className = 'item-classificado-card';
                    cardItem.innerHTML = `
                        <div class="nome-classificado-card">${cand.nome}</div>
                        <div class="container-foto-classificado">
                            <img src="${cand.foto}" alt="${cand.nome}" class="foto-destaque">
                        </div>
                    `;
                    containerClassificadosSegundoTurno.appendChild(cardItem);
                });
            }
        }

        // Tabela completa de posições
        listaCandidatos.forEach((cand, index) => {
            const percValidos = totalVotosValidos > 0 ? ((cand.votos / totalVotosValidos) * 100).toFixed(1) : "0.0";
            const percGeral = totalGeralVotos > 0 ? ((cand.votos / totalGeralVotos) * 100).toFixed(1) : "0.0";

            const tr = document.createElement('tr');

            const eEleito = (turnoSelecionado === 2 && index === 0 && cand.votos > 0) || (turnoSelecionado === 1 && temVencedorPrimeiroTurno && index === 0);
            const badgeEleito = eEleito ? '<span class="badge-eleito">Eleito</span>' : '';

            tr.innerHTML = `
                <td class="col-posicao"><strong>${index + 1}º</strong></td>
                <td class="col-numero"><strong>${cand.numero}</strong></td>
                <td class="col-nome">${cand.nome} ${badgeEleito}</td>
                <td class="col-votos"><strong>${cand.votos} votos</strong></td>
                <td class="col-porcentagem"><strong>${percValidos}% válidos</strong> (${percGeral}% total)</td>
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
                    foto: cand.foto
                };
                votosCandidatos[cand.numero] = 0;
            });

            if (telaResultado) telaResultado.classList.add('tela-oculta');
            if (telaVotacao) telaVotacao.classList.remove('tela-oculta');

            const nomesAlerta = candidatosSegundoTurno.map(c => `${c.nome} (${c.numero})`).join(', ');
            alert(`2º Turno Iniciado!\nDisputa entre os ${candidatosSegundoTurno.length} candidatos classificados:\n${nomesAlerta}`);

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
