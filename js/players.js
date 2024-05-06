function createPlayerInputs(type) {
    var numPlayers = parseInt(document.getElementById('num-' + type).value);
    var container = document.getElementById(type + '-players-container');
    container.innerHTML = '';

    for (var i = 1; i <= numPlayers; i++) {
        var playerNameInput = document.createElement('input');
        playerNameInput.type = 'text';
        playerNameInput.placeholder = 'Nombre del jugador ' + i;

        var playerTypeSelect = document.createElement('select');
        var option1 = document.createElement('option');
        option1.text = 'Opción 1';
        var option2 = document.createElement('option');
        option2.text = 'Opción 2';
        var option3 = document.createElement('option');
        option3.text = 'Opción 3';
        playerTypeSelect.add(option1);
        playerTypeSelect.add(option2);
        playerTypeSelect.add(option3);

        var playerContainer = document.createElement('div');
        playerContainer.appendChild(playerNameInput);
        playerContainer.appendChild(playerTypeSelect);

        container.appendChild(playerContainer);
    }
}