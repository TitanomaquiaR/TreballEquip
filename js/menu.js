addEventListener('load', function() {
    document.getElementById('newGameButton').addEventListener('click', () => {
        localStorage.setItem('playSavedGame', JSON.stringify(false));
        window.location.href = './players.html';
    });

    document.getElementById('loadGameButton').addEventListener('click', () => {
        if (localStorage.getItem('savedGameState')) {
            localStorage.setItem('playSavedGame', JSON.stringify(true));
            window.location.href = './game.html';
        } else {
            alert('No hay partidas guardadas.');
        }
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./options.html")
    });
});