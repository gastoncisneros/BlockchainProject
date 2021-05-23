pragma solidity ^0.4.24;

/** Va a tener una coleccion de usuarios que van a poder registrarse de manera unica con su cuenta de Ehtereum, pudiendo elegir un nobmre y un apellido.
El usuario que envia una transaccion lo hara mediante una cuenta que se va a poder registrar solo una vez*/
contract UsersContract{

    struct User{
        string name;
        string apellido;
    }
    /** Por defecto se crean todas las entradas con User vacio, luego se accede a cada uno y se le asigna valores. Asi funciona el mapping.
    Por eso en join (User storage user = users[msg.sender];) podemos asumir que el valor ya existe vacio y luego lo llenamos*/
    mapping(address => User) private users;

    mapping(address => bool) private joinedUsers;

    address[] total;

    /**Es la funcion que ejecutan los usuarios para registrarse */
    function join(string name, string surName)public {
        require(!userJoined(msg.sender), "El usuario ya esta unido");

        /**Storage guarda por referencia, memory por valor entonces no modifica */
        User storage user = users[msg.sender];
        user.name = name;
        user.apellido = surName;

        joinedUsers[msg.sender] = true;

        total.push(msg.sender);
    }

    function getUser(address addr) public view returns(string, string){
        require(joinedUsers[addr], "El usuario no esta registrado");

        /**Usamos memory porque no vamos a almacenar ni cambiar ningun dato, solo vamos a consultar */
        User memory user = users[addr];
        return (user.name, user.apellido);
    }

    /**Checkeamos si el usuario ya esta logueado */
    function userJoined(address addr) private view returns (bool){
        return joinedUsers[addr];
    }

    function totalUsers() public view returns(uint){
        return total.length;
    }

}