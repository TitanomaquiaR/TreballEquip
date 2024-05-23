document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    var options = JSON.parse(localStorage.options);
    const initialGold = options.goldini || 0;
    const godsPlayers = JSON.parse(localStorage.getItem('godsPlayers')) || [];
    const titansPlayers = JSON.parse(localStorage.getItem('titansPlayers')) || [];
    let currentPlayerIndex = 0;
    let turn = 'god'; // Alterna entre 'god' y 'titan'

    // Inicializa las posiciones de los jugadores, monedas y piezas de armadura
    const gods = godsPlayers.map(player => ({ ...player, position: 1, gold: initialGold, armorPieces: 0 }));
    const titans = titansPlayers.map(player => ({ ...player, position: 1, gold: initialGold, armorPieces: 0 }));

    const godsSection = document.getElementById('gods-section');
    const titansSection = document.getElementById('titans-section');
    const messageElement = document.getElementById('message');
    const rollDiceButton = document.getElementById('roll-dice');

    const duelModal = document.getElementById('duel-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const startDuelButton = document.getElementById('start-duel');
    const duelBetInput = document.getElementById('duel-bet');
    const duelResult = document.getElementById('duel-result');

    let duelPlayers = [];

    // Función para actualizar la visualización del tablero
    function updateBoard() {
        godsSection.innerHTML = '<h2>Dioses</h2>';
        titansSection.innerHTML = '<h2>Titanes</h2>';

        gods.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.name} (${player.type}) - Casilla ${player.position}, Monedas: ${player.gold}, Piezas de armadura: ${player.armorPieces}`;
            godsSection.appendChild(playerDiv);
        });

        titans.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.name} (${player.type}) - Casilla ${player.position}, Monedas: ${player.gold}, Piezas de armadura: ${player.armorPieces}`;
            titansSection.appendChild(playerDiv);
        });
    }

    // Función para tirar el dado y mover al jugador
    function rollDice() {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        let currentPlayer;

        if (turn === 'god') {
            currentPlayer = gods[currentPlayerIndex % gods.length];
            turn = 'titan'; // Cambia el turno a los titanes
        } else {
            currentPlayer = titans[currentPlayerIndex % titans.length];
            turn = 'god'; // Cambia el turno a los dioses
            currentPlayerIndex++; // Solo incrementa el índice después de que ambos, dios y titán, hayan jugado
        }

        // Mover al jugador y revisar si pasa por la casilla 1
        const previousPosition = currentPlayer.position;
        currentPlayer.position = (currentPlayer.position + diceRoll - 1) % boardSize + 1;

        // Si el jugador pasa por la casilla 1 (pero no en la primera vuelta)
        if (previousPosition > currentPlayer.position) {
            currentPlayer.gold += 3;
        }

        // Verificar si hay un duelo
        checkForDuel(currentPlayer);

        messageElement.textContent = `${currentPlayer.name} (${currentPlayer.type}) tiró un ${diceRoll} y se movió a la casilla ${currentPlayer.position}.`;

        updateBoard();
    }

    // Función para verificar si hay un duelo
    function checkForDuel(currentPlayer) {
        const godAt2 = gods.find(player => player.position === 2);
        const godAt7 = gods.find(player => player.position === 7);
        const titanAt2 = titans.find(player => player.position === 2);
        const titanAt7 = titans.find(player => player.position === 7);

        if (godAt2){
            console.log("Hay un dios en la casilla 2")
        } 
        if (godAt7){
            console.log("Hay un dios en la casilla 7")
        }
        if (titanAt2){
            console.log("Hay un titán en la casilla 2")
        }
        if (titanAt7){
            console.log("Hay un titán en la casilla 7")
        }
        
        if (turn==="titan"){ //Se cambia porque antes se hace el cambio de turno (Aquí verifica si el jugador actual es dios)
            if(currentPlayer.position === 2 && titanAt2 || currentPlayer.position === 2 && titanAt7 || currentPlayer.position === 7 && titanAt2 || currentPlayer.position === 7 && titanAt7){
                console.log("HAY DUELO SEÑOREEEEEEES")
            }
        }
        else{
            if(currentPlayer.position === 2 && godAt2 || currentPlayer.position === 2 && godAt7 || currentPlayer.position === 7 && godAt2 || currentPlayer.position === 7 && godAt7){
                console.log("HAY DUELO SEÑOREEEEEEES")
            }
        }

        /*if ((currentPlayer.position === 2 && titanAt2) ||
            (currentPlayer.position === 7 && titanAt7) ||
            (currentPlayer.position === 2 && titanAt7) ||
            (currentPlayer.position === 7 && titanAt2)) {

            //console.log("¡Duelo detectado!");
            if (duelPlayers.length === 0) {
                duelPlayers.push(currentPlayer);
                messageElement.textContent = `¡Duelo! ${currentPlayer.name} (${currentPlayer.type}) ha retado a su oponente.`;
            } else if (duelPlayers.length === 1 && duelPlayers[0].type !== currentPlayer.type) {
                duelPlayers.push(currentPlayer);
                //console.log("HAY DUELOOOO")
                messageElement.textContent = `¡Duelo! ${duelPlayers[0].name} (${duelPlayers[0].type}) y ${currentPlayer.name} (${currentPlayer.type}) están en duelo.`;
                startDuel();
            }
        }*/
    }




    // Función para iniciar el duelo
    function startDuel() {
        //console.log("DUELO")
        duelModal.style.display = 'block';
    }

    // Función para cerrar el modal del duelo
    closeModal.onclick = function() {
        duelModal.style.display = 'none';
        duelPlayers = [];
    }

    window.onclick = function(event) {
        if (event.target == duelModal) {
            duelModal.style.display = 'none';
            duelPlayers = [];
        }
    }

    // Función para manejar el duelo
    startDuelButton.addEventListener('click', () => {
        const betAmount = parseInt(duelBetInput.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            duelResult.textContent = 'Por favor, introduce una cantidad válida para apostar.';
            return;
        }

        const [god, titan] = duelPlayers;
        if (betAmount > god.gold || betAmount > titan.gold) {
            duelResult.textContent = 'Uno de los jugadores no tiene suficientes monedas para apostar esa cantidad.';
            return;
        }

        const totalBet = betAmount * 3;
        let godRoll, titanRoll;

        do {
            godRoll = Math.floor(Math.random() * 6) + 1;
            titanRoll = Math.floor(Math.random() * 6) + 1;
        } while (godRoll === titanRoll);

        const winner = godRoll > titanRoll ? god : titan;
        const loser = godRoll > titanRoll ? titan : god;

        winner.gold += totalBet;
        loser.gold -= betAmount;

        duelResult.textContent = `${winner.name} gana el duelo con un ${godRoll > titanRoll ? godRoll : titanRoll} y se lleva ${totalBet} monedas!`;

        updateBoard();
        duelPlayers = [];
    });

    rollDiceButton.addEventListener('click', rollDice);

    // Inicializar el tablero
    updateBoard();
});
