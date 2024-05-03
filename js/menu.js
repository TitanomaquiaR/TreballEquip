addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){
        sessionStorage.loadgame = false;
        window.location.assign("./html/players.html")
    });

    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./html/options.html")
    });

    document.getElementById('load').addEventListener('click', 
    function(){
        sessionStorage.loadgame = true;
        window.location.assign("./html/game.html")
    });

});