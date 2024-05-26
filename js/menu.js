addEventListener('load', function() {
    document.getElementById('newGameButton').addEventListener('click', () => {
        // Lógica para iniciar una nueva partida
        // Redirigir a la página del juego
        window.location.href = './html/players.html';
    });

    document.getElementById('loadGameButton').addEventListener('click', () => {
        if (localStorage.getItem('savedGameState')) {
            // Redirigir a la página del juego con parámetro de carga
            window.location.href = './html/game.html?loadGame=true';
        } else {
            alert('No hay partidas guardadas.');
        }
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./html/options.html")
    });
});