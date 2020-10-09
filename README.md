# Chess on the Web

This is a single-page web application that allows users to play chess. Users can play with locally or online anonymously with other players. As well, users can (and should) change the color themes in settings to suit their preferences.

## Technical Parts

This is a full-stack application created using:

* React
* Express
* MongoDB
* Socket.io

When users play online, their live games are stored in a mongodb on the server. The project can divided into a the following substantial parts.

### Chess Engine

I assume the reader is familiar with the rules of chess. The chess engine provides the logic necessary to determine which moves are possible given a board state, to determine if a player is in check and to determine if the board is in checkmate or draw. Chess boards are stored in JSON and referred to as a "chess state". The chess state keeps track of: the pieces and their positions, check status, what castling options are available, en passant availability, and the taken pieces. See the example below taken from `app/src/components/pieces/pieces.js`:

    ```js
    export const firstPosition = {
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

The possible moves are caculated using the ```movesLogic``` object exported from `app/src/components/pieces/pieceslogic.js`:

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
where each type of `[piece]Logic` is function. For example, `bishopLogic(selectedLocation, state)` is a function that takes in the `selected pieces location` and a `chess state` and returns an array listing all possible moves for the selected piece.

### React Components

The react components are divided into:

* Thing one
* Thing two

The game component handles displaying the current board and updating the board.

### Sockets

The sockets, of course, facilitate communication between a player and the express server. The protocol used by the client socket and the server socket allows users to:

* Queue for games
* Submit moves
* Request draws and respond to draw requests
* Surrender
* Ask for rematch and respond to rematch requests

As well, the sockets talk directly to various web components which update dynamically based upon the protocol received. Give example about draw request.

### Backend

The client uses an express server and stores data on a local mongodb database. While making this project, I attempt to make the project scalable, easy-to-understand and easy-to-debug. For this reason, I have divided the backend operations into three categories:

* services
* controllers
* services

By dividing the backend up in this fashion: I can more easily add features in the future; the backend has a simple, to-the-point structure, and I can identify bugs quickly. The services (and only the services) interact directly with database. The controllers receive protocol information and data from the socket server, and then use the services to complete their tasks. The routes handle calling the correct controllers to accomplish the desired effect.

## Future Additions

In the (distant) future, I plan to add the following features:

* An emote system so that users can communicate during and after online games
* Account creation (although players can still play anonymously if they choose)
* An ELO rating system for matchmaking
* The ability to review previous games if the user is registered
* Sounds and Animations
* Custom art for the chess pieces (in the very distant future) and more options for themes
