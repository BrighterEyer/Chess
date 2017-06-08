var chessSpacing = 5;

var chessRadius = borderWide / 2 - chessSpacing;

var roles = new Array("帝", "士", "象", "马", "车", "炮", "卒");
var rolesId = new Array(0, 1, 2, 3, 4, 5, 6);

var bodyNode = document.body;
var chessDiv = document.createElement("div");

var chessArr1 = new Array();
var chessArr2 = new Array();

var chessOffsetX = offsetX - borderWide / 2;
var chessOffsetY = offsetY - borderWide / 2;

var holdOne = false;

var rangeX = {
	x0: offsetX,
	x1: offsetX + boardWidth
};
var rangeY = {
	y0: offsetY,
	y1: offsetY + boardHeight
};

var devMode = "debug";

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
		BuildNodeWithListener(newChess, "green", 4 - i, 1);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNode("green", chessOffsetX + i * borderWide, chessOffsetY);
		BuildNodeWithListener(newChess, "green", i - 4, 2);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("green", chessOffsetX + borderWide, chessOffsetY + 2 * borderWide);
	BuildNodeWithListener(newChess, "green", 5, 1);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("green", chessOffsetX + boardWidth - borderWide, chessOffsetY + 2 * borderWide);
	BuildNodeWithListener(newChess, "green", 5, 2);
	initZus("green");
}

function Mine() {
	//摆放己方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNode("red", chessOffsetX + i * borderWide, offsetY + boardHeight - borderWide / 2);
		BuildNodeWithListener(newChess, "red", 4 - i, 1);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNode("red", chessOffsetX + i * borderWide, (offsetY + boardHeight - borderWide / 2));
		BuildNodeWithListener(newChess, "red", i - 4, 2);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("red", chessOffsetX + borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	BuildNodeWithListener(newChess, "red", 5, 1);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNode("red", chessOffsetX + boardWidth - borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	BuildNodeWithListener(newChess, "red", 5, 2);
	initZus("red");
}

function initZus(color) {
	if(color == "red") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNode("red", chessOffsetX + 2 * i * borderWide, chessOffsetY + boardHeight - 3 * borderWide);
			BuildNodeWithListener(newChess, "red", 6, i + 1);
		}
	} else if(color == "green") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNode("green", chessOffsetX + 2 * i * borderWide, chessOffsetY + 3 * borderWide);
			BuildNodeWithListener(newChess, "green", 6, i + 1);
		}
	}
}

function newNode(color, left, top) {
	return "position:absolute;border-radius:100%;background-color:" + color + ";" +
		"left:" + left + "px;" +
		"top:" + top + "px;" +
		"width:" + (chessRadius * 2) + "px;" +
		"height:" + (chessRadius * 2) + "px;" +
		"text-align:center";
}

function BuildNodeWithListener(newChess, roleType, roleId, roleOrder) {
	newChess.hold = false;
	newChess.roleType = roleType;
	newChess.roleId = roleId;
	newChess.roleOrder = roleOrder;
	newChess.addEventListener('click', holdChessListener);
	bodyNode.appendChild(newChess);
	newChess.innerHTML = "<h2>" + roles[roleId] + "</h2>";
	if(roleType = "green") {
		chessArr1.push(roleType + "_" + roleId + "_" + roleOrder, newChess);
	} else {
		chessArr2.push(roleType + "_" + roleId + "_" + roleOrder, newChess);
	}
}

initChesses(board);

var holdedChess;

function holdChessListener(e) {
	if(e.target.tagName == "DIV") {
		holdedChess = e.target;
	} else if(e.target.tagName == "H2") {
		holdedChess = e.target.parentNode;
	} else {
		logger("debug", "没有点击棋子!");
		return;
	}
	var bool = holdedChess.hold;
	if(bool && holdOne) {
		holdOne = false;
		holdedChess.hold = false;
		logger("debug", holdedChess.innerText + "被放下");
		holdedChess = null;
	} else if(!holdOne) {
		holdOne = true;
		holdedChess.hold = true;
		logger("debug", holdedChess.innerText + "被举起");
	}
}
var floatChess;
document.onmousemove = function(ev) {
	var xPos = ev.clientX;
	var yPos = ev.clientY;
	logger("debug", "onmousemove holdOne : " + holdOne);
	if(holdOne) {
		holdedChess.style.left = (xPos - chessRadius) + "px";
		holdedChess.style.top = (yPos - chessRadius) + "px";
	}
}

console.log(rangeX);
console.log(rangeY);