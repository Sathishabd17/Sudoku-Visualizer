
/**
*	Select all "col" class to do operations in future. 
*/
var table_query = document.querySelectorAll(".col");

/**
*	Sudoku Board to visualize algorithm.
*/
var Sudoku_Board;

/**
*	Start function to start page
*/
Start('easy');
async function Start(difficulty)
{
	await fetch('https://sugoku.herokuapp.com/board?difficulty=' + difficulty)
			.then(function(response) {
					return response.json();
				})
				.then(function(board) {
					Org_Board = board.board;
				});
				
	Initialboard();
}

/**
*	function to show initial board
*/
function Initialboard()
{
	for(var row = 0; row < 9; row++)
	{
		for(var col = 0; col < 9; col++)
		{
			if(row >= 0 && row <= 2 && (col >= 0 && col <= 2) || row >= 0 && row <= 2 && (col >= 6 && col <= 8))
			{
				if(Org_Board[row][col] != 0)
				{
					table_query[(row * 9) + col].innerText = Org_Board[row][col];
					table_query[(row * 9) + col].style.backgroundColor = '#e6ffff';
				} else {
					table_query[(row * 9) + col].style.backgroundColor = '#e6ffff';
				}
			}
			else if(row >= 6 && row <= 8 && (col >= 0 && col <= 2) || row >= 6 && row <= 8 && (col >= 6 && col <= 8))
			{
				if(Org_Board[row][col] != 0)
				{
					table_query[(row * 9) + col].innerText = Org_Board[row][col];
					table_query[(row * 9) + col].style.backgroundColor = '#e6ffff';
				} else {
					table_query[(row * 9) + col].style.backgroundColor = '#e6ffff';
				}
			}
			else if(row >= 3 && row <= 5 && (col >= 3 && col <= 5))
			{
				if(Org_Board[row][col] != 0)
				{
					table_query[(row * 9) + col].innerText = Org_Board[row][col];
					table_query[(row * 9) + col].style.backgroundColor = '#e6ffff';
				} else {
					table_query[(row * 9) + col].style.backgroundColor = '#e6ffff';
				}
			}
			else {
				if(Org_Board[row][col] != 0)
				{
					table_query[(row * 9) + col].innerText = Org_Board[row][col];
				}
			}
		}
	}
}

/**
*	function to change board when selecting difficulty
*/
function changeDifficulty()
{
	var difficulty_selector = document.querySelector(".difficulty-selection");
	var difficulty = difficulty_selector.options[difficulty_selector.selectedIndex].value;
	
	for(let i = 0; i < 81; i++)
	{
		table_query[i].innerText = '';
		table_query[i].style.removeProperty('color');
		table_query[i].style.removeProperty('background-color');
	}
	
	Start(difficulty);
}

/**
*	function to generate new board
*/
function GenerateBoard()
{
	changeDifficulty();
}

/**
*	function to visualize Sudoku Algorithm
*/
async function Visualize()
{
	var speed_selector = document.querySelector(".speed-selection");
	var Speed = speed_selector.options[speed_selector.selectedIndex].value;
	
	let row = -1;
	let col = -1;
	let isEmpty = true;
	
	// checking empty cells
	for(let i = 0; i < 9; i++)
	{
		for(let j = 0; j < 9; j++)
		{
			if(Org_Board[i][j] == 0)
			{
				row = i;
				col = j;
				isEmpty = false;
				break;
			}
		}
		if(!isEmpty)
		{
			break;
		}
	}
	
	if(isEmpty) {
		for(var i = 0; i < 9; i++)
		{
			for(let j = 0; j < 9; j++)
			{
				table_query[(i * 9) + j].style.backgroundColor = '#e6ffff';
			}
		}
		return true;
	}
	
	// Visualizer main action
	for(let i = 1; i <= 9; i++)
	{
		table_query[(row * 9) + col].style.color = 'red';
		table_query[(row * 9) + col].innerText = i;
		if(Speed == 1000)
			await sleep(Speed - 700);
		else if(Speed == 500)
			await sleep(Speed - 350);
		else
			await sleep(0);
		
		if(isSafe(row, col, i))
		{
			Org_Board[row][col] = i;
			
			table_query[(row * 9) + col].innerText = i;
			
			if(Speed == 1000)
				await sleep(Speed - 700);
			else if(Speed == 500)
				await sleep(Speed - 350);
			else
				await sleep(0);
			
			if(await Visualize())
				return true;
			
			////////     Back-tarck      /////////
			
			Org_Board[row][col] = 0;
			
			if(Speed == 1000)
				await sleep(Speed - 700);
			else if(Speed == 500)
				await sleep(Speed - 350);
			else
				await sleep(0);
			
			table_query[(row * 9) + col].innerText = '';
		}
		else {
			table_query[(row * 9) + col].innerText = '';
		}
	}	
	return false;
}

/**
*	function to check value is safe or not
*/
function isSafe(row, col, value)
{
	if(col == 9)
		col = 8;

	return NotLieInRow(row, value) && 
			NotLieInCol(col, value) &&
			NotLieInBox(row - row % 3, col - col % 3, value)
			&& Org_Board[row][col] == 0;
}

/**
*	function to check value is lieing or not in row
*/
function NotLieInRow(row, value)
{
	for(let i = 0; i < 9; i++)
	{
		if(Org_Board[row][i] == value)
		{
			return false;
		}
	}
	return true;
}

/**
*	function to check value is lieing or not in column
*/
function NotLieInCol(col, value)
{
	for(let i = 0; i < 9; i++)
	{
		if(Org_Board[i][col] == value)
		{
			return false;
		}
	}
	return true;
}

/**
*	function to check value is lieing or not in 3X3 matrix
*/
function NotLieInBox(boxStartRow, boxStartCol, value)
{
	for(let row = 0; row < 3; row++)
	{
		for(let col = 0; col < 3; col++)
		{
			if(Org_Board[row + boxStartRow][col + boxStartCol] == value)
			{
				return false;
			}
		}
	}
	return true;
}

/**
*	function to deley process for clear visualization
*/
async function sleep(speed)
{
	return new Promise((resolve, reject) => {
		setTimeout(resolve, speed);
	});
}

/**
*	function to reset board
*/
function ResetBoard()
{
	for(let i = 0; i < 81; i++)
	{
		table_query[i].innerText = '';
		table_query[i].style.removeProperty('background-color');
	}
	Org_Board = IntializeBoard();
}

/**
*	function to initialize board when resetting
*/
function IntializeBoard()
{
	let array = Array(9).fill().map(() => Array(9).fill(0));
	return array;
}