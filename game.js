var _ = require('underscore');
var readline = require('readline');
// var util = require('util');
// var events = require('events');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

/**
 * Ship object. Has state mapped to 'STATE' & length
 */
function Ship() {
    this.length = 3;
    this.state = STATE.D;
}
/**
 * [hit : Check if length == 0. & set state based on that]
 *
 * @return {[STATE]} [string]
 */
Ship.prototype.hit = function() {
    if (this.length) {
        this.state = 'H';
        this.length--;
    }
    if (!this.length) {
        this.state = 'S';
    }
    return this.state;
};

/**
 * Board is a 2D array of 5x5.
 */
function Board() {
    this.board = _.range(ROWS).map(function() {
        return _.range(COLS).map(function() {
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
    _.range(ROWS).map(function(i) {
        printed = [];
        _.range(COLS).map(function(j) {
            value = _that.board[i][j];
            if (typeof value === 'string') {
                printed.push(value);
            } else {
                printed.push(STATE.D);
            }
        });
        view.push(printed.join(''));
    });
    cb(view.join('\n'));
};

/**
 * Checks if the give rowNo & ColNo has a ship. And returns STATE accordingly
 *
 * @param  {[Int]} rowNo [Row number]
 * @param  {[Int]} colNo [Col number]
 *
 * @return {[STATE]}       [String showing STATE]
 */
Board.prototype.check = function(rowNo, colNo) {
    var state, i;
    var isShip = this.board[rowNo][colNo];
    if (typeof isShip === 'string') {
        if (isShip === '.') {
            this.board[rowNo][colNo] = 'M';
            return STATE.M;
        }
        return STATE.W;
    }
    state = isShip.hit();
    this.board[rowNo][colNo] = state;
    if (state === 'H') {
        return STATE.H;
    }
    if (state === 'S') {
        for (i = 0; i < COLS; i++) {
            if (this.board[i][colNo] === 'H') {
                this.board[i][colNo] = 'S';
            }
        }
        return STATE.S;
    }
    return STATE.M;
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
            ship = new Ship();
            for (j = value; j < SHIPS + value; j++) {
                this.board[j][i] = ship;
            }
        }
    }
    this.printBoard(write);
};

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
            if (check === STATE.W) {
                write('Invalid Row Col Entered! Try again !!');
                _that.turn(opponent, cb);
            }
            if (check === STATE.S) {
                _that.boats--;
                return _that.boats ? cb(false) : cb(true);
            }
            if (check === STATE.H || check === STATE.M) {
                return cb(false);
            }
        });
    });
};

/**
 * [Game Object that defines the Players. Initializes the game & defines the turn methods]
 */
function Game() {
    this.players = [];
    this.count = 0;
    // events.EventEmitter.call(this);
    var game = this;
    _.range(2).map(function(i) {
        game.players[i] = new Player('Player-' + (i + 1));
    });
    this.init = function() {
        game.players[0].setup(game.players[1], this.turn);
    };

    this.turn = function() {
        var opponent, odd;
        odd = game.count % 2;
        write(game.players[odd].name + "'s turn");
        write('Opponents Board Layout');
        if (odd) {
            opponent = game.players[0];
        } else {
            opponent = game.players[1];
        }
        opponent.board.printBoard(write);
        write('Boats left for opponent: ' + opponent.boats);
        game.players[odd].turn(opponent, game.turnEnd);
    };

    this.turnEnd = function(victor) {
        var victorName;
        write('--------------------');
        if (victor) {
            victorName = game.players[game.count % 2].name;
            write(victorName + ' is the winner!');
            process.exit(0);
        } else {
            game.count++;
            game.turn();
        }
    };
}

// util.inherits(Game, events.EventEmitter);
var game = new Game();
game.init();
// process.exit(0);
