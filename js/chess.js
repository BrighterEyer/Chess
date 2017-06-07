var chessRadius = 20;

var roles = new Array("帝", "士", "象", "车", "马", "炮", "卒");
var numsOfRoles = new Array(1, 2, 2, 2, 2, 2, 5);

var bodyNode = document.body;
var chessDiv = document.createElement("div");

var chessStyle = "text-align:center;";

function initChesses(thisboard) {
	for(var i = 0; i < roles.length; i++) {
		var newChess = document.createElement("div");
		newChess.style = "position:relative;" +
			"width:" + borderWide + ";height:" + borderWide + ";" +
			"margin-left:" + (offsetX + i * borderWide) + "px;" +
			"margin-top:" + (offsetY) + "px;"+
			"display:inline;border-radius:2px;background-color:green;";
		bodyNode.appendChild(newChess);
	}
}

function generateChess(chess, role, x, y) {
	chess.fillText(role, x, y);
}

function setupRule() {

}

initChesses(board);