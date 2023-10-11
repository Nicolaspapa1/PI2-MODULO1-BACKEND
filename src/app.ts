import express from "express";
import oracledb, {Connection, ConnectionAttributes} from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

dotenv.config();

type CustomResponse = {
    status: string;
    message: string;
    payload: any;
};

app.get("/Aeronaves", async(req, res)=>{

  // definindo um objeto de resposta.
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let conn;

  try{
    conn = await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_STR,
  });

  const cmdSelectAero = `SELECT * FROM AERONAVE`

  let resSelect = await conn.execute(cmdSelectAero);

  if(resSelect.rows && resSelect.rows.length > 0){

    const aeronaves = resSelect.rows.map((row: any) => ({
      idAeronave: row[0],
      modeloAeronave: row[1],
      fabricanteAeronave: row[2],
      anoFabricacao: row[3],
      qtdAssento: row[4],
    }));

    cr.status = "SUCCESS";
    cr.message = "Aeronaves recuperadas com sucesso.";
    cr.payload = aeronaves;
  }else{
    cr.message = "Nenhum resultado encontrado para a consulta.";
  }


}catch(e){
  if(e instanceof Error){
    cr.message = e.message;
    console.log(e.message);
  }else{
    cr.message = "Erro ao conectar ao oracle. Sem detalhes";
  }
} finally {
  //fechar a conexao.
  if(conn!== undefined){
    await conn.close();
  }
  res.send(cr);  
}
});

app.put("/Aeronaves", async(req,res)=>{
  
    // para inserir a aeronave temos que receber os dados na requisição.
    const idAeronave = req.body.idAeronave as number;
    const modeloAeronave = req.body.modeloAeronave as string;
    const fabricanteAeronave = req.body.fabricanteAeronave as string;
    const anoFabricacao = req.body.anoFabricacao as number;
    const qtdAssento = req.body.qtdAssento as number;

    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    let conn;
  
    // conectando 
    try{
        conn = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectionString: process.env.ORACLE_STR,
      });
  
      const cmdInsertAero = `INSERT INTO AERONAVE 
      (IDAERONAVE, MODELO, FABRICANTE, ANOFABRICACAO, QTDASSENTOS)
      VALUES
      (:1, :2, :3, :4, :5)`;
  
      const dados = [idAeronave, modeloAeronave, fabricanteAeronave, anoFabricacao, qtdAssento];
      let resInsert = await conn.execute(cmdInsertAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await conn.commit();
    
      // obter a informação de quantas linhas foram inseridas.
      // neste caso precisa ser exatamente 1
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave inserida.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(conn!== undefined){
        await conn.close();
      }
      res.send(cr);  
    }
  });

  app.delete("/Aeronaves", async(req,res)=>{
  
    // para deletar a aeronave temos que receber o idAeronave na requisição.
    const idAeronave = req.body.idAeronave as number;

    // definindo um objeto de resposta.
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    let conn;
  
    // conectando 
    try{
        conn = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectionString: process.env.ORACLE_STR,
      });
  
      const cmdDeleteAero = `DELETE FROM AERONAVE WHERE IDAERONAVE = :1`;

      const dados = [idAeronave];
      let resDelete = await conn.execute(cmdDeleteAero, dados);
      
      // importante: efetuar o commit para gravar no Oracle.
      await conn.commit();
    
      // obter a informação de quantas linhas foram inseridas.
      // neste caso precisa ser exatamente 1
      const rowsInserted = resDelete.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Aeronave Deletada.";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      //fechar a conexao.
      if(conn!== undefined){
        await conn.close();
      }
      res.send(cr);  
    }
  });

app.listen(port, ()=>{
    console.log("Servidor HTTP rodando...");
});