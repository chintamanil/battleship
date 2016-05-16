(function() {

    var globals = require('./globals.js');
    var _ = require('underscore');

    /**
     * Ship object. Has state mapped to 'STATE' & length
     */
    function Ship(value) {
        this.location = _.range(globals.SHIPS).map(function() {
            return globals.STATE.D;
        });
        this.state = globals.STATE.D;
        this.start = value;
    }
    /**
     * [hit : Check if length == 0. & set state based on that]
     *
     * @return {[STATE]} [string]
     */
    Ship.prototype.hit = function(locationId) {
        // var value = this.location[locationId - this.start];
        this.location[locationId - this.start] = 'H';
        this.state = 'H';
        var check = this.location.indexOf('X');
        if (check === -1) {
            this.location = _.range(globals.SHIPS).map(function() {
                return 'S';
            });
            this.state = 'S';
        }
        // if (this.length) {
        //     this.state = 'H';
        //     this.length--;
        // }
        // if (!this.length) {
        //     this.state = 'S';
        // }
        return this.state;
    };

    Ship.prototype.getShipState = function(rowNum) {
        return this.location[rowNum - this.start];
    };

    module.exports = {
        Ship: Ship
    };


})();
