module.exports = (function() {

    var globals = require('./globals.js');
    var _ = require('underscore');
    var Player = require('./player.js').Player;
    var util = require('util');
    var events = require('events');
    var readline = require('readline');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    /**
     * [Game Object that defines the Players. Initializes the game & defines the turn methods]
     */
    function Game() {
        this.players = [];
        this.count = 0;

        var game = this;

        _.range(2).map(function(i) {
            game.players[i] = new Player('Player-' + (i + 1));
        });

        events.EventEmitter.call(this);

        this.init = function() {
            game.getShips(0);
        };

        this.on('changeTurn', function() {
            var opponent, odd, next;
            odd = game.count % 2;
            globals.write(game.players[odd].name + "'s turn");
            globals.write('Opponents Board Layout');
            if (odd) {
                opponent = game.players[0];
                next = 0;
            } else {
                opponent = game.players[1];
                next = 1;
            }
            opponent.board.printBoard(globals.write);
            globals.write('Boats left for opponent: ' + opponent.boats);
            game.getRowCol(odd, next);
        });

        this.on('checkWinner', function(victor) {
            var victorName;
            globals.write('--------------------');
            if (victor) {
                victorName = game.players[game.count % 2].name;
                globals.write(victorName + ' is the winner!');
                process.exit(0);
            } else {
                game.count++;
                game.emit('changeTurn');
            }
        });
        game.init();
    }

    Game.prototype.getShips = function(playerNo) {
        var _that = this;
        rl.question(_that.players[playerNo].name + ' Enter Ships location as Array of five \n', function(locationList) {
            if (locationList === 'exit') {
                rl.close();
                return;
            }
            var list = locationList.substr(1, locationList.length - 2).split(',');
            _that.players[playerNo].board.setShips(list);
            if (playerNo === 0) {
                _that.getShips(1);
            }
            if (playerNo === 1) {
                _that.emit('changeTurn');
            }
            return;
        });
    };

    Game.prototype.getRowCol = function(current, next) {
        var _that = this;
        rl.question('Enter Row Number 0-4: ', function(row) {
            rl.question('Enter Col Number 0-4: ', function(col) {
                row = parseInt(row, 10);
                col = parseInt(col, 10);
                var check = _that.players[next].board.check(row, col);
                if (check === globals.STATE.W) {
                    globals.write('Invalid Row Col Entered! Try again !!');
                    _that.getRowCol(current, next);
                }
                if (check === globals.STATE.S) {
                    _that.players[next].boats--;
                    return _that.players[next].boats ? _that.emit('checkWinner', false) : _that.emit('checkWinner', true);
                }
                if (check === globals.STATE.H || check === globals.STATE.M) {
                    return _that.emit('checkWinner', false);
                }
            });
        });
    };

    util.inherits(Game, events.EventEmitter);

    return {
        Game: Game
    };
})();
