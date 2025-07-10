document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.calculo-input');
    const perfilRadios = document.querySelectorAll('input[name="perfil"]');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    const DADOS_INVESTIMENTOS = {
        conservador: {
            titulo: "Tesouro Selic / CDB 100% CDI",
            desc: "Investimentos de baixo risco, ideais para iniciantes e reserva de emergência.",
            taxa_desc: "Rendimento estimado: <strong>10% ao ano</strong>"
        },
        moderado: {
            titulo: "Carteira Mista (Renda Fixa e Ações)",
            desc: "Combinação entre segurança e crescimento de fundos imobiliários e ações.",
            taxa_desc: "Rendimento estimado: <strong>12% ao ano</strong>"
        },
        agressivo: {
            titulo: "Ações Growth & Criptoativos",
            desc: "Foco em crescimento e valorização com maior risco.",
            taxa_desc: "Rendimento estimado: <strong>15% ao ano</strong>"
        }
    };

    const PERFIL_TAXAS = {
        conservador: { taxa: 0.10, nome: "Conservador" },
        moderado: { taxa: 0.12, nome: "Moderado" },
        agressivo: { taxa: 0.15, nome: "Agressivo" }
    };

    function switchTab(e) {
        const targetTab = e.currentTarget.dataset.tab;
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        e.currentTarget.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calcularEAtualizar() {
        const renda = parseFloat(document.getElementById('renda').value) || 0;
        const gastosInputs = document.querySelectorAll('.gasto');
        let totalGastos = 0;
        gastosInputs.forEach(input => totalGastos += parseFloat(input.value) || 0);
        const disponivel = renda - totalGastos;
        const perfil = document.querySelector('input[name="perfil"]:checked').value;

        document.getElementById('total-gastos-valor').textContent = formatCurrency(totalGastos);
        document.getElementById('disponivel-valor').textContent = formatCurrency(disponivel > 0 ? disponivel : 0);

        gerarSugestoes(disponivel, perfil);
        simularCrescimento(disponivel, perfil);
        atualizarMotivacao(disponivel, renda);
    }

    function gerarSugestoes(valor, perfil) {
        const container = document.getElementById('sugestoes-container');
        if (!container) return;
        let html = '';

        if (valor <= 0) {
            html = `<div class="sugestao-card empty-state">
                        <p>Seus gastos superam sua renda. Ajuste-os na aba Orçamento para ver sugestões.</p>
                    </div>`;
        } else {
            const dado = DADOS_INVESTIMENTOS[perfil];
            html += `<div class="sugestao-card">
                        <h3>${dado.titulo}</h3>
                        <p>${dado.desc}</p>
                        <p class="sugestao-taxa">${dado.taxa_desc}</p>
                     </div>`;
        }
        container.innerHTML = html;
    }

    function simularCrescimento(valor, perfil) {
        const taxaAnual = PERFIL_TAXAS[perfil].taxa;
        const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

        function calcular(meses) {
            const totalInvestido = valor * meses;
            const acumulado = valor * (Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal;
            const retorno = acumulado - totalInvestido;
            return {
                acumulado, investido: totalInvestido,
                retornoPercentual: totalInvestido > 0 ? (retorno / totalInvestido) * 100 : 0
            };
        }

        const periodos = [
            { meses: 12, anoId: '1-ano' },
            { meses: 60, anoId: '5-anos' },
            { meses: 120, anoId: '10-anos' }
        ];

        document.getElementById('taxa-info').innerHTML = `Perfil selecionado: <strong>${PERFIL_TAXAS[perfil].nome}</strong>. Taxa estimada: <strong>${(taxaAnual * 100).toFixed(0)}%</strong>.`;

        periodos.forEach(p => {
            const r = calcular(p.meses);
            document.getElementById(`projecao-${p.anoId}`).textContent = formatCurrency(r.acumulado);
            document.getElementById(`investido-${p.anoId}`).textContent = formatCurrency(r.investido);
            document.getElementById(`retorno-${p.anoId}`).textContent = `${r.retornoPercentual.toFixed(1)}%`;
        });
    }

    function atualizarMotivacao(disponivel, renda) {
        const painel = document.getElementById('motivacao-panel');
        const texto = document.getElementById('motivacao-texto');

        if (disponivel <= 0) {
            texto.textContent = "Organize suas contas! Você consegue.";
            painel.style.background = 'linear-gradient(135deg, #ef5350, #c62828)';
        } else {
            const percentual = renda > 0 ? (disponivel / renda * 100).toFixed(0) : 0;
            if(percentual > 30) {
                texto.textContent = `Você está investindo ${percentual}% da sua renda. Excelente!`;
                painel.style.background = 'linear-gradient(135deg, #66bb6a, #2e7d32)';
            } else if (percentual > 10) {
                texto.textContent = `Muito bem! Você está investindo ${percentual}% da sua renda. Continue!`;
                painel.style.background = 'linear-gradient(135deg, #42a5f5, #1e88e5)';
            } else {
                texto.textContent = "Cada real economizado é um passo para sua liberdade financeira.";
                painel.style.background = 'linear-gradient(135deg, #42a5f5, #1e88e5)';
            }
        }
    }

    inputs.forEach(input => input.addEventListener('input', calcularEAtualizar));
    perfilRadios.forEach(radio => radio.addEventListener('change', calcularEAtualizar));
    tabLinks.forEach(link => link.addEventListener('click', switchTab));
    calcularEAtualizar();
});