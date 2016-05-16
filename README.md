# battleships

A simple game of battleships written in played against another player.
Written in node.js - played in the terminal.

*****
### Install
```
$ npm install
```

#### Run

```
$ npm start # for running callback version of game
$ npm run event #f for running game written with nodes event emitter
$ npm test # for running mocha tests
```


*****
### Gameplay

- You and the computer take turns to fire at coordinates on a 5x5 board.
- Enter the Ships location as an array of Five e.g [-1,0,1,2,-1]
- -1 indicares no ship in that Column. 0/1/2 indicates starting row of Ship.
- You each have 3 Ships (1 squares wide & 3 squares long) Ships are placed vertically only.
- Hits/Misses/Sinking of ships/Game won/lost will all be reported in the terminal
- Typing exit at any time will end the game.
