(function() {

    var chai = require('chai');
    var expect = chai.expect;
    var Game = require('./../src/game.js').Game;
    var globals = require('./../src/globals.js');
    var GameEvent = require('./../src/gameEvent.js').Game;
    var Player = require('./../src/player.js').Player;
    var Board = require('./../src/board.js').Board;
    var Ship = require('./../src/ship.js').Ship;
    describe('Battleship game testing', function() {
        describe(' Ship test', function() {

            before(function() {
                game = new Game();
                ship = new Ship(2);
                board = new Board();
                player1 = new Player('Player-1');
                player2 = new Player('Player-2');
            });

            it('Check ship state before hit = X', function() {
                expect(ship.getShipState(2)).to.equal('X');
            });

            it('Check ship state after hit = S', function() {
                ship.hit(2);
                expect(ship.getShipState(2)).to.equal('H');
            });

            it('Check ship state after 3 hit = S', function() {
                ship.hit(2);
                ship.hit(3);
                ship.hit(4);
                expect(ship.getShipState(2)).to.equal('S');
            });
        });

        describe(' Board test', function() {

            it('Create board & check Miss', function() {
                board.setShips([2, 2, 2, -1, -1]);
                expect(board.check(0, 0)).to.equal('Miss');
            });

            it('Board check hit', function() {
                expect(board.check(2, 0)).to.equal('Hit');
            });

            it('Board check sunk', function() {
                board.check(3, 0);
                expect(board.check(4, 0)).to.equal('Sunk');
            });

        });

        describe(' Player test', function() {
            // Need to figure a way to test readline
            it('Player 1 & 2 board setup & check ', function() {
                player1.board.setShips([2, 2, 2, -1, -1]);
                player2.board.setShips([0, 0, 0, -1, -1]);
                expect(player1.board.check(0, 0)).to.equal('Miss');
                expect(player2.board.check(0, 0)).to.equal('Hit');
                expect(player2.board.check(1, 0)).to.equal('Hit');
                expect(player2.board.check(2, 0)).to.equal('Sunk');
                expect(player2.board.check(0, 1)).to.equal('Hit');
                expect(player2.board.check(1, 1)).to.equal('Hit');
                expect(player2.board.check(2, 1)).to.equal('Sunk');
                expect(player2.board.check(0, 2)).to.equal('Hit');
                expect(player2.board.check(1, 2)).to.equal('Hit');
                expect(player2.board.check(2, 2)).to.equal('Sunk');
                player2.board.printBoard(globals.write);
            });

        });
    });

})();
