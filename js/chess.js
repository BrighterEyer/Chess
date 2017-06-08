var chessSpacing = 5;

var chessRadius = borderWide / 2 - chessSpacing;

var roles = new Array("帝", "士", "象", "马", "车", "炮", "卒");
var numsOfRoles = new Array(1, 2, 2, 2, 2, 2, 5);

var bodyNode = document.body;
var chessDiv = document.createElement("div");

var chessArr1 = new Array();
var chessArr2 = new Array();

var chessOffsetX = offsetX - borderWide / 2;
var chessOffsetY = offsetY - borderWide / 2;

var rangeX = {
	x0: offsetX,
	x1: offsetX + boardWidth
};
var rangeY = {
	y0: offsetY,
	y1: offsetY + boardHeight
};

function initChesses(thisboard) {
	//摆放化对方棋子
	You();
	//摆放己方棋子
	Mine();
	//摆放卒
}

function You() {
	//摆放化对方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNode("green", chessOffsetX + i * borderWide, chessOffsetY);
		newChess.innerHTML = "<h2>" + roles[4 - i] + "</h2>";

		bodyNode.appendChild(newChess);
		chessArr1.push("green-" + roles[4 - i] + "1", newChess);
	}
	//	console.log(chessArr1);
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNode("green", chessOffsetX + i * borderWide, chessOffsetY);
		newChess.innerHTML = "<h2>" + roles[i - 4] + "</h2>";

		bodyNode.appendChild(newChess);
		chessArr1.push("green-" + roles[i - 4] + "2", newChess);
	}
	console.log(chessArr1);
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("green", chessOffsetX + borderWide, chessOffsetY + 2 * borderWide);
	newChess.innerHTML = "<h2>炮</h2>";

	bodyNode.appendChild(newChess);
	chessArr1.push("green-炮1", newChess);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("green", chessOffsetX + boardWidth - borderWide, chessOffsetY + 2 * borderWide);
	newChess.innerHTML = "<h2>炮</h2>";

	bodyNode.appendChild(newChess);
	chessArr1.push("green-炮2", newChess);
	initZus("green");
}

function Mine() {
	//摆放己方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNode("red", chessOffsetX + i * borderWide, offsetY + boardHeight - borderWide / 2);
		newChess.innerHTML = "<h2>" + roles[4 - i] + "</h2>";

		bodyNode.appendChild(newChess);
		chessArr2.push("red-" + roles[4 - i] + "1", newChess);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNode("red", chessOffsetX + i * borderWide, (offsetY + boardHeight - borderWide / 2));
		newChess.innerHTML = "<h2>" + roles[i - 4] + "</h2>";

		bodyNode.appendChild(newChess);
		chessArr2.push("red-" + roles[i - 4] + "2", newChess);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("red", chessOffsetX + borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	newChess.innerHTML = "<h2>炮</h2>";

	bodyNode.appendChild(newChess);
	chessArr2.push("green-炮1", newChess);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("red", chessOffsetX + boardWidth - borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	newChess.innerHTML = "<h2>炮</h2>";

	bodyNode.appendChild(newChess);
	chessArr2.push("green-炮2", newChess);
	initZus("red");
}

function initZus(color) {
	if(color == "red") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNode("red", chessOffsetX + 2 * i * borderWide, chessOffsetY + boardHeight - 3 * borderWide);
			newChess.innerHTML = "<h2>卒</h2>";

			bodyNode.appendChild(newChess);
			chessArr2.push("red-卒" + (i + 1), newChess);
		}
	} else if(color == "green") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNode("green", chessOffsetX + 2 * i * borderWide, chessOffsetY + 3 * borderWide);
			newChess.innerHTML = "<h2>卒</h2>";
			newChess.point=1;
			bodyNode.appendChild(newChess);
			chessArr1.push("green-卒" + (i + 1), newChess);
		}
	}
	console.log(newChess.point);
}

function newNode(color, left, top) {
	return "position:absolute;border-radius:100%;background-color:" + color + ";" +
		"left:" + left + "px;" +
		"top:" + top + "px;" +
		"width:" + (chessRadius * 2) + "px;" +
		"height:" + (chessRadius * 2) + "px;" +
		"text-align:center";
}

initChesses(board);

function mousePosition(ev) {
	if(ev.pagesX || ev.pageY) {
		return {
			x: ev.pageX,
			y: ev.pageY
		};
	}
}

document.onmousemove = function(ev) {
	ev = ev || window.event;
	var mousePos = mousePosition(ev);
}