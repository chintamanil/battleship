(function() {
    var globals = require('./globals.js');
    var Board = require('./board.js').Board;
    var _ = require('underscore');
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    /**
     * Player object which has a board & predefined ships/boats
     *
     * @param {[type]} name [description]
     */
    function Player(name) {
        this.name = name || 'Default';
        this.board = new Board();
        this.boats = 3;
    }

    /**
     * [getShips : gets the Array of Ships as string ]
     *
     * @param  {Function} cb    [Start / turn function to run after player 2]
     * @param  {[Player]}   other [2nd player]
     *
     * @return {[null]}         [null]
     */
    Player.prototype.getShips = function(cb, other) {
        var _that = this;
        rl.question(_that.name + " Enter Ships location as Array of five \n", function(locationList) {
            if (locationList === 'exit') {
                rl.close();
                return;
            }
            var list = locationList.substr(1, locationList.length - 2).split(',');
            _that.board.setShips(list);
            if (other) {
                return other.getShips(cb);
            }
            cb();
        });
    };

    Player.prototype.setup = function(opponent, cb) {
        this.getShips(cb, opponent);
        return;
    };

    /**
     * [turn description]
     *
     * @param  {[Player]}   opponent [Other player]
     * @param  {Function} cb       [executes turnEnd Function]
     * @param  {[boolean]}   result   [true = game won]
     *
     * @return {[cb]}            [executes cb function]
     */
    Player.prototype.turn = function(opponent, cb, result) {
        var _that = this;
        rl.question('Enter Row Number 0-4: ', function(row) {
            rl.question('Enter Col Number 0-4: ', function(col) {
                row = parseInt(row, 10);
                col = parseInt(col, 10);
                var check = opponent.board.check(row, col);
                if (check === globals.STATE.W) {
                    globals.write('Invalid Row Col Entered! Try again !!');
                    _that.turn(opponent, cb);
                }
                if (check === globals.STATE.S) {
                    opponent.boats--;
                    return opponent.boats ? cb(false) : cb(true);
                }
                if (check === globals.STATE.H || check === globals.STATE.M) {
                    return cb(false);
                }
            });
        });
    };

    module.exports = {
        Player: Player
    };

})();
