var rows = 5 * 2 - 1;
var cols = 8;
var borderWide = 70;

var boardWidth = cols * borderWide;
var boardHeight = rows * borderWide;

var canvas = document.createElement("canvas");
var board = canvas.getContext("2d");

canvas.width = screen.availWidth * 0.8;
canvas.height = canvas.width * rows / cols;

var offsetX = (document.body.clientWidth - boardWidth) / 2;
//var offsetX = (document.body.scrollWidth - boardWidth) / 2;
var offsetY = 50;

var drawBoard = function() {
	board.width = boardWidth;
	board.height = boardHeight;
	board.fillStyle = "rgb(128,64,0)";
	board.fillRect(offsetX, offsetY, boardWidth, boardHeight);
	this.drawLine(board);
	this.drawBoardText(board);
	document.body.appendChild(canvas);
}

var drawLine = function(board) {
	board.strokeStyle = "#000000";
	//画横线
	for(var i = 0; i < rows + 1; i++) {
		board.moveTo(offsetX, offsetY + i * borderWide);
		board.lineTo(offsetX + boardWidth, offsetY + i * borderWide);
	}
	//画竖线
	for(var i = 0; i < cols + 1; i++) {
		board.moveTo(offsetX + i * borderWide, offsetY);
		board.lineTo(offsetX + i * borderWide, (offsetY + boardHeight - borderWide / 4) / 2);
		board.moveTo(offsetX + i * borderWide, (offsetY + boardHeight - borderWide / 4) / 2 + borderWide);
		board.lineTo(offsetX + i * borderWide, offsetY + boardHeight);
	}
	//画交叉线
	board.moveTo(offsetX + (cols / 2 - 1) * borderWide, offsetY);
	board.lineTo(offsetX + (cols / 2 + 1) * borderWide, offsetY + 2 * borderWide);
	board.moveTo(offsetX + (cols / 2 + 1) * borderWide, offsetY);
	board.lineTo(offsetX + (cols / 2 - 1) * borderWide, offsetY + 2 * borderWide);
	//画交叉线
	board.moveTo(offsetX + (cols / 2 - 1) * borderWide, offsetY + boardHeight - 2 * borderWide);
	board.lineTo(offsetX + (cols / 2 + 1) * borderWide, offsetY + boardHeight);
	board.moveTo(offsetX + (cols / 2 + 1) * borderWide, offsetY + boardHeight - 2 * borderWide);
	board.lineTo(offsetX + (cols / 2 - 1) * borderWide, offsetY + boardHeight);
	board.save();
	board.stroke();
}

function drawBoardText(board) {
	board.font = "20px Georgia";
	board.fillStyle = "rgb(255,0,0)";
	var wordspacing = 20;
	var riverWords = new Array(
		"楚",
		"河",
		"汉",
		"界"
	);
	board.translate(offsetX, offsetY);
	for(var i = 0; i < 2; i++) {
		board.fillText(riverWords[i], boardWidth / 4, boardHeight / 2 + i * wordspacing);
	}
	for(var i = 0; i < 2; i++) {
		board.fillText(riverWords[i + 2], boardWidth / 4 * 3, boardHeight / 2 + i * wordspacing);
	}
	board.stroke();
}

window.onresize = function() {
	canvas.width = screen.availWidth * 0.8;
	canvas.height = canvas.width * rows / cols;
	drawBoard();
}

window.onload = function() {
	drawBoard();
}