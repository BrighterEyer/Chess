var chessRadius = 20;

function initChess(thisboard) {
	thisboard.closePath();
	var chess = thisboard;
	chess.restore();
	chess.beginPath();
	chess.arc(offsetX, offsetY, 0, 360, true);
	chess.lineWidth=5;
	chess.strokeStyle = "red";
	chess.closePath();
}

initChess(board);

