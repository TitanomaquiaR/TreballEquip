document.addEventListener('DOMContentLoaded', () => {
    function createPlayerInputs(type) {
        var numPlayers = parseInt(document.getElementById('num-' + type).value);
        var container = document.getElementById(type + '-players-container');
        container.innerHTML = '';

        var options = [];
        if (type === 'gods') {
            options = ['Zeus', 'Hades', 'Hestia', 'Poseidon', 'Demeter'];
        } else if (type === 'titans') {
            options = ['Atlas', 'Ceo', 'Cronos', 'Rea', 'Temis'];
        }

        for (var i = 1; i <= numPlayers; i++) {
            var playerNameInput = document.createElement('input');
            playerNameInput.type = 'text';
            playerNameInput.placeholder = 'Nombre del jugador ' + i;

            var playerTypeSelect = document.createElement('select');
            options.forEach(function(optionText) {
                var option = document.createElement('option');
                option.text = optionText;
                playerTypeSelect.add(option);
            });

            var playerContainer = document.createElement('div');
            playerContainer.appendChild(playerNameInput);
            playerContainer.appendChild(playerTypeSelect);

            container.appendChild(playerContainer);
        }
    }

    document.getElementById('play').addEventListener('click', function() {
        var godsPlayers = [];
        var titansPlayers = [];

        document.querySelectorAll('#gods-players-container div').forEach(function(playerDiv) {
            var name = playerDiv.querySelector('input').value;
            var type = playerDiv.querySelector('select').value;
            godsPlayers.push({ name: name, type: type });
        });

        document.querySelectorAll('#titans-players-container div').forEach(function(playerDiv) {
            var name = playerDiv.querySelector('input').value;
            var type = playerDiv.querySelector('select').value;
            titansPlayers.push({ name: name, type: type });
        });

        localStorage.setItem('godsPlayers', JSON.stringify(godsPlayers));
        localStorage.setItem('titansPlayers', JSON.stringify(titansPlayers));

        // Redirigir a la página del juego (modifica 'game.html' con la URL real de tu juego)

        window.location.href = 'game.html';
    });

    // Asignar el evento onchange a los inputs de número de jugadores
    document.getElementById('num-gods').addEventListener('change', () => createPlayerInputs('gods'));
    document.getElementById('num-titans').addEventListener('change', () => createPlayerInputs('titans'));
});
