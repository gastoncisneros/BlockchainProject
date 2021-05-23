/*Nos permite comprobar que los valores que vamos a recuperar del smart contract coinciden con los que le proveemos */
const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const Web3 = require('web3');

/*Nuestra capa de comunicacion con el servidor(Ganache) */
const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

/*Instancia que apunta al servidor de Ganache */
const web3 = new Web3(provider);

const{interface, bytecode} = require('../scripts/compile');


let accounts;
let usersContract;

/*Para ejecutar el codigo en su interior antes de ejecutar cada test */
/*Tenemos entonces todas las cuentas de ganache y el smart contract desplegado antes de cada test */
beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    usersContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data : bytecode})
    .send({from: accounts[0], gas: '1000000'});
});

describe('The UsersContract', async() => {
    
    it('should deploy', () => {
        console.log(usersContract.options.address);
        assert.ok(usersContract.options.address);
    });

    it('should join a user', async() => {
        let name = "Gaston";
        let surname = "Cisneros";
        await usersContract.methods.join(name, surname).send({from: accounts[0], gas: '500000'});
    });

    it('should retreive a user', async() => {
        let name = "Gaston";
        let surname = "Cisneros";
        /*Las operacion de escritura se llaman con send, especificando desde donde y con que gas limit */
        await usersContract.methods.join(name, surname).send({from: accounts[0], gas: '500000'});

        /**
         * Las operaciones de lectura se llaman con call 
         */
        let user = await usersContract.methods.getUser(accounts[0]).call();

        assert.strictEqual(name, user[0]);
        assert.strictEqual(surname, user[1]);
    });

    it('should not allow joining an account twice', async() => {

        await usersContract.methods.join("Pedro", "Gomez")
        .send({from: accounts[1], gas: '500000'});

        try{            
            await usersContract.methods.join("Ana", "Gomez")
            .send({from: accounts[1], gas: '500000'});

            assert.fail('Same account cant join twice');
        }
        catch(e){
            if(e instanceof AssertionError){
                assert.fail(e.message);
            }
        }
    });

    it('should not allow retrieving a not registered user', async() => {   
        try{            
            await usersContract.methods.getUser(accounts[0]).call();

            assert.fail('user should not be registered');
        }
        catch(e){
            if(e instanceof AssertionError){
                assert.fail(e.message);
            }
        }
    });

    it('should retrieve total registered users', async () => {

        await usersContract.methods.join("Ana", "Gomez")
            .send({ from: accounts[0], gas: '500000' });

        await usersContract.methods.join("Mario", "Bros")
            .send({ from: accounts[1], gas: '500000' });

        let total = await usersContract.methods.totalUsers().call();       
         
        assert.strictEqual(total, 2);        
    });

});