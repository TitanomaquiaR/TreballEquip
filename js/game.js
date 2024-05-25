document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const options = JSON.parse(localStorage.options);
    const initialGold = options.goldini || 0;
    const armorPrice = options.price || 10;
    const godsPlayers = JSON.parse(localStorage.getItem('godsPlayers')) || [];
    const titansPlayers = JSON.parse(localStorage.getItem('titansPlayers')) || [];
    let currentPlayerIndex = 0;
    let turn = 'god'; // Alterna entre 'god' y 'titan'
    let duelPlayers = [];
    let storePlayer;
    let duelActive = false;
    let storeActive = false;

    // Inicializa las posiciones de los jugadores, monedas y piezas de armadura
    const gods = godsPlayers.map(player => ({ ...player, position: 1, gold: initialGold, armorPieces: 0 }));
    const titans = titansPlayers.map(player => ({ ...player, position: 1, gold: initialGold, armorPieces: 0 }));

    const godsSection = document.getElementById('gods-section');
    const titansSection = document.getElementById('titans-section');
    const messageElement = document.getElementById('message');
    const rollDiceButton = document.getElementById('roll-dice');
    const duelModal = document.getElementById('duelModal');
    const closeModal = document.getElementById('closeModal');
    const duelInfo = document.getElementById('duelInfo');
    const duelBetInput = document.getElementById('duelBetInput');
    const startDuelButton = document.getElementById('startDuelButton');
    const duelResult = document.getElementById('duelResult');
    const godRollButton = document.getElementById('godRollButton');
    const titanRollButton = document.getElementById('titanRollButton');
    const storeModal = document.getElementById('storeModal');
    const closeStoreModal = document.getElementById('closeStoreModal');
    const buyArmorButton = document.getElementById('buyArmorButton');
    const storeResult = document.getElementById('storeResult');

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
        if (duelActive) {
            messageElement.textContent = '¡Resuelve el duelo antes de tirar el dado!';
            return;
        }

        if (storeActive) {
            messageElement.textContent = '¡Termina la compra en la tienda antes de tirar el dado!';
            return;
        }

        const diceRoll = Math.floor(Math.random() * 6) + 1;
        let currentPlayer;

        if (turn === 'god') {
            currentPlayer = gods[currentPlayerIndex % gods.length];
            //turn = 'titan'; // Cambia el turno a los titanes
        } else {
            currentPlayer = titans[currentPlayerIndex % titans.length];
            //turn = 'god'; // Cambia el turno a los dioses
            currentPlayerIndex++; // Solo incrementa el índice después de que ambos, dios y titán, hayan jugado
        }

        // Mover al jugador y revisar si pasa por la casilla 1
        const previousPosition = currentPlayer.position;
        currentPlayer.position = (currentPlayer.position + diceRoll - 1) % boardSize + 1;

        // Si el jugador pasa por la casilla 1 (pero no en la primera vuelta)
        if (previousPosition > currentPlayer.position) {
            currentPlayer.gold += 3;
        }

        messageElement.textContent = `${currentPlayer.name} (${currentPlayer.type}) tiró un ${diceRoll} y se movió a la casilla ${currentPlayer.position}.`;

        checkForDuel(currentPlayer);
        checkForStore(currentPlayer);

        if (turn === 'god'){
            turn = 'titan';
        } else {
            turn = 'god'; 
        }

        updateBoard();
    }

    // Función para verificar si hay un duelo
    function checkForDuel(currentPlayer) {
        const godAt2 = gods.find(player => player.position === 2);
        const godAt7 = gods.find(player => player.position === 7);
        const titanAt2 = titans.find(player => player.position === 2);
        const titanAt7 = titans.find(player => player.position === 7);

        if (turn === "god") { // Se cambia porque antes se hace el cambio de turno (Aquí verifica si el jugador actual es dios) [YA NO]
            if ((currentPlayer.position === 2 && (titanAt2 || titanAt7)) || 
                (currentPlayer.position === 7 && (titanAt2 || titanAt7))) {
                console.log("HAY DUELO SEÑOREEEEEEES");
                duelPlayers.push(titanAt2 || titanAt7);
                duelPlayers.push(currentPlayer);
                console.log(duelPlayers);
                startDuel();
            }
        } else {
            if ((currentPlayer.position === 2 && (godAt2 || godAt7)) || 
                (currentPlayer.position === 7 && (godAt2 || godAt7))) {
                console.log("HAY DUELO SEÑOREEEEEEES");
                duelPlayers.push(godAt2 || godAt7);
                duelPlayers.push(currentPlayer);
                console.log(duelPlayers);
                startDuel();
            }
        }
    }

    // Función para iniciar el duelo
    function startDuel() {
        duelActive = true;
        duelModal.style.display = 'block';
        duelInfo.textContent = `¡Duelo entre ${duelPlayers[0].name} (${duelPlayers[0].type}) y ${duelPlayers[1].name} (${duelPlayers[1].type})!`;
    }

    // Función para cerrar el modal del duelo
    closeModal.onclick = function() {
        duelModal.style.display = 'none';
        duelPlayers = [];
        duelActive = false;
    }

    window.onclick = function(event) {
        if (event.target == duelModal) {
            duelModal.style.display = 'none';
            duelPlayers = [];
            duelActive = false;
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
        duelResult.textContent = `Apostando ${betAmount} monedas cada uno. Total del bote: ${totalBet} monedas.`;

        duelPlayers[0].bet = betAmount;
        duelPlayers[1].bet = betAmount;

        godRollButton.style.display = 'block';
        titanRollButton.style.display = 'block';
        startDuelButton.style.display = 'none';
        duelBetInput.style.display = 'none';
    });

    godRollButton.addEventListener('click', () => {
        duelPlayers[0].roll = Math.floor(Math.random() * 6) + 1;
        duelResult.textContent += `\n${duelPlayers[0].name} tiró un ${duelPlayers[0].roll}.`;
        godRollButton.style.display = 'none';

        if (duelPlayers[1].roll !== undefined) {
            resolveDuel();
        }
    });

    titanRollButton.addEventListener('click', () => {
        duelPlayers[1].roll = Math.floor(Math.random() * 6) + 1;
        duelResult.textContent += `\n${duelPlayers[1].name} tiró un ${duelPlayers[1].roll}.`;
        titanRollButton.style.display = 'none';

        if (duelPlayers[0].roll !== undefined) {
            resolveDuel();
        }
    });

    function resolveDuel() {
        const [god, titan] = duelPlayers;

        while (god.roll === titan.roll) {
            duelResult.textContent += '\n¡Empate! Tirando de nuevo...';
            god.roll = Math.floor(Math.random() * 6) + 1;
            titan.roll = Math.floor(Math.random() * 6) + 1;
            duelResult.textContent += `\n${god.name} tiró un ${god.roll}. ${titan.name} tiró un ${titan.roll}.`;
        }

        const winner = god.roll > titan.roll ? god : titan;
        const loser = god.roll > titan.roll ? titan : god;

        winner.gold += god.bet * 3;
        loser.gold -= titan.bet;

        duelResult.textContent += `\n${winner.name} gana el duelo y se lleva ${god.bet * 3} monedas!`;

        updateBoard();
        duelPlayers = [];
        duelActive = false;
        startDuelButton.style.display = 'block';
        duelBetInput.style.display = 'block';
        godRollButton.style.display = 'none';
        titanRollButton.style.display = 'none';
    }

    // Función para verificar si hay una tienda
    function checkForStore(currentPlayer) {
        if (currentPlayer.position === 5) {
            messageElement.textContent = `${currentPlayer.name} (${currentPlayer.type}) ha llegado a la tienda en la casilla 5 y debe comprar una pieza de armadura.`;
            storeActive = true;
            storePlayer = currentPlayer
            storeModal.style.display = 'block';
            rollDiceButton.disabled = true; // Desactivar el botón de tirar dado
        }
    }

    // Función para cerrar el modal de la tienda
    function closeStore() {
        storeModal.style.display = 'none';
        storeActive = false;
        rollDiceButton.disabled = false; // Activar nuevamente el botón de tirar dado
    }

    // Evento para cerrar el modal de la tienda al hacer clic en el botón de cerrar
    closeStoreModal.onclick = closeStore;

    // Evento para cerrar el modal de la tienda al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == storeModal) {
            closeStore();
        }
    }

    function calculateTotalArmor(team) {
        let totalArmor = 0;
        team.forEach(player => {
            totalArmor += player.armorPieces;
        });
        return totalArmor;
    }

    // Función para comprar piezas de armadura
    buyArmorButton.onclick = function() {
        if (!storeActive) return;
    
        currentPlayer = storePlayer;
        if (currentPlayer.gold <= 1) {
            storeResult.textContent = 'No tienes suficientes monedas para comprar piezas de armadura.';
            return;
        }
    
        currentPlayer.gold -= armorPrice;
        currentPlayer.armorPieces += 1;
        storeResult.textContent = `Has comprado una pieza de armadura por ${armorPrice} monedas. Te quedan ${currentPlayer.gold} monedas y tienes ${currentPlayer.armorPieces} piezas de armadura.`;
    
        closeStore();
        updateBoard();
        storeActive = false;
        storeModal.style.display = 'none';
    
        const godsTotalArmor = calculateTotalArmor(gods);
        const titansTotalArmor = calculateTotalArmor(titans);
    
        if (godsTotalArmor >= options.pieces || titansTotalArmor >= options.pieces) {
            const winningTeam = godsTotalArmor >= options.pieces ? 'Dioses' : 'Titanes';
            alert(`El equipo ganador es ${winningTeam}!`);
            window.location.href = '../index.html'; // Redirigir a index.html
        }
    }

    // Inicializar el tablero al cargar
    updateBoard();

    // Asignar el evento al botón de tirar dado
    rollDiceButton.onclick = rollDice;
});
