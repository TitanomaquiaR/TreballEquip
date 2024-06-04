var options = function(){
    const default_options = {
        pieces:5,
        goldini:10,
        price:3
    };
    
    var pieces = $('#pieces');
    var goldini = $('#goldini');
    var price = $('#price');

    var options = JSON.parse(localStorage.options||JSON.stringify(default_options));
    pieces.val(options.pieces);
    goldini.val(options.goldini);
    price.val(options.price)
    pieces.on('change',()=>options.pieces = pieces.val());
    goldini.on('change',()=>options.goldini = goldini.val());
    price.on('change',()=>options.price = price.val());

    return { 
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pieces = default_options.pieces;
            options.goldini = default_options.goldini;
            options.price = default_options.price;
            pieces.val(options.pieces);
            goldini.val(options.goldini);
            price.val(options.price);
        }
    }
}();

$('#default').on('click',function(){
    options.defaultValues();
});

$('#apply').on('click',function(){
    options.applyChanges();
    location.assign("./inicio.html");
});