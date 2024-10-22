// src/components/SudokuBoard.js
import React, { useState, useEffect } from 'react';
import './styles.css';

const initialBoard = [
    [9, 8, 5, 4, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0],
    [1, 0, 6, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 0, 0, 0, 0],
    [4, 0, 2, 0, 0, 9, 0, 0, 3],
    [0, 9, 0, 0, 6, 3, 4, 0, 0],
    [0, 6, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 5],
    [2, 0, 0, 0, 0, 0, 0, 0, 1],
];

const SudokuBoard = () => {
    const [board, setBoard] = useState(initialBoard);
    const [selectedCell, setSelectedCell] = useState(null);
    const [editableCells, setEditableCells] = useState(new Set());
    const [invalidCells, setInvalidCells] = useState(new Set());
    const [won, setWon] = useState(false);

    useEffect(() => {
        checkWinCondition();
    }, [board, invalidCells]);

    const checkWinCondition = () => {
        const allFilled = board.every(row => row.every(cell => cell !== 0));
        if (allFilled && invalidCells.size === 0) {
            setWon(true);
        }
    };

    const handleCellClick = (row, col) => {
        if (canEditCell(row, col)) {
            setSelectedCell({ row, col });
        }
    };

    const canEditCell = (row, col) => {
        return board[row][col] === 0 || editableCells.has(`${row}-${col}`);
    };

    const handleNumberClick = (number) => {
        if (selectedCell) {
            const { row, col } = selectedCell;

            const rowInvalid = isInRow(row, number);
            const colInvalid = isInColumn(col, number);
            const squareInvalid = isInSquare(row, col, number);

            const newInvalidCells = new Set(invalidCells);

            if (rowInvalid) {
                for (let c = 0; c < 9; c++) {
                    newInvalidCells.add(`${row}-${c}`);
                }
            }

            if (colInvalid) {
                for (let r = 0; r < 9; r++) {
                    newInvalidCells.add(`${r}-${col}`);
                }
            }

            if (squareInvalid) {
                const startRow = Math.floor(row / 3) * 3;
                const startCol = Math.floor(col / 3) * 3;
                for (let r = startRow; r < startRow + 3; r++) {
                    for (let c = startCol; c < startCol + 3; c++) {
                        newInvalidCells.add(`${r}-${c}`);
                    }
                }
            }

            updateBoard(row, col, number);

            if (!rowInvalid && !colInvalid && !squareInvalid) {
                removeInvalidCells(row, col);
            } else {
                setInvalidCells(newInvalidCells);
            }

            setSelectedCell(null);
        }
    };

    const isInRow = (row, number) => {
        return board[row].includes(number);
    };

    const isInColumn = (col, number) => {
        return board.some(r => r[col] === number);
    };

    const isInSquare = (row, col, number) => {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (board[r][c] === number) {
                    return true;
                }
            }
        }
        return false;
    };

    const updateBoard = (row, col, number) => {
        const newBoard = [...board];
        newBoard[row][col] = number;
        setBoard(newBoard);
        setEditableCells((prev) => new Set(prev).add(`${row}-${col}`));
    };

    const removeInvalidCells = (row, col) => {
        const newInvalidCells = new Set(invalidCells);
        for (let c = 0; c < 9; c++) {
            newInvalidCells.delete(`${row}-${c}`);
        }
        for (let r = 0; r < 9; r++) {
            newInvalidCells.delete(`${r}-${col}`);
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                newInvalidCells.delete(`${r}-${c}`);
            }
        }
        setInvalidCells(newInvalidCells);
    };

    const renderCell = (cell, rowIndex, colIndex) => {
        const isEditable = editableCells.has(`${rowIndex}-${colIndex}`);
        const isInvalid = invalidCells.has(`${rowIndex}-${colIndex}`);

        return (
            <div
                key={colIndex}
                className={`sudoku-cell ${cell !== 0 ? 'fixed' : ''} ${isEditable ? 'editable' : ''} ${isInvalid ? 'invalid' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
            >
                {cell !== 0 ? cell : ''}
            </div>
        );
    };

    const renderRow = (row, rowIndex) => {
        return (
            <div className="sudoku-row" key={rowIndex}>
                {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
            </div>
        );
    };

    const renderBoard = () => {
        return board.map((row, rowIndex) => renderRow(row, rowIndex));
    };

    return (
        <div className="sudoku-container">
            <div className="sudoku-board">{renderBoard()}</div>
            {selectedCell && (
                <div className="number-picker">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                        <button key={number} onClick={() => handleNumberClick(number)}>
                            {number}
                        </button>
                    ))}
                </div>
            )}
            {won && <div className="win-message">Gratulacje! Wygra³eœ!</div>}
        </div>
    );
};

export default SudokuBoard;
