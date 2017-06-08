var devMode = "debug";
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
var originXposPx;
var originYposPx;
var dropXpos;
var dropYpos;
var holdedChess; /*当前举的棋子*/
var tipChess; /*提示棋子位置*/
var tipChessZIndex = 1;
var chessZIndex = 32;

function initChesses(thisboard) {
	//摆放化对方棋子
	You();
	//摆放己方棋子
	Mine();
}

function You() {
	//摆放化对方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("green", chessOffsetX + i * borderWide, chessOffsetY);
		newChess.xPos = (i + 1);
		newChess.yPos = 1;
		BuildNodeWithListener(newChess, "green", 4 - i, 1);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("green", chessOffsetX + i * borderWide, chessOffsetY);
		newChess.xPos = (i + 1);
		newChess.yPos = 1;
		BuildNodeWithListener(newChess, "green", i - 4, 2);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("green", chessOffsetX + borderWide, chessOffsetY + 2 * borderWide);
	newChess.xPos = 2;
	newChess.yPos = 3;
	BuildNodeWithListener(newChess, "green", 5, 1);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("green", chessOffsetX + boardWidth - borderWide, chessOffsetY + 2 * borderWide);
	newChess.xPos = 8;
	newChess.yPos = 3;
	BuildNodeWithListener(newChess, "green", 5, 2);
	//摆放卒
	initZus("green");
}

function Mine() {
	//摆放己方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("red", chessOffsetX + i * borderWide, offsetY + boardHeight - borderWide / 2);
		newChess.xPos = (i + 1);
		newChess.yPos = rows + 1;
		BuildNodeWithListener(newChess, "red", 4 - i, 1);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("red", chessOffsetX + i * borderWide, (offsetY + boardHeight - borderWide / 2));
		newChess.xPos = (i + 1);
		newChess.yPos = rows + 1;
		BuildNodeWithListener(newChess, "red", i - 4, 2);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("red", chessOffsetX + borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	newChess.xPos = 2;
	newChess.yPos = (rows + 1) - 2;
	BuildNodeWithListener(newChess, "red", 5, 1);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("red", chessOffsetX + boardWidth - borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	BuildNodeWithListener(newChess, "red", 5, 2);
	newChess.xPos = 8;
	newChess.yPos = (rows + 1) - 2;
	//摆放卒
	initZus("red");
}

function initZus(color) {
	if(color == "red") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNodeStyle("red", chessOffsetX + 2 * i * borderWide, chessOffsetY + boardHeight - 3 * borderWide);
			newChess.xPos = (2 * i) + 1;
			newChess.yPos = (rows + 1) - 4;
			BuildNodeWithListener(newChess, "red", 6, i + 1);
		}
	} else if(color == "green") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNodeStyle("green", chessOffsetX + 2 * i * borderWide, chessOffsetY + 3 * borderWide);
			newChess.xPos = (2 * i) + 1;
			newChess.yPos = 4;
			BuildNodeWithListener(newChess, "green", 6, i + 1);
		}
	}
}

function newNodeStyle(color, left, top) {
	return "position:absolute;border-radius:100%;background-color:" + color + ";" +
		"left:" + left + "px;" +
		"top:" + top + "px;" +
		"width:" + (chessRadius * 2) + "px;" +
		"height:" + (chessRadius * 2) + "px;" +
		"text-align:center;";
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

function holdChessListener(e) {
	if(e.target.tagName == "DIV") {
		holdedChess = e.target;
	} else if(e.target.tagName == "H2") {
		holdedChess = e.target.parentNode;
	} else {
		logger(devMode, "没有点击棋子!");
		return;
	}
	var bool = holdedChess.hold;
	if(bool && holdOne) {
		originXpos = holdedChess.style.left;
		originYpos = holdedChess.style.top;
		holdOne = false;
		holdedChess.hold = false;
		if(ApplyRule()) {
			/*当棋子正确落下时设置棋子为当前x、y坐标*/
			holdedChess.style.left = getCurChessPosXpx();
			holdedChess.style.top = getCurChessPosYpx();
		} else {
			holdedChess.style.left = originXposPx;
			holdedChess.style.top = originYposPx;
		}
		holdedChess.style.zindex = chessZIndex * 2;
		logger(devMode, holdedChess.innerText + "被放下");
		holdedChess = null; //重置防止重复引用
	} else if(!holdOne) {
		holdOne = true;
		holdedChess.hold = true;
		originXposPx = holdedChess.style.left;
		originYposPx = holdedChess.style.top;
		logger(devMode, holdedChess.innerText + "被举起");
	}
}

function getCurChessPosXpx() {
	return(chessOffsetX + (dropXpos - 1) * borderWide) + "px";
}

function getCurChessPosYpx() {
	return(chessOffsetY + (dropYpos - 1) * borderWide) + "px";
}

document.onmousemove = function(ev) {
	var xPos = ev.clientX;
	var yPos = ev.clientY;
	logger(devMode, "onmousemove holdOne : " + holdOne);

	if(holdOne) {
		holdedChess.style.left = (xPos - chessRadius) + "px";
		holdedChess.style.top = (yPos - chessRadius) + "px";

		/*复制 当前所举的棋子的属性*/
		//提示棋子只需要创建一次
		if(null == tipChess) {
			tipChess = document.createElement("div");
			tipChess.style = newNodeStyle("", -borderWide, -borderWide);
			tipChess.style.border = "2px red solid";
			tipChess.style.zIndex = tipChessZIndex;
			bodyNode.appendChild(tipChess);
		}
	} else {
		if(tipChess && tipChess.style.display != "none")
			tipChess.style.display = "none";
	}

	if(holdOne) {
		PlaceTipChess();
		//		logger(devMode, "提示棋子为空 : " + (tipChess == null));
		if(IsCursorInBoard(xPos, yPos)) {
			var i, j;
			for(i = 0; i < cols && xPos - chessOffsetX - i * borderWide > 0; i++) {}
			for(j = 0; j < rows && yPos - chessOffsetY - j * borderWide > 0; j++) {}
			if(xPos - i * borderWide < i * borderWide - xPos) {
				dropXpos = i - 1;
			} else {
				dropXpos = i;
			}
			if(yPos - j * borderWide < j * borderWide - yPos) {
				dropYpos = j;
			} else {
				dropYpos = j + 1;
			}
			//			logger(devMode, "tipChess css 属性 : " + tipChess);
			logger(devMode, "nearestPointX : " + (dropXpos) + "  ;  " + "nearestPointY : " + (dropYpos));
			Drop2PlaceWithJudge(holdedChess, dropXpos, dropYpos);
		}
	}
}

/*放置提示棋子,优化写法*/
function PlaceTipChess() {
	if(tipChess.style.left != getCurChessPosXpx()) {
		tipChess.style.left = getCurChessPosXpx();
	}
	if(tipChess.style.top != getCurChessPosYpx()) {
		tipChess.style.top = getCurChessPosYpx();
	}
	if(tipChess.style.display != "inline-block") {
		tipChess.style.display = "inline-block";
	}
}

function IsCursorInBoard(x, y) {
	if(x - offsetX >= 0 && x - offsetX <= boardWidth && y - offsetY >= 0 && y - offsetY <= boardHeight) {
		return true;
	} else {
		return false;
	}
}

/*举棋时，holdedChess不为空，可以执行,下面的下棋逻辑判断*/
function ApplyRule() {
	logger("debug", holdedChess.roleId);
	switch(parseInt(holdedChess.roleId, 10)) {
		case 0:
			logger(devMode, "Drop2PlaceWithJudge chess.xPos : " + holdedChess.xPos);
			logger(devMode, "Drop2PlaceWithJudge chess.yPos : " + holdedChess.yPos);
			if(dropXpos >= 4 && dropXpos <= 6 &&
				dropYpos >= 1 && dropYpos <= 3) {
				logger("debug", "放置范围合理");
				return true;
			}
			return false;
		case 1:
			return false;
		case 2:
			return false;
		case 3:
			return false;
		case 4:
			return false;
		case 5:
			return false;
		case 6:
			return false;
	}
	return false;
}

function Drop2PlaceWithJudge(chess, _dropXpos, _dropYpos) {
	//判断角色行走路径是否正确
	logger(devMode, "角色:" + chess.roleType + roles[chess.roleId]);
}