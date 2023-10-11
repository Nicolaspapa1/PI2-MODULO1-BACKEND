"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv_1.default.config();
app.get("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let conn;
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_STR,
        });
        const cmdSelectAero = `SELECT * FROM AERONAVE`;
        let resSelect = yield conn.execute(cmdSelectAero);
        if (resSelect.rows && resSelect.rows.length > 0) {
            const aeronaves = resSelect.rows.map((row) => ({
                idAeronave: row[0],
                modeloAeronave: row[1],
                fabricanteAeronave: row[2],
                anoFabricacao: row[3],
                qtdAssento: row[4],
            }));
            cr.status = "SUCCESS";
            cr.message = "Aeronaves recuperadas com sucesso.";
            cr.payload = aeronaves;
        }
        else {
            cr.message = "Nenhum resultado encontrado para a consulta.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (conn !== undefined) {
            yield conn.close();
        }
        res.send(cr);
    }
}));
app.put("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // para inserir a aeronave temos que receber os dados na requisição.
    const idAeronave = req.body.idAeronave;
    const modeloAeronave = req.body.modeloAeronave;
    const fabricanteAeronave = req.body.fabricanteAeronave;
    const anoFabricacao = req.body.anoFabricacao;
    const qtdAssento = req.body.qtdAssento;
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let conn;
    // conectando 
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_STR,
        });
        const cmdInsertAero = `INSERT INTO AERONAVE 
      (IDAERONAVE, MODELO, FABRICANTE, ANOFABRICACAO, QTDASSENTOS)
      VALUES
      (:1, :2, :3, :4, :5)`;
        const dados = [idAeronave, modeloAeronave, fabricanteAeronave, anoFabricacao, qtdAssento];
        let resInsert = yield conn.execute(cmdInsertAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield conn.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave inserida.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (conn !== undefined) {
            yield conn.close();
        }
        res.send(cr);
    }
}));
app.delete("/Aeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // para deletar a aeronave temos que receber o idAeronave na requisição.
    const idAeronave = req.body.idAeronave;
    // definindo um objeto de resposta.
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let conn;
    // conectando 
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_STR,
        });
        const cmdDeleteAero = `DELETE FROM AERONAVE WHERE IDAERONAVE = :1`;
        const dados = [idAeronave];
        let resDelete = yield conn.execute(cmdDeleteAero, dados);
        // importante: efetuar o commit para gravar no Oracle.
        yield conn.commit();
        // obter a informação de quantas linhas foram inseridas.
        // neste caso precisa ser exatamente 1
        const rowsInserted = resDelete.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave Deletada.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        //fechar a conexao.
        if (conn !== undefined) {
            yield conn.close();
        }
        res.send(cr);
    }
}));
app.listen(port, () => {
    console.log("Servidor HTTP rodando...");
});
