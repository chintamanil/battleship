(function() {

    var globals = require('./globals.js');
    var Ship = require('./ship.js').Ship;
    var _ = require('underscore');

    /**
     * Board is a 2D array of 5x5.
     */
    function Board() {
        this.board = _.range(globals.ROWS).map(function() {
            return _.range(globals.COLS).map(function() {
                return '.';
            });
        });
    }

    /**
     * [printBoard : Prints the board]
     *
     * @param  {Function} cb [Callback that takes string & prints that as board]
     *
     * @return {[null]}      [null]
     */
    Board.prototype.printBoard = function(cb) {
        var value, printed;
        var view = [];
        var _that = this;
        _.range(globals.ROWS).map(function(i) {
            printed = [];
            _.range(globals.COLS).map(function(j) {
                value = _that.board[i][j];
                if (typeof value === 'string') {
                    printed.push(value);
                } else {
                    printed.push(value.getShipState(i));
                }
            });
            view.push(printed.join(''));
        });
        cb(view.join('\n'));
    };

    /**
     * Checks if the give rowNo & ColNo has a ship. And returns globals.STATE accordingly
     *
     * @param  {[Int]} rowNo [Row number]
     * @param  {[Int]} colNo [Col number]
     *
     * @return {[STATE]}       [String showing globals.STATE]
     */
    Board.prototype.check = function(rowNo, colNo) {
        var state, i;
        var isShip = this.board[rowNo][colNo];
        if (typeof isShip === 'string') {
            if (isShip === '.') {
                this.board[rowNo][colNo] = 'M';
                return globals.STATE.M;
            }
            return globals.STATE.W;
        }
        state = isShip.hit(rowNo);
        this.board[rowNo][colNo] = state;
        if (state === 'H') {
            return globals.STATE.H;
        }
        if (state === 'S') {
            for (i = 0; i < globals.COLS; i++) {
                if (this.board[i][colNo] === 'H') {
                    this.board[i][colNo] = 'S';
                }
            }
            return globals.STATE.S;
        }
        return globals.STATE.M;
    };

    /**
     * [setShips : For this board takes a list & maps it to a ship on board ]
     *
     * @param {[Array]} list [Array of length 5. Ships Column location as [-1,0,1,2] only]
     */
    Board.prototype.setShips = function(list) {
        var i, j, value, ship;
        for (i = 0; i < list.length; i++) {
            value = parseInt(list[i], 10);
            if (value !== -1) {
                ship = new Ship(list[i]);
                for (j = value; j < globals.SHIPS + value; j++) {
                    this.board[j][i] = ship;
                }
            }
        }
        this.printBoard(globals.write);
    };

    module.exports = {
        Board: Board
    };

})();
