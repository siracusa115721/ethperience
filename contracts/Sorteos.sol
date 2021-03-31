pragma solidity ^0.5.0;

import './SafeMath.sol';

contract Sorteos {
    
    struct Sorteo {
        uint256 id;
        string titulo;
        string descripcion;
        string fechasExp;
        string tipo;
        string precioExp;
        address anunciante;
        bool premium;
        Experiencia experiencia;
    }

    struct Experiencia {
        address ganador;
        uint256 codigoExp;
    }
    
    address[] participantes;
    
    mapping(address => string) public anunciantes;
    
    mapping(address => uint256) public saldoUsuarios;
    
    mapping(address => uint256) public saldoUsuariosPremium;
    
    Sorteo[] sorteos;
    
    mapping(address => mapping(uint256 => uint256)) public participacionesUsuarios;
    
    mapping(uint256=> mapping( address => uint256)) public participacionesSorteo;
    
    mapping(uint256 => uint256) public participaciones;

    mapping(uint256 => address) public ganadores;

    mapping(uint256 => uint256) public codigosExperiencias;
    
    mapping(uint256 => mapping(uint256 => bool)) public experiencias;
    
    uint256 contadorSorteos;
    
    event NuevoSorteo(uint256 id);
    event NuevoAnunciante(address _direccion, string _nombreEmpresa);
    event Participacion(uint256 id, uint256 _tokens);
    
    using SafeMath for uint256;
    
    constructor() public{
        contadorSorteos = 0;
    }
    
    function addAnunciante( string memory _nombreEmpresa) public {
        require(keccak256(abi.encodePacked((anunciantes[msg.sender]))) == keccak256(abi.encodePacked((''))), 'Ya existe un anunciante con esta dirección');
        anunciantes[msg.sender] = _nombreEmpresa;
        emit NuevoAnunciante(msg.sender, _nombreEmpresa);
    }
    
    function addSorteo(string memory _titulo, string memory _descripcion, string memory _fechasExp, string memory _precioExp, string memory _tipo, bool _premium) public {
        require(keccak256(abi.encodePacked((anunciantes[msg.sender]))) != keccak256(abi.encodePacked((''))), 'Tienes que ser anunciante para poder dar de alta un sorteo');
        sorteos.push(Sorteo({
            id: contadorSorteos,
            titulo: _titulo,
            descripcion: _descripcion,
            fechasExp: _fechasExp,
            precioExp: _precioExp,
            tipo: _tipo,
            anunciante: msg.sender,
            premium: _premium,
            experiencia: Experiencia({
                ganador: address(0),
                codigoExp: 0
            })
        }));
        emit NuevoSorteo(contadorSorteos);
        contadorSorteos++;
    }
    
    function participar(uint256 id, uint256 _tokens, bool _premium) public {
        require(_tokens > 0, 'No puede participar con 0 tokens');
        require(_tokens <= 5, 'No puede participar con mas de 5 tokens');
        require(sorteos[id].premium == _premium, 'El tipo de token que quiere usar no puede usarse en este sorteo');
        require(keccak256(abi.encodePacked((anunciantes[msg.sender]))) == keccak256(abi.encodePacked((''))), 'Usted es anunciante, no puede participar en el sorteo.');
        if(_premium == true){
            require(saldoUsuariosPremium[msg.sender] >= _tokens, 'No tiene suficientes tokens para participar');
            saldoUsuariosPremium[msg.sender] = saldoUsuariosPremium[msg.sender].sub(_tokens);
        }else{
            require(saldoUsuarios[msg.sender] >= _tokens, 'No tiene suficientes tokens para participar');
            saldoUsuarios[msg.sender] = saldoUsuarios[msg.sender].sub(_tokens);
        }
        participacionesUsuarios[msg.sender][id] = participacionesUsuarios[msg.sender][id].add(_tokens);
        participacionesSorteo[id][msg.sender] = participacionesSorteo[id][msg.sender].add(_tokens);
        participaciones[id] = participaciones[id].add(_tokens);
        
        participantes.push(msg.sender);
        
        emit Participacion(id, _tokens);
    }
    
    function comprarToken(uint256 tokenStandard, uint256 tokenPremium) public payable {
        require(msg.value > 0, 'La cantidad de ethers tiene que ser mayor a 0');
        require(msg.value >= tokenPremium.mul(0.009 ether), 'El importe es menor que el necesario para adquirir los tokens standard deseados');
        require(msg.value >= tokenStandard.mul(0.0045 ether), 'El importe es menor que el necesario para adquirir los tokens premium deseados');
        saldoUsuarios[msg.sender] += tokenStandard;
        saldoUsuariosPremium[msg.sender] += tokenPremium;
    }
    
    function getSorteos(address _anunciante) public view returns(uint256[] memory, address[] memory, bool[] memory, string memory, address[] memory){
        address[] memory anunciantesArray = new address[](sorteos.length);
        address[] memory ganadoresArray = new address[](sorteos.length);
        uint[] memory ids = new uint[](sorteos.length);
        bool[] memory premiums = new bool[](sorteos.length);
        string memory resultado;
        
        for (uint i = 0; i < sorteos.length; i++) {
            if(
                (_anunciante != address(0x0))&&(sorteos[i].anunciante == _anunciante) ||
                (_anunciante == address(0x0))
            ){
                ids[i] = (sorteos[i].id);
                anunciantesArray[i] = (sorteos[i].anunciante);
                ganadoresArray[i] = (sorteos[i].experiencia.ganador);
                premiums[i] = (sorteos[i].premium);
                resultado = string(abi.encodePacked(
                    resultado, 
                    '{',
                    '"titulo":"', sorteos[i].titulo, '",', 
                    '"descripcion":"', sorteos[i].descripcion, '",',
                    '"fechasExp":"', sorteos[i].fechasExp, '",',
                    '"tipo":"', sorteos[i].tipo, '",',
                    '"precioExp":"', sorteos[i].precioExp
                ));
                if(i == sorteos.length -1){
                    resultado = string(abi.encodePacked(resultado, '"}'));
                }else{
                    resultado = string(abi.encodePacked(resultado, '"}##'));
                }
            }
        }
        return (ids, anunciantesArray, premiums, resultado, ganadoresArray);
    }
    
    function finalizarSorteo(uint256 id) public {
        require(keccak256(abi.encodePacked((anunciantes[msg.sender]))) != keccak256(abi.encodePacked('')), 'Usted no es anunciante, no puede finalizar el sorteo.');
        address _ganador = getGanador(id);
        sorteos[id].experiencia.ganador = _ganador;
        uint256 _codigoExp = block.timestamp;
        sorteos[id].experiencia.codigoExp = _codigoExp;
        
        ganadores[id] = _ganador;
        codigosExperiencias[id] = _codigoExp;
        experiencias[id][_codigoExp] = false;
    }
    
    function canjearExperiencia(uint256 id, uint256 codigoExp) public {
        require(keccak256(abi.encodePacked((sorteos[id].experiencia.codigoExp))) == keccak256(abi.encodePacked((codigoExp))), 'El codigo introducido no coincide con el esperado');
        require(experiencias[id][codigoExp] == false, 'No se puede canjear esta experiencia');
        experiencias[id][codigoExp] = true;
    }
    
    function getGanador(uint256 id) private view returns(address){
        uint256 idRellenar = 0;
        mapping(address => uint256) storage participantesSorteo = participacionesSorteo[id];
        address[] memory sorteo = new address[](participantes.length.mul(5));
        for (uint i = 0; i < participantes.length; i++) {
            if(participantesSorteo[participantes[i]] > 0){
                uint256 tokens = participantesSorteo[participantes[i]];
                for(uint j = 0; j < tokens; j++){
                    sorteo[idRellenar] = participantes[i];
                    idRellenar++;
                }
            }
        }
        
        uint256 idGanador = 0;
        do {                   
         idGanador = random();
        }
        while (idGanador > sorteo.length);
        
        return sorteo[idGanador];
    }
    
    function random() private view returns(uint256){
        return uint256(blockhash(block.timestamp)) % 100;
    }
}
