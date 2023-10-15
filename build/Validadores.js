"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aeronaveValida = void 0;
// neste arquivo colocaremos TODAS as funções de validação para todo tipo de objeto. 
// diferentemente de outras linguagens, podemos fazer uma função
// que possa retornar ou um booleano, ou uma string ou um tipo não definido.
// para que isso? se retornar TRUE no final significa que deu tudo certo. 
// se retornar uma string será o código de erro.
function aeronaveValida(aero) {
    let valida = false;
    let mensagem = "";
    if (aero.idAeronave === undefined) {
        mensagem = "ID não informado";
    }
    if ((aero.idAeronave !== undefined) && (aero.idAeronave < 1)) {
        mensagem = "ID é inválido";
    }
    if (aero.fabricanteAeronave === undefined) {
        mensagem = "Fabricante não informado";
    }
    if (aero.modeloAeronave === undefined) {
        mensagem = "Modelo não informado.";
    }
    if (aero.qtdAssento === undefined) {
        mensagem = "Total de assentos não informado";
    }
    if ((aero.qtdAssento !== undefined) && (aero.qtdAssento < 100 || aero.qtdAssento > 1000)) {
        mensagem = "Total de assentos é inválido";
    }
    if (aero.anoFabricacao === undefined) {
        mensagem = "Ano de fabricação não informado";
    }
    if ((aero.anoFabricacao !== undefined) && (aero.anoFabricacao < 1990 || aero.anoFabricacao > 2026)) {
        mensagem = "Ano de fabricação deve ser entre 1990 e 2026";
    }
    // se passou em toda a validação.
    if (mensagem === "") {
        valida = true;
    }
    return [valida, mensagem];
}
exports.aeronaveValida = aeronaveValida;
