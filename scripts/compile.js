/*Usamos esto para compilar el smart contract. Mas adelante usamos truffle que nos evita este trabajo */
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const chalk = require('chalk');

const contractPath = path.resolve(__dirname, "../contracts", "UsersContract.sol");

const source = fs.readFileSync(contractPath, 'utf8');

/*Bytecode y ABI */
/*Exportamos lo que queremos importar desde otro modulo */
module.exports = solc.compile(source, 1).contracts[':UsersContract'];

/*Cuando compilamos, obtenemos el Bytecode interpretado por la EVM integrada en cada cliente de ethereum */

/*ABI nos permite describir un contrato y sus funciones. Se usa usualmente con Web3 para instanciar el Smart Contract */