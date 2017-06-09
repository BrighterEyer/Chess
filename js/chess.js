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
var originXpos;
var originYpos;
var originXposPx;
var originYposPx;
var dropXpos;
var dropYpos;
var holdedChess; /*当前举的棋子*/
var tipChess; /*提示棋子位置*/
var tipChessZIndex = 1;
var chessZIndex = 32;

var labelDiv;
var label2Div;
var label3Div;

//flags 
var flagArr1Size = 0;
var flagArr2Size = 0;
var flagNewArr1Size = 0;
var flagNewArr2Size = 0;
var flagPushTimes = 0;

var xyMap = []; //或者 new Array()
var FLAG_NONE = 0;
var FLAG_GREEN = 1;
var FLAG_RED = 2;

var myRound = true; /*true为"red"一方,举棋的时候设置相反,即对方回合*/

function InitMap() {
	for(var i = 0; i < cols + 1; i++) {
		xyMap[i] = new Array();
		for(var j = 0; j < rows + 1; j++) {
			xyMap[i][j] = FLAG_NONE;
		}
	}
	//	logger("debug", xyMap);
}

function InitChesses(thisboard) {
	InitMap();
	//摆放化对方棋子
	You();
	//摆放己方棋子
	Mine();
	InitMyDebugDiv();
}

function InitMyDebugDiv() {
	labelDiv = document.createElement("div");
	label2Div = document.createElement("div");
	label3Div = document.createElement("div");
	labelDiv.style = "position:absolute;left:" + window.screen.width / 8 + "px;top:50px;width:200px;height:200px;" +
		"background-color:black;color:white;" +
		"text-align:center;";
	label2Div.style = "position:absolute;left:" + window.screen.width / 8 + "px;top:300px;width:200px;height:300px;" +
		"background-color:black;color:white;" +
		"text-align:center;";
	label3Div.style = "position:absolute;right:" + window.screen.width / 8 + "px;top:50px;width:200px;height:300px;" +
		"background-color:black;color:white;" +
		"text-align:center;";
	bodyNode.appendChild(labelDiv);
	bodyNode.appendChild(label2Div);
	bodyNode.appendChild(label3Div);
}

function You() {
	//摆放化对方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("green", chessOffsetX + i * borderWide, chessOffsetY);
		newChess.xPos = (i + 1);
		newChess.yPos = 1;
		xyMap[i][0] = FLAG_GREEN;
		BuildNodeWithListener(newChess, "green", 4 - i, 1);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("green", chessOffsetX + i * borderWide, chessOffsetY);
		newChess.xPos = (i + 1);
		newChess.yPos = 1;
		xyMap[i][0] = FLAG_GREEN;
		BuildNodeWithListener(newChess, "green", i - 4, 2);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("green", chessOffsetX + borderWide, chessOffsetY + 2 * borderWide);
	newChess.xPos = 2;
	newChess.yPos = 3;
	xyMap[2 - 1][3 - 1] = FLAG_GREEN;
	BuildNodeWithListener(newChess, "green", 5, 1);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("green", chessOffsetX + boardWidth - borderWide, chessOffsetY + 2 * borderWide);
	newChess.xPos = 8;
	newChess.yPos = 3;
	xyMap[8 - 1][3 - 1] = FLAG_GREEN;
	BuildNodeWithListener(newChess, "green", 5, 2);
	//摆放卒
	InitZus("green");
}

function Mine() {
	//摆放己方棋子
	for(var i = 4; i >= 0; i--) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("red", chessOffsetX + i * borderWide, offsetY + boardHeight - borderWide / 2);
		newChess.xPos = (i + 1);
		newChess.yPos = rows + 1;
		xyMap[i][rows] = FLAG_RED;
		BuildNodeWithListener(newChess, "red", 4 - i, 1);
	}
	for(var i = 5; i < 5 * 2 - 1; i++) {
		var newChess = document.createElement("div");
		newChess.style = newNodeStyle("red", chessOffsetX + i * borderWide, (offsetY + boardHeight - borderWide / 2));
		newChess.xPos = (i + 1);
		newChess.yPos = rows + 1;
		xyMap[i][rows] = FLAG_RED;
		BuildNodeWithListener(newChess, "red", i - 4, 2);
	}
	//左边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("red", chessOffsetX + borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	newChess.xPos = 2;
	newChess.yPos = (rows + 1) - 2;
	xyMap[2 - 1][rows - 2] = FLAG_RED;
	BuildNodeWithListener(newChess, "red", 5, 1);
	//右边的"炮"
	var newChess = document.createElement("div");
	newChess.style = newNodeStyle("red", chessOffsetX + boardWidth - borderWide, chessOffsetY + boardHeight - 2 * borderWide);
	newChess.xPos = 8;
	newChess.yPos = (rows + 1) - 2;
	xyMap[8 - 1][rows - 2] = FLAG_RED;
	BuildNodeWithListener(newChess, "red", 5, 2);
	//摆放卒
	InitZus("red");
}

function InitZus(color) {
	if(color == "red") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNodeStyle("red", chessOffsetX + 2 * i * borderWide, chessOffsetY + boardHeight - 3 * borderWide);
			newChess.xPos = (2 * i) + 1;
			newChess.yPos = (rows + 1) - 4 + 1;
			xyMap[2 * i][rows - 3] = FLAG_RED;
			BuildNodeWithListener(newChess, "red", 6, i + 1);
		}
	} else if(color == "green") {
		for(var i = 0; i < 5; i++) {
			var newChess = document.createElement("div");
			newChess.style = newNodeStyle("green", chessOffsetX + 2 * i * borderWide, chessOffsetY + 3 * borderWide);
			newChess.xPos = (2 * i) + 1;
			newChess.yPos = 4;
			xyMap[2 * i][4 - 1] = FLAG_GREEN;
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
	++flagPushTimes;
	newChess.hold = false;
	newChess.roleType = roleType;
	newChess.roleId = roleId;
	newChess.roleOrder = roleOrder;
	newChess.addEventListener('click', holdChessListener);
	bodyNode.appendChild(newChess);
	newChess.innerHTML = "<h2>" + roles[roleId] + "</h2>";
	if(roleType == "green") {
		flagArr1Size += 1;
		chessArr1.push(roleType + "_" + roleId + "_" + roleOrder, newChess);
	} else {
		flagArr2Size += 1;
		chessArr2.push(roleType + "_" + roleId + "_" + roleOrder, newChess);
	}
}

InitChesses(board);

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
		holdOne = false;
		holdedChess.hold = false;
		//当规则通过的时候设置px位置
		if(CanBeNextPos() && ApplyRule()) {
			xyMap[originXpos - 1][originYpos - 1] = FLAG_NONE;
			xyMap[dropXpos - 1][dropYpos - 1] = (holdedChess.roleType == "red") ? FLAG_RED : FLAG_GREEN;
			/*当棋子正确落下时设置棋子为当前x、y坐标*/
			holdedChess.style.left = getCurChessPosXpx();
			holdedChess.style.top = getCurChessPosYpx();
			holdedChess.xPos = dropXpos;
			holdedChess.yPos = dropYpos;

			myRound = !myRound;
			holdedChess.style.zIndex = chessZIndex * 2;
		} else {
			//不通过时回滚
			holdedChess.style.left = originXposPx;
			holdedChess.style.top = originYposPx;
			//这里可以不用再次标识原位置,没有通过规则,xPos和yPos是没有改变的
			//			originXpos = holdedChess.xPos;
			//			originYpos = holdedChess.yPos;
		}
		logger(devMode, holdedChess.innerText + "被放下");
		traverseXYmap();
		//		logger("debug", xyMap);
		//		logger("alert", "棋 x 位置:" + holdedChess.xPos + " ; " + "棋 y 位置:" + holdedChess.yPos);
		//				logger("alert", "棋 x 位置:" + dropXpos + " ; " + "棋 y 位置:" + dropYpos);
		labelDiv.innerHTML = "<h4>" + holdedChess.roleType + "棋" +
			"<br>棋 x 位置:" + holdedChess.xPos + " <br> " + "棋 y 位置:" + holdedChess.yPos +
			"<br>提示环 x 位置:" + dropXpos + " <br> " + "提示环 y 位置:" + dropYpos +
			"</h4>";
		holdedChess = null; //重置防止重复引用
	} else if(!holdOne) {
		//回合 轮询
		if(holdedChess.roleType != (myRound ? "red" : "green")) {
			return;
		}
		originXpos = holdedChess.xPos;
		originYpos = holdedChess.yPos;
		holdOne = true;
		holdedChess.hold = true;
		originXposPx = holdedChess.style.left;
		originYposPx = holdedChess.style.top;
		logger(devMode, holdedChess.innerText + "被举起");
	}
}

function GetRoleTypeByPos(_xPos, _yPos) {
	return xyMap[_xPos - 1][_yPos - 1];
}

/*打印xyMap标志*/
function traverseXYmap() {
	label3Div.innerHTML = "";
	for(var j = 0; j < rows + 1; j++) {
		for(var i = 0; i < cols + 1; i++) {
			label3Div.innerHTML += (xyMap[i][j]) + "_";
		}
		label3Div.innerHTML += "<br>";
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
			for(i = 0; i <= cols && xPos - chessOffsetX - i * borderWide > 0; i++) {}
			for(j = 0; j <= rows && yPos - chessOffsetY - j * borderWide > 0; j++) {}
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
//用户显示判断xyMap的正确性
function SetText2Label2Div() {
	if(holdedChess.roleType == "green") {
		label2Div.innerHTML = "<h4>" + "绿棋起始位置是否被占据:" + xyMap[holdedChess.xPos - 1][holdedChess.yPos - 1] + "</h4>";
		label2Div.innerHTML += "<h4>" + "预计 绿棋起始位置是否被占据:" + xyMap[originXpos - 1][originYpos - 1] + "</h4>";
		//			logger(devMode, "红棋 目标 放置 位置是否被占据:" + xyMap[dropXpos - 1][dropYpos - 1]);
		if(dropXpos <= cols + 1 && dropYpos <= rows + 1) {
			//		logger(devMode, "绿棋起始位置是否被占据:" + xyMap[holdedChess.xPos - 1][holdedChess.yPos - 1]);
			label2Div.innerHTML += "<h4>" + "绿棋 目标 放置 位置是否被占据:" + xyMap[dropXpos - 1][dropYpos - 1] + "</h4>";
		}
	} else if(holdedChess.roleType == "red") {
		//logger(devMode, "红棋起始位置是否被占据:" + xyMap[holdedChess.xPos - 1][holdedChess.yPos - 1]);
		label2Div.innerHTML = "<h4>" + "红棋起始位置是否被占据:" + xyMap[holdedChess.xPos - 1][holdedChess.yPos - 1] +
			"</h4>";
		label2Div.innerHTML += "<h4>" + "预计 红棋起始位置是否被占据:" + xyMap[originXpos - 1][originYpos - 1] + "</h4>";
		if(dropXpos <= cols + 1 && dropYpos <= rows + 1) {
			//			logger(devMode, "红棋 目标 放置 位置是否被占据:" + xyMap[dropXpos - 1][dropYpos - 1]);
			label2Div.innerHTML += "<h4>" + "红棋 目标 放置 位置是否被占据:" + xyMap[dropXpos - 1][dropYpos - 1] + "</h4>";
		}
	}
}

function setText2Div(_text) {
	label2Div.innerHTML = "<h4>" + _text + "</h4>";
}

function CanBeNextPos() {
	if(holdedChess.roleType == "green") {
		//xyMap[holdedChess.xPos - 1][holdedChess.yPos - 1] 
		//xyMap[originXpos - 1][originYpos - 1] 
		if(xyMap[dropXpos - 1][dropYpos - 1] == FLAG_GREEN) {
			return false;
		}
		if(dropXpos <= cols + 1 && dropYpos <= rows + 1) {
			//xyMap[dropXpos - 1][dropYpos - 1]
			if(xyMap[dropXpos - 1][dropYpos - 1] == FLAG_RED) {
				xyMap[dropXpos - 1][dropYpos - 1] = FLAG_GREEN;
				//				alert("kill red chess!");
				//绿方 赢得一子
				//				setText2Div("kill red chess!" + "<br> can be next step!");
				KillChessByPos((holdedChess.roleType == "red" ? "green" : "red"), dropXpos - 1, dropYpos - 1);
			}
		}
		return true;
	} else if(holdedChess.roleType == "red") {
		//xyMap[originXpos - 1][originYpos - 1]
		if(xyMap[dropXpos - 1][dropYpos - 1] == FLAG_RED) {
			return false;
		}
		if(dropXpos <= cols + 1 && dropYpos <= rows + 1) {
			if(xyMap[dropXpos - 1][dropYpos - 1] == FLAG_GREEN) {
				xyMap[dropXpos - 1][dropYpos - 1] = FLAG_RED;
				//				alert("kill green chess!");
				//红方赢得一子
				//				setText2Div("kill green chess!" + "<br> can be next step!");
				KillChessByPos((holdedChess.roleType == "red" ? "green" : "red"), dropXpos - 1, dropYpos - 1);
			}
		}
		return true;
	}
}

function KillChessByPos(enemyRole, _xPos, _yPos) {
	label2Div.innerHTML="";
	var item;
	flagNewArr1Size = chessArr1.length;
	flagNewArr2Size = chessArr2.length;
	if(enemyRole == "red") {
		for(item in chessArr2) {
			label2Div.innerHTML+=""+chessArr2[item]+"<br>";
			if(item % 2 == 1 && chessArr2[item].xPos === _xPos && chessArr2[item].yPos === _yPos) {
				alert(chessArr2[item]);
				setText2Div(chessArr2[item]);
			}
		}
		//		logger("alert", item);
	} else {
		for(item in chessArr1) {
			label2Div.innerHTML+=chessArr2[item].roleType+"<br>";
			if(item % 2 == 1 && chessArr1[item].xPos === _xPos && chessArr1[item].yPos === _yPos) {
				setText2Div(chessArr1[item]);
			}
		}
		//		logger("alert", item);
	}
}

/*举棋时，holdedChess不为空，可以执行,下面的下棋逻辑判断*/
function ApplyRule() {
	//	SetText2Label2Div();
	logger("debug", holdedChess.roleId);
	switch(parseInt(holdedChess.roleId, 10)) {
		case 0:
			/*帝*/
			if(holdedChess.roleType == "green") {
				if(dropXpos >= 4 && dropXpos <= 6 &&
					dropYpos >= 1 && dropYpos <= 3) {
					if((dropXpos == originXpos - 1 || dropXpos == originXpos + 1) && dropYpos == originYpos) {
						return true;
					}
					if((dropYpos == originYpos - 1 || dropYpos == originYpos + 1) && dropXpos == originXpos) {
						return true;
					}
				}
			} else {
				if(dropXpos >= 4 && dropXpos <= 6 &&
					dropYpos >= 8 && dropYpos <= 10) {
					if((dropXpos == originXpos - 1 || dropXpos == originXpos + 1) && dropYpos == originYpos) {
						return true;
					}
					if((dropYpos == originYpos - 1 || dropYpos == originYpos + 1) && dropXpos == originXpos) {
						return true;
					}
				}
			}
			return false;
		case 1:
			/*士*/
			if(holdedChess.roleType == "green") {
				if(dropXpos >= 4 && dropXpos <= 6 && dropYpos >= 1 & dropYpos <= 3)
					if(
						(dropXpos == originXpos - 1 && dropYpos == originYpos - 1) ||
						(dropXpos == originXpos - 1 && dropYpos == originYpos + 1) ||
						(dropXpos == originXpos + 1 && dropYpos == originYpos - 1) ||
						(dropXpos == originXpos + 1 && dropYpos == originYpos + 1)
					) {
						return true;
					}
			} else if(holdedChess.roleType == "red") {
				if(dropXpos >= 4 && dropXpos <= 6 && dropYpos >= rows + 1 - 2 & dropYpos <= rows + 1)
					if(
						(dropXpos == originXpos - 1 && dropYpos == originYpos - 1) ||
						(dropXpos == originXpos - 1 && dropYpos == originYpos + 1) ||
						(dropXpos == originXpos + 1 && dropYpos == originYpos - 1) ||
						(dropXpos == originXpos + 1 && dropYpos == originYpos + 1)
					) {
						return true;
					}
			}
			return false;
		case 2:
			/*象*/
			//			for(var c = 1; c <= cols + 1; c++) {
			//				for(var r = 1; r <= (rows + 1) / 2 + 1; r++) {
			//					//逻辑完成
			//					if((c % 4 == 1 && (r - 2) % 4 == 1) || ((c - 2) % 4 == 1 && r % 4 == 1)) {
			//						if(
			//							(dropXpos == originXpos - 2 && dropYpos == originYpos - 2) ||
			//							(dropXpos == originXpos - 2 && dropYpos == originYpos + 2) ||
			//							(dropXpos == originXpos + 2 && dropYpos == originYpos - 2) ||
			//							(dropXpos == originXpos + 2 && dropYpos == originYpos + 2)
			//						) {
			//							return true;
			//						}
			//					}
			//				}
			//			}
			if(
				(dropXpos == originXpos - 2 && dropYpos == originYpos - 2) ||
				(dropXpos == originXpos - 2 && dropYpos == originYpos + 2) ||
				(dropXpos == originXpos + 2 && dropYpos == originYpos - 2) ||
				(dropXpos == originXpos + 2 && dropYpos == originYpos + 2)
			) {
				if(holdedChess.roleType == "green" && dropYpos < (rows + 1) / 2 + 1) {
					return true;
				} else if(holdedChess.roleType == "red" && dropYpos >= (rows + 1) / 2 + 1) {
					return true;
				} else {
					return false;
				}
			}
			return false;
		case 3:
			/*马*/
			/*双方一致*/
			if(
				(dropXpos == originXpos - 1 && dropYpos == originYpos - 2) ||
				(dropXpos == originXpos - 1 && dropYpos == originYpos + 2) ||
				(dropXpos == originXpos - 2 && dropYpos == originYpos - 1) ||
				(dropXpos == originXpos - 2 && dropYpos == originYpos + 1) ||

				(dropXpos == originXpos + 1 && dropYpos == originYpos - 2) ||
				(dropXpos == originXpos + 1 && dropYpos == originYpos + 2) ||
				(dropXpos == originXpos + 2 && dropYpos == originYpos - 1) ||
				(dropXpos == originXpos + 2 && dropYpos == originYpos + 1)) {
				return true;
			}
			return false;
		case 4:
			/*车*/
			/*双方一致*/
			if(dropXpos == originXpos || dropYpos == originYpos) {
				return true;
			}
			return false;
		case 5:
			/*炮*/
			/*双方一致*/
			if(dropXpos == originXpos || dropYpos == originYpos) {
				return true;
			}
			return false;
		case 6:
			/*卒*/
			/*双方卒方向相反*/
			if(holdedChess.roleType == "green") {
				if(dropYpos >= (rows + 1) / 2 + 1) {
					//左右移动
					if((dropXpos == originXpos - 1 || dropXpos == originXpos + 1) && dropYpos == originYpos) {
						return true;
					}
					//绿棋 向下移动
					if((dropYpos == originYpos + 1) && dropXpos == originXpos) {
						return true;
					}
				} else {
					//只能前进
					//绿棋 向下移动
					if((dropYpos == originYpos + 1) && dropXpos == originXpos) {
						return true;
					}
				}
			} else if(holdedChess.roleType == "red") {
				if(dropYpos < (rows + 1) / 2 + 1) {
					//左右移动
					if((dropXpos == originXpos - 1 || dropXpos == originXpos + 1) && dropYpos == originYpos) {
						return true;
					}
					//红棋 向上移动
					if((dropYpos == originYpos - 1) && dropXpos == originXpos) {
						return true;
					}
				} else {
					//只能前进
					//红棋 向上移动
					if((dropYpos == originYpos - 1) && dropXpos == originXpos) {
						return true;
					}
				}
			}
			return false;
	}
	return false;
}

function JudageCoverable(mychess) {
	return true;
}

function Drop2PlaceWithJudge(chess, _dropXpos, _dropYpos) {
	//判断角色行走路径是否正确
	logger(devMode, "角色:" + chess.roleType + roles[chess.roleId]);
}