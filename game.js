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

function Board() {
    this.board = _.range(ROWS).map(function() {
        return _.range(COLS).map(function() {
            return '.';
        });
    });
}

Board.prototype.printBoard = function(cb) {
    var i, j, value, printed, view = [];
    for (i = 0; i < ROWS; i++) {
        printed = [];
        for (j = 0; j < COLS; j++) {
            value = this.board[i][j];
            if (typeof(value) === 'string') {
                printed.push(value);
            } else {
                printed.push(STATE.D);
            }
        }
        view.push(printed.join(''));
    }
    cb(view.join('\n'));
};

Board.prototype.check = function(rowNo, colNo) {
    var state, i;
    var isShip = this.board[rowNo][colNo];
    if (typeof(isShip) === 'string') {
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

function Ship() {
    this.length = 3;
    this.state = STATE.D;
}

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

function Player(name) {
    this.name = name || 'Default';
    this.board = new Board();
    this.boats = 3;
}

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

Player.prototype.turn = function(opponent, cb, result) {
    var _that = this;
    rl.question('Enter Row Number 0-4: ', function(row) {
        rl.question('Enter Col Number 0-4: ', function(col) {
            row = parseInt(row, 10);
            col = parseInt(col, 10);
            var check = opponent.board.check(row, col);
            if (check === STATE.W) {
                write('Invalid Row Col Entered! Try again !!')
                _that.turn(opponent, cb);
            }
            if (check === STATE.S) {
                _that.boats--;
                if (!_that.boats) {
                    return cb(true);
                }
                return cb(false);
            }
            if (check === STATE.H || check === STATE.M) {
                return cb(false);
            }
        });
    });
};

function Game() {
    this.players = [];
    this.count = 0;
    var i;
    for (i = 0; i < 2; i++) {
        this.players[i] = new Player('Player-' + (i + 1));
    }
    // events.EventEmitter.call(this);
    var game = this;
    this.init = function() {
        for (i = 0; i < 1; i++) {
            game.players[i].setup(game.players[i + 1], this.turn);
        }
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
        write('Boats left for opponent: ' + opponent.boats );
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
    this.init();
}

// util.inherits(Game, events.EventEmitter);
var start = new Game();
// process.exit(0);
