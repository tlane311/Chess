# Chess on the Web

This is a single-page web application that allows users to play chess. Users can play with locally or online anonymously with other players. As well, users can (and should) change the color themes in settings to suit their preferences.

## Demo

## Technical Parts

This is a full-stack application created using:

* React
* Express
* MongoDB
* Socket-io

When users play online, their live games are stored in a MongoDB database on the server. The project can be divided into the following substantial parts.

## 1. Chess Engine

I assume the reader is familiar with the rules of chess.

The chess engine provides the logic necessary to determine:

* which moves are possible given the board state,
* if the board is in check,
* if the board is in checkmate/draw.

The chess engine is (deceitfully) stored in `app/src/components/pieces` and might be mistaken as a react component at first glance. The engine is only used by the `Game` react component, so it made sense to store it adjacent to those components.

Chess game are stored in JSON and referred to as a `chess state` (not be confused with a react state). A `chess state` keeps track of: the pieces and their positions, check status, what castling options are available, en passant availability, and the taken pieces. See the example below taken from `app/src/components/pieces/pieces.js`:

```js
export const firstPosition = { //example of a "chess state"
    position: [/* 64 length array representing the arrangement of pieces on the board*/],
    check: {
        white: false,
        black: false
    },
    castleStatus:{
        white: {
            queenside: true,
            kingside: true
        },
        black: {
            queenside: true,
            kingside: true
        }
    },
    enPassant: {},
    takenWhitePieces: [],
    takenBlackPieces: []
}
```

The possible moves should be calculated by a function that takes in a `selected piece's location` and a `chess state`  and returns an array of the possible squares that piece could move to/take. The most direct way to calculate is to have a function that uses a `switch` statement. Unfortunately, because of the way the compiler handles `break`, `switch` statements are error-prone in a bad way(see Douglas Crockford's *Javascript, the Good Parts*. Therefore, we use a Javascript `object` to mimic that behavior instead. This implemented by the literal ```movesLogic``` from `app/src/components/pieces/pieceslogic.js`:

```js
const movesLogic = {
    whitePawn: whitePawnLogic,
    blackPawn: blackPawnLogic,
    knight: knightLogic,
    bishop: bishopLogic,
    rook: rookLogic,
    queen: queenLogic,
    king: kingLogic
}
```

where each type of `[piece]Logic` is function with correct inputs/outputs. For example, `bishopLogic(selectedLocation, state)` is a function that takes in the `selected piece's location` and a `chess state` and returns an array listing all possible moves for the selected piece.

The other important pieces of the chess engine are dependents of `movesLogic`; they are the functions `checkDetector`, `checkmateDetector` and `drawDetector` located in `app/src/components/pieces/checklogic.js`. The functions take in a `chess state` and a `boolean` which decides if its white's turn or black's turn and return a boolean deciding if a player in check, checkmate, or draw.

## 2. React Components

The top-level react components are (located at `src/app/components`):

1. `Game`
2. `Menu`
3. `PostGame`

The `Game` component contains a `Board` component (displays the board), a `History` component (displays the game history in [algebraic chess notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))), and some Navigation components (allows players to undo/redo moves). The top-level `Game` component handles everything chess and is by the most complicated component.

    INSERT PICTURES HERE

The `Menu` component contains buttons that allows the players to queue for games, forfeit, request draw, etc. This component displays different buttons depending on what the player is doing (in-game vs out-of-game, requesting draw, receiving draw request, etc.)

    INSERT PICTURES HERE

The `PostGame` component displays a modal at the conclusion of a local/online game. This allows players to analyze their game or request rematches.

    INSERT PICTURES HERE

## 3. Sockets

The sockets, of course, facilitate communication between a player and the express server. The client socket is located in `app/src/socketIsListening.js` and the server socket is located `app/backend/server.js`. The protocol used by the client socket and the server socket allows users to:

* Queue for games
* Submit moves
* Request draws and respond to draw requests
* Surrender
* Ask for rematch and respond to rematch requests

As well, the sockets talk directly to each react component which update dynamically based upon the messages received (see the images above).

## 4. Backend

The client uses an express server and stores data on a local mongodb database. While making this project, I attempt to make the project scalable, easy-to-understand and easy-to-debug. For this reason, I have divided the backend operations into three categories:

* services
* controllers
* services

By dividing the backend up in this fashion: one can more easily add features in the future; the backend has a simple, to-the-point structure, and one can identify bugs quickly. The services (and only the services) interact directly with database. The controllers receive protocol information and data from the socket server, and then use the services to complete their tasks. The routes handle calling the correct controllers to accomplish the desired effect.

## Future Additions

In the ***distant*** future, I plan to add the following features:

* An emote system so that users can communicate during and after online games
* Account creation (although players can still play anonymously if they so choose)
* An ELO rating system for matchmaking
* The ability to review previous games if the user is registered
* Sounds and Animations
* Custom art for the chess pieces (in the very distant future) and more options for themes
