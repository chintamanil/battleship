(function() {

    var chai = require('chai');
    var expect = chai.expect;
    var Game = require('./../src/game.js').Game;
    var GameEvent = require('./../src/gameEvent.js').Game;
    var Player = require('./../src/player.js').Player;
    var Board = require('./../src/board.js').Board;
    var Ship = require('./../src/ship.js').Ship;
    describe('Battleship game testing', function() {
        describe(' Ship test', function() {

            beforeEach(function() {
                game = new Game();
                ship = new Ship(2);
                board = new Board();
                player = new Player('Player-1');
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

            //   it('Board check sunk', function() {
            //     game.init()
            // });

        });

        describe(' Player test', function() {

            // it('Create board & check Miss', function() {
            //     var player = new Player('Player-1');
            //     board.setShips([2, 2, 2, -1, -1]);
            //     expect(board.check(0, 0)).to.equal('Miss');
            // });

        });
    });

})();
