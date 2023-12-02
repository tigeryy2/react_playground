import React from "react";
import "./TicTacToe.css";
import { useState } from "react";

const Square: React.FC<{
    /** The value of the square, either 'X', 'O', or null */
    value: string | null;
    /** The function to call when the square is clicked */
    onClick: () => void;
    /**
     * Whether this square is part of the winning line.
     * If true, color is modified to highlight the winning line
     * */
    winning: boolean;
}> = ({ value, onClick, winning }) => {
    return (
        <button
            className="square"
            onClick={onClick}
            style={{ color: winning ? "gold" : "black" }}
        >
            {value}
        </button>
    );
};

const calculateWinningSquares = (
    squares: (string | null)[],
): number[] | null => {
    // caculate winning squares and return them as array
    const lines = [
        // horizontal
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // vertical
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // diagonal
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // triple equals for strict equality -> type AND value must match
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return lines[i];
        }
    }
    return null;
};

const calculateWinner = (squares: (string | null)[]): string | null => {
    const winningSquares = calculateWinningSquares(squares);
    if (winningSquares) {
        // if we have winning squares, we can find the winner from the value
        // of the first square (or any square)
        return squares[winningSquares[0]];
    }
    return null;
};

const calculateDraw = (squares: (string | null)[]): boolean => {
    return !squares.includes(null);
};

const Board: React.FC<{
    p1IsNext: boolean;
    squares: (string | null)[];
    onPlay: (nextSquares: (string | null)[]) => void;
}> = ({ p1IsNext, squares, onPlay }) => {
    const winningSquares: number[] | null = calculateWinningSquares(squares);

    const handleClick = (index: number) => {
        // if we've already filled this square or the game is run, do nothing
        if (calculateWinner(squares) || squares[index]) return;

        // create a copy instead of modifying the existing array -> this allows immutability
        const nextSquares = squares.slice();
        nextSquares[index] = p1IsNext ? "X" : "O";
        onPlay(nextSquares);
    };

    return (
        <>
            <div className="board-row">
                {Array.from({ length: 3 }, (_, index) => (
                    <Square
                        key={index}
                        value={squares[index]}
                        onClick={() => handleClick(index)}
                        winning={winningSquares?.includes(index) ?? false}
                    />
                ))}
            </div>
            <div className="board-row">
                {Array.from({ length: 3 }, (_, index) => (
                    <Square
                        key={index + 3}
                        value={squares[index + 3]}
                        onClick={() => handleClick(index + 3)}
                        winning={winningSquares?.includes(index + 3) ?? false}
                    />
                ))}
            </div>
            <div className="board-row">
                {Array.from({ length: 3 }, (_, index) => (
                    <Square
                        key={index + 6}
                        value={squares[index + 6]}
                        onClick={() => handleClick(index + 6)}
                        winning={winningSquares?.includes(index + 6) ?? false}
                    />
                ))}
            </div>
        </>
    );
};

export default function TicTacToeGame() {
    // state variables
    // React useState hook to store state
    // append full grid at each move. Start with empty grid
    const [moveHistory, setMoveHistory] = useState<(string | null)[][]>([
        Array(9).fill(null),
    ]);
    // keep track of current move
    const [currMove, setCurrMove] = useState<number>(0);
    const [movesOrderReversed, setMovesOrderReversed] = useState<boolean>(true);

    // derived state
    const p1IsNext: boolean = currMove % 2 === 0;
    // current grid is just the last item in the move history
    const currentSquares = moveHistory[currMove];
    // calculates winner and status at each render
    const winner: string | null = calculateWinner(currentSquares);
    // Check for draw
    const draw: boolean = calculateDraw(currentSquares);

    const moves = moveHistory.map((currentSquares, move) => {
        let description: string;
        if (move === currMove) {
            description = "Current Move #" + move;
        } else {
            description = move ? "Go to move #" + move : "Start Over";
        }
        return (
            // Need to provide react with a unique key for each item in the list
            <li key={move}>
                <button onClick={() => moveTravel(move)}>{description}</button>
            </li>
        );
    });

    const movesOrdered = movesOrderReversed ? moves.reverse() : moves;

    let status: string;
    if (draw) {
        status = "Draw! Everyone loses, that's not very American...";
    } else if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (p1IsNext ? "X" : "O");
    }

    // pass this function to Board component, allowing it to update state
    const handlePlay = (nextSquares: (string | null)[]) => {
        // '...' is the spread operator, similar to list unpacking in python
        // use the slice to effectively remove future moves if we go back in time
        const newHistory: (string | null)[][] = [
            ...moveHistory.slice(0, currMove + 1),
            nextSquares,
        ];
        setMoveHistory(newHistory);
        setCurrMove(newHistory.length - 1);
    };

    const moveTravel = (move: number) => {
        setCurrMove(move);
        setMoveHistory(moveHistory.slice(0, move + 1));
    };

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    p1IsNext={p1IsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <button
                    onClick={() => setMovesOrderReversed(!movesOrderReversed)}
                >
                    Reverse Moves{" "}
                </button>
                <ul className={"no-bullets"}>{movesOrdered}</ul>
            </div>
        </div>
    );
}
