/***
 * Esse arquivo é muito interessante. 
 * Nele criamos uma constante chamada oraConnAttribs. 
 * Sempre que desejarmos usar ela em qualquer código, basta importarmos ;-) 
 * Chique né?
 */

import { ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

dotenv.config();

export const oraConnAttribs: ConnectionAttributes = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_STR,
}