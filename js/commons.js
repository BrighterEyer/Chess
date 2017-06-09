function logger(mode,objMsg){
	if(mode=="debug"){
		console.log((typeof objMsg)+" : "+objMsg);
	}else if(mode=="alert"){
		alert(objMsg);
	}
}
