function calcular() {
    let capital = parseFloat(document.getElementById("capital").value) || 0;
    let juros = parseFloat(document.getElementById("juros").value) / 100 || 0;
    let tempo = parseInt(document.getElementById("tempo").value) || 0;
    let aporte = parseFloat(document.getElementById("aporte").value) || 0;

    let montante = capital;
    for (let i = 0; i < tempo; i++) {
        montante += aporte; // Adiciona o aporte mensal
        montante *= (1 + juros); // Aplica os juros compostos
    }

    document.getElementById("resultado").innerText = `R$ ${montante.toFixed(2)}`;
}
