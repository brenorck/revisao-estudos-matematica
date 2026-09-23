/* ========================================
   GEOMETRIA ANALÍTICA — JAVASCRIPT
   ======================================== */

// ================================
// CHECKLIST E PROGRESSO
// ================================

const checkboxes = document.querySelectorAll(
    '.check-item input[type="checkbox"]'
);

const progressBar = document.querySelector('.progress');
const progressText = document.querySelector('.progress-text');

function atualizarProgresso() {
    if (!checkboxes.length) return;

    const concluidos = [...checkboxes].filter(
        checkbox => checkbox.checked
    ).length;

    const porcentagem = Math.round(
        (concluidos / checkboxes.length) * 100
    );

    if (progressBar) {
        progressBar.style.width = `${porcentagem}%`;
    }

    if (progressText) {
        progressText.textContent = `${porcentagem}% concluído`;
    }

    // Salva o progresso no navegador
    localStorage.setItem(
        'geometriaAnaliticaProgresso',
        JSON.stringify(
            [...checkboxes].map(checkbox => checkbox.checked)
        )
    );
}


// ================================
// CARREGAR PROGRESSO SALVO
// ================================

function carregarProgresso() {
    const dados = localStorage.getItem(
        'geometriaAnaliticaProgresso'
    );

    if (!dados) return;

    try {
        const progresso = JSON.parse(dados);

        checkboxes.forEach((checkbox, index) => {
            if (progresso[index] !== undefined) {
                checkbox.checked = progresso[index];
            }
        });

        atualizarProgresso();

    } catch (erro) {
        console.error(
            'Não foi possível carregar o progresso:',
            erro
        );
    }
}


// Atualiza quando marcar/desmarcar
checkboxes.forEach(checkbox => {
    checkbox.addEventListener(
        'change',
        atualizarProgresso
    );
});


// ================================
// QUIZ
// ================================

const questoes = document.querySelectorAll('.questao');

let respostasCorretas = 0;
let questoesRespondidas = 0;


// Cada questão deve possuir:
// data-correta="A"
// data-correta="B"
// data-correta="C"
// ou data-correta="D"

questoes.forEach(questao => {

    const alternativas =
        questao.querySelectorAll('.alternativa');

    const respostaCorreta =
        questao.dataset.correta;

    alternativas.forEach(alternativa => {

        alternativa.addEventListener('click', () => {

            // Impede responder a mesma questão novamente
            if (questao.classList.contains('respondida')) {
                return;
            }

            questao.classList.add('respondida');
            questoesRespondidas++;

            const resposta =
                alternativa.dataset.resposta;

            if (resposta === respostaCorreta) {

                alternativa.classList.add('correta');
                respostasCorretas++;

            } else {

                alternativa.classList.add('errada');

                // Mostra a resposta correta
                alternativas.forEach(opcao => {

                    if (
                        opcao.dataset.resposta ===
                        respostaCorreta
                    ) {
                        opcao.classList.add('correta');
                    }

                });
            }

            atualizarResultado();
        });
    });
});


// ================================
// RESULTADO DO QUIZ
// ================================

function atualizarResultado() {

    const resultado =
        document.querySelector('.resultado');

    const nota =
        document.querySelector('.nota');

    if (!resultado || !nota) return;

    if (questoesRespondidas === questoes.length) {

        const porcentagem = Math.round(
            (respostasCorretas / questoes.length) * 100
        );

        resultado.style.display = 'block';

        nota.textContent =
            `${respostasCorretas}/${questoes.length} — ${porcentagem}%`;

        // Mensagem de acordo com o desempenho
        let mensagem = '';

        if (porcentagem >= 80) {
            mensagem =
                'Excelente! Você está mandando muito bem! 🚀';
        } else if (porcentagem >= 60) {
            mensagem =
                'Bom trabalho! Revise os pontos que errou. 📚';
        } else {
            mensagem =
                'Continue estudando! Você consegue melhorar. 💪';
        }

        resultado.dataset.mensagem = mensagem;

        const mensagemElemento =
            resultado.querySelector('.mensagem');

        if (mensagemElemento) {
            mensagemElemento.textContent = mensagem;
        }
    }
}


// ================================
// BOTÃO REFAZER QUIZ
// ================================

const botaoRefazer =
    document.querySelector('#refazer-quiz');

if (botaoRefazer) {

    botaoRefazer.addEventListener('click', () => {

        respostasCorretas = 0;
        questoesRespondidas = 0;

        questoes.forEach(questao => {

            questao.classList.remove('respondida');

            const alternativas =
                questao.querySelectorAll('.alternativa');

            alternativas.forEach(alternativa => {

                alternativa.classList.remove(
                    'correta',
                    'errada'
                );
            });
        });

        const resultado =
            document.querySelector('.resultado');

        if (resultado) {
            resultado.style.display = 'none';
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', () => {

    carregarProgresso();

    atualizarProgresso();

});
