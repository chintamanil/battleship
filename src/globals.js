(function() {

    var ROWS = 5;
    var COLS = 5;
    var SHIPS = 3;
    var STATE = {
        'H': 'Hit',
        'M': 'Miss',
        'S': 'Sunk',
        'W': 'Wrong',
        'D': 'X'
    };

    function write(data) {
        console.log(data);
    }

    module.exports = {
        ROWS: ROWS,
        COLS: COLS,
        SHIPS: SHIPS,
        STATE: STATE,
        write: write
    };

})();
