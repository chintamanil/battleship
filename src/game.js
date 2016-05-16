module.exports = (function() {

    var globals = require('./globals.js');
    var _ = require('underscore');
    var Player = require('./player.js').Player;

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
            globals.write(game.players[odd].name + "'s turn");
            globals.write('Opponents Board Layout');
            if (odd) {
                opponent = game.players[0];
            } else {
                opponent = game.players[1];
            }
            opponent.board.printBoard(globals.write);
            globals.write('Boats left for opponent: ' + opponent.boats);
            game.players[odd].turn(opponent, game.turnEnd);
        };

        this.turnEnd = function(victor) {
            var victorName;
            globals.write('--------------------');
            if (victor) {
                victorName = game.players[game.count % 2].name;
                globals.write(victorName + ' is the winner!');
                process.exit(0);
            } else {
                game.count++;
                game.turn();
            }
        };
    }

    return {
        Game: Game
    };

})();
