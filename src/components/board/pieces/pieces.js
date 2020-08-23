const blackPieces = [
    {type: "rook",
    color: "black",
    id: "a8",
    status: true,
    },
    {type: "knight",
    color: "black",
    id: "b8",
    status: true,
    },
    {type: "bishop",
    color: "black",
    id: "c8",
    status: true,
    },
    {type: "king",
    color: "black",
    id: "d8",
    status: true,
    },
    {type: "queen",
    color: "black",
    id: "e8",
    status: true,
    },
    {type: "bishop",
    color: "black",
    id: "f8",
    status: true,
    },
    {type: "knight",
    color: "black",
    id: "g8",
    status: true,
    },
    {type: "rook",
    color: "black",
    id: "h8",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "a7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "b7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "c7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "d7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "e7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "f7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "g7",
    status: true,
    },
    {type: "blackPawn",
    color: "black",
    id: "h7",
    status: true,
    },
]
const whitePieces = [
    {type: "whitePawn",
    color: "white",
    id: "a2",
    status: true, //true for active, false for deceased
    },
    {type: "whitePawn",
    color: "white",
    id: "b2",
    status: true,
    },
    {type: "whitePawn",
    color: "white",
    id: "c2",
    status: true,
    },
    {type: "whitePawn",
    color: "white",
    id: "d2",
    status: true,
    },
    {type: "whitePawn",
    color: "white",
    id: "e2",
    status: true,
    },
    {type: "whitePawn",
    color: "white",
    id: "f2",
    status: true,
    },
    {type: "whitePawn",
    color: "white",
    id: "g2",
    status: true,
    },
    {type: "whitePawn",
    color: "white",
    id: "h2",
    status: true,
    },
    {type: "rook",
    color: "white",
    id: "a1",
    status: true,
    },
    {type: "knight",
    color: "white",
    id: "b1",
    status: true,
    },
    {type: "bishop",
    color: "white",
    id: "c1",
    status: true,
    },
    {type: "king",
    color: "white",
    id: "d1",
    status: true,
    },
    {type: "queen",
    color: "white",
    id: "e1",
    status: true,
    },
    {type: "bishop",
    color: "white",
    id: "f1",
    status: true,
    },
    {type: "knight",
    color: "white",
    id: "g1",
    status: true,
    },
    {type: "rook",
    color: "white",
    id: "h1",
    status: true,
    },
]

export const firstPosition = {
    position: blackPieces.slice().concat(Array(32).fill({type:null})).concat(whitePieces.slice()),
    check: {
        white: false,
        black: false
    },
    sleepingPawns: {
        a2: true,
        b2: true,
        c2: true,
        d2: true,
        e2: true,
        f2: true,
        g2: true,
        h2: true,
        a7: true,
        b7: true,
        c7: true,
        d7: true,
        e7: true,
        f7: true,
        g7: true,
        h7: true
    },
    sleepingKing:{
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
    }
}