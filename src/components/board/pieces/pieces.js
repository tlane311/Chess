const blackPieces = [
    {type: "rook",
    color: "black",
    id: "a8"
    },
    {type: "knight",
    color: "black",
    id: "b8"
    },
    {type: "bishop",
    color: "black",
    id: "c8"
    },
    {type: "queen",
    color: "black",
    id: "d8"
    },
    {type: "king",
    color: "black",
    id: "e8"
    },
    {type: "bishop",
    color: "black",
    id: "f8"
    },
    {type: "knight",
    color: "black",
    id: "g8"
    },
    {type: "rook",
    color: "black",
    id: "h8"
    },
    {type: "blackPawn",
    color: "black",
    id: "a7"
    },
    {type: "blackPawn",
    color: "black",
    id: "b7"
    },
    {type: "blackPawn",
    color: "black",
    id: "c7"
    },
    {type: "blackPawn",
    color: "black",
    id: "d7"
    },
    {type: "blackPawn",
    color: "black",
    id: "e7"
    },
    {type: "blackPawn",
    color: "black",
    id: "f7"
    },
    {type: "blackPawn",
    color: "black",
    id: "g7"
    },
    {type: "blackPawn",
    color: "black",
    id: "h7"
    },
]
const whitePieces = [
    {type: "whitePawn",
    color: "white",
    id: "a2" //true for active, false for deceased
    },
    {type: "whitePawn",
    color: "white",
    id: "b2"
    },
    {type: "whitePawn",
    color: "white",
    id: "c2"
    },
    {type: "whitePawn",
    color: "white",
    id: "d2"
    },
    {type: "whitePawn",
    color: "white",
    id: "e2"
    },
    {type: "whitePawn",
    color: "white",
    id: "f2"
    },
    {type: "whitePawn",
    color: "white",
    id: "g2"
    },
    {type: "whitePawn",
    color: "white",
    id: "h2"
    },
    {type: "rook",
    color: "white",
    id: "a1"
    },
    {type: "knight",
    color: "white",
    id: "b1"
    },
    {type: "bishop",
    color: "white",
    id: "c1"
    },
    {type: "queen",
    color: "white",
    id: "d1"
    },
    {type: "king",
    color: "white",
    id: "e1"
    },
    {type: "bishop",
    color: "white",
    id: "f1"
    },
    {type: "knight",
    color: "white",
    id: "g1"
    },
    {type: "rook",
    color: "white",
    id: "h1"
    },
]

export const firstPosition = {
    position: blackPieces.slice().concat(Array(32).fill({type:null})).concat(whitePieces.slice()),
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
    enPassant:{

    },
    takenWhitePieces: [],
    takenBlackPieces: []
}