import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./TicTacToe.css";
import { useState } from "react";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

const Square: React.FC<{ value: string | null; onClick: () => void }> = ({
    value,
    onClick,
}) => {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );
};

const calculateWinner = (squares: (string | null)[]): string | null => {
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
            return squares[a];
        }
    }
    return null;
};

const Board: React.FC<{
    p1IsNext: boolean;
    squares: (string | null)[];
    onPlay: (nextSquares: (string | null)[]) => void;
}> = ({ p1IsNext, squares, onPlay }) => {
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
                    />
                ))}
            </div>
            <div className="board-row">
                {Array.from({ length: 3 }, (_, index) => (
                    <Square
                        key={index + 3}
                        value={squares[index + 3]}
                        onClick={() => handleClick(index + 3)}
                    />
                ))}
            </div>
            <div className="board-row">
                {Array.from({ length: 3 }, (_, index) => (
                    <Square
                        key={index + 6}
                        value={squares[index + 6]}
                        onClick={() => handleClick(index + 6)}
                    />
                ))}
            </div>
        </>
    );
};

export default function Game() {
    // state variables
    // React useState hook to store state
    // append full grid at each move. Start with empty grid
    const [moveHistory, setMoveHistory] = useState<(string | null)[][]>([
        Array(9).fill(null),
    ]);
    // keep track of current move
    const [currMove, setCurrMove] = useState<number>(0);

    // derived state
    const p1IsNext: boolean = currMove % 2 === 0;
    // current grid is just the last item in the move history
    const currentSquares = moveHistory[currMove];
    // calculates winner and status at each render
    const winner: string | null = calculateWinner(currentSquares);
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

    let status: string;
    if (winner) {
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
                <ol>{moves}</ol>
            </div>
        </div>
    );
}
