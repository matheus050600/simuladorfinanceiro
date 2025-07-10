document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.calculo-input');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(e) {
        const targetTab = e.currentTarget.dataset.tab;
        tabLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.tab === targetTab) link.classList.add('active');
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab) content.classList.add('active');
        });
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

        document.getElementById('total-gastos-valor').textContent = formatCurrency(totalGastos);
        document.getElementById('disponivel-valor').textContent = formatCurrency(disponivel > 0 ? disponivel : 0);
    }

    inputs.forEach(input => input.addEventListener('input', calcularEAtualizar));
    tabLinks.forEach(link => link.addEventListener('click', switchTab));

    calcularEAtualizar();
});