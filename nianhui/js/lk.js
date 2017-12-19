
var mainTimer = 0;
var lastTimer = 0;
var currentAwardTotal = 0;//当前设置下的中奖总人数
var lotteryArray = new Array();//已经中奖人员
var commonArray = new Array();
var isStart = false;
var sync = false;

function initItems(itemsSum, itemInfo){
	
	if (itemInfo.length <= 0){
		return;
	}
	
	var tempArry = itemInfo.slice(0);
	
	tempArry.sort(function(){
		return (0.5-Math.random());
	});
	
	if (tempArry.length < 143){//以150个格子为界，小于全部显示，大于随机显示
		
		var contentHeight = Math.ceil(Number((tempArry.length / 16) * 60 + 100));
		$("#content").css({"height":contentHeight});
		
		for (var i = 0; i < itemsSum; i++) {
			
		$("#items").append("<div class='item' id='item"+i+"'>"+tempArry[i].code+"</div>");
		
		}
	}else{
		/*
		 * 初始化数据不能重复算法
		 */
		for (j = 0; j < 143; j++){
			var randIndex = Math.floor(Math.random() * tempArry.length);
			var isExist = 0;
			$(".item").each(function(){
				if ($(this).html() == tempArry[randIndex]){
					//isExist = 1;
					randIndex = Math.floor(Math.random() * tempArry.length);
					return;
				}
			});
			
			if (isExist == 1){
				j = j - 1;
				continue;
			}
			
			$("#items").append("<div class='item' id='item"+j+"'>"+tempArry[randIndex].code+"</div>");
		}
	}
}

function showPerData(arrayinfo){
	for (j = 0; j < 143; j++){
		var randIndex = Math.floor(Math.random() * arrayinfo.length);
		var isExist = 0;
		$(".item").each(function(){
			if ($(this).html() == arrayinfo[randIndex]){
				//isExist = 1;
				randIndex = Math.floor(Math.random() * arrayinfo.length);
				return;
			}
		});
			
		if (isExist == 1){
			j = j - 1;
			continue;
		}
			
		$("#items").append("<div class='item' id='item"+j+"'>"+arrayinfo[randIndex].code+"</div>");
	}
}

function start(){
	//isStart = true;
	mainTimer = setInterval(function(){
		if (sync){
			return;
		}
		var preRandNum = 0;
		var rand = 0;
		while(true){
			
			if (commonArray.length < 143){
				rand = Math.floor(Math.random() * commonArray.length);
				if ((rand != preRandNum) || (rand == 0)){
					preRandNum = rand;
					break;
				}
			}else{
				rand = Math.floor(Math.random() * 143);
				if ((rand != preRandNum) || (rand == 0)){
					preRandNum = rand;
					break;
				}
			}
		}
		
		if (!sync){
			$("div.item.active").removeClass("active");
			$("div.item").eq(rand).addClass("active");
		}
		//对数组进行随机排序
		commonArray.sort(function(){
			return (0.5-Math.random());
		});
		
		if (commonArray.length < 143){
			for (var i = 0; i < commonArray.length; i++){
			//if (i != rand){
				//var randIndex = Math.floor(Math.random() * commonArray.length);
				$("#nameForCode").html(commonArray[i].name);
				$("#item"+i+"").html(commonArray[i].code);
				
				if (commonArray.length != ITEM_COUNTS){
					$("div").remove(".item");
					ITEM_COUNTS = commonArray.length;
					initItems(commonArray.length, commonArray);
				}
			//}
			}
		}else{//当大于143时，开始随机显示
			for (j = 0; j < 143; j++){
				var randIndex = Math.floor(Math.random() * commonArray.length);
				var isExist = 0;
				$(".item").each(function(){
					if ($(this).html() == commonArray[randIndex]){
					isExist = 1;
					randIndex = Math.floor(Math.random() * commonArray.length);
					return;
				}
			});
			
			if (isExist == 1){
				j = j - 1;
				continue;
			}
			
			$("#nameForCode").html(commonArray[randIndex].name);
			$("#item"+j+"").html(commonArray[randIndex].code);
		}
	}
	}, 130);
}

//取消按钮
$("#cancel").click(function(){
	$("#modalSetting").modal('hide');
});

//保存按钮
$("#save").click(function(){
	if (typeof(Storage) !== "undefined"){
		//轮
		var order = $("#order option:selected").val();
		localStorage.setItem("order", order);
		//组别
		var group = $("#group option:selected").val();
		if (order == ORDER_THREE){
			group = GROUP_ALL;//第三轮全部参与为员工组
		}
		localStorage.setItem("group", group);
		//奖项
		var awards = $("#awards option:selected").val();
		localStorage.setItem("awards", awards);
		//中奖总人数
		var awardTotal = $("#awardTotal").val();
		//每次开奖人数
		//var awardPersons = $("#awardPersons").val();
		//中奖人数存储格式为：awardTotal+轮+组别+奖项；
		var awardTotalKey = "awardTotal" + order.toString() + group.toString() + awards.toString();
		if (awardTotal > 0){
			localStorage.setItem(awardTotalKey, awardTotal);
			setCurrentAwardTotal2Local(0);//清除当前中奖人数
			//localStorage.setItem("awardPersons", awardPersons);
			$("#modalSetting").modal('hide');
		}else{
			alert("请输入中奖总人数!");
		}
		
		window.location.reload();
		
	}else{
		alert("你的浏览器不支持H5！请更新最新版本的浏览器！");
	}
});

function removeAndSave2Local(remove, save, str){
	var temp = new Array();
	var localKey = "lotteryArray" + CURRENT_ORDER_INDEX.toString() + CURRENT_GROUP_INDEX.toString();
	var localStr = localStorage.getItem(localKey.toString());
	
	if (!$.isEmptyObject(localStr)){
		temp = JSON.parse(localStr);
	}
	
	//var index = $.inArray(str, remove);
	var index = -1;
	for (var i = 0; i < remove.length; i++) {
		if (remove[i].code == str){
			index = i;
			break;
		}
	}
	//alert(remove.splice(index, 1).code.toString());
	var objArray = remove.splice(index, 1);
	//alert(obj[0].code);
	//存中奖人工号和奖项
	//var lottery = remove.splice(index, 1)[0].code.toString() + "&nbsp" + ARRAY_AWARDS[CURRENT_AWARD_INDEX].toString();
	var lottery = objArray[0].code.toString() + "&nbsp" + ARRAY_AWARDS[CURRENT_AWARD_INDEX].toString();
	temp.push(lottery);
	localStorage.setItem("lotteryArray"+CURRENT_ORDER_INDEX.toString()+CURRENT_GROUP_INDEX.toString(), JSON.stringify(temp));
	
}

function getCurrentAwardTotal4Local(){
	var group = localStorage.getItem("group");
	var order = localStorage.getItem("order");
	var awards = localStorage.getItem("awards");
	var localTotalKey = "currentAwardTotal" + order + group + awards;
	var current = localStorage.getItem(localTotalKey);
	if (!$.isEmptyObject(current)){
		return Number(current);
	}else{
		return 0;
	}
}

function setCurrentAwardTotal2Local(currentTotal){
	var group = localStorage.getItem("group");
	var order = localStorage.getItem("order");
	var awards = localStorage.getItem("awards");
	
	if (currentTotal >=0){
		var localTotalKey = "currentAwardTotal" + order + group + awards;
		localStorage.setItem(localTotalKey, currentTotal.toString());
	}
	
}

function checkCurrentAwardTotal(total){
	var group = localStorage.getItem("group");
	var order = localStorage.getItem("order");
	var awards = localStorage.getItem("awards");
	var localTotalKey = "awardTotal" + order + group + awards;
	var localTotal = localStorage.getItem(localTotalKey);
	if (!$.isEmptyObject(localTotal)){
		if (total >= Number(localTotal)){
			return true;
		}
	}
	
	return false;
}

function deleteLotteryInfo4Server(code, name, department, awardInfo, order){
	if ((code.length == 0) || (name.length == 0) || (department.length == 0) || (awardInfo.length == 0) || (order == 0)){
		return;
	}
	
	$.post(
		"http://localhost:8081/SimpleCodeForLK/DeleteLotteryInfo",
		{"code":code,"name":name,"department":department,"awardInfo":awardInfo,"order":order},
		function(data){
		
		},
		"json"
	);
}

function sendLotteryInfo2Server(code, name, department, awardInfo, order){
	if ((code.length == 0) || (name.length == 0) || (department.length == 0) || (awardInfo.length == 0) || (order == 0)){
		return;
	}
	
	$.post(
		"http://localhost:8081/SimpleCodeForLK/SaveLotteryInfo",
		{"code":code,"name":name,"department":department,"awardInfo":awardInfo,"order":order},
		function(data){
		
		},
		"json"
	);
}

function deletePersonByOneCode(){
	if(mainTimer > 0) { //开始运行后停止摁下F9键
	var lotteryCode = $(".item.active").html().toString();
	var confirmMsg = "你确定要把该" + lotteryCode + "中奖人移出中奖名单吗？"
	var yes = confirm(confirmMsg);
	if(yes) {
		var currentKey = "lotteryArray" + CURRENT_ORDER_INDEX.toString() + CURRENT_GROUP_INDEX.toString();
		var localStr = localStorage.getItem(currentKey.toString())
		if(!$.isEmptyObject(localStr)) {
			tempArray = JSON.parse(localStr);
			//取出已中奖人工号，取前四位为工号，格式为：工号+&nbsp+奖项
			for(var i = 0; i < tempArray.length; i++) {
				var str = tempArray[i].toString().substring(0, 4);
				if(str == lotteryCode) {
					tempArray.splice(i, 1); //删除要移出的工号
					localStorage.setItem(currentKey, JSON.stringify(tempArray));
					//deleteLotteryInfo4Server(lotteryCode, CURRENT_ORDER_INDEX);
					window.location.reload();
					break;
				}
			}
		}
	}
}
}

//防止按着一直不放，keydown改为keyup
$("body").keyup(function(e){
	//F9键删除中奖人
	if (e.keyCode == 120){
		if (!isStart){
			deletePersonByOneCode();
			return false;
		}
	}
	
	if (e.keyCode == 68){//d键清空本地配置信息
		if (!isStart){
			if (confirm("初始化！确定要清空本地保存的信息吗?")){
				localStorage.clear()//清空
				window.location.reload();
				return false;
			}
		}
	}
	
	if (e.keyCode == 32){
		
		if (checkCurrentAwardTotal(currentAwardTotal)){
			alert("中奖人数已满，请重新设置抽奖信息！");
			return false;
		}
		
		if (isStart){
			clearInterval(mainTimer);
			sync = true;
			isStart = !isStart;
			currentAwardTotal = currentAwardTotal + 1;
			
			setCurrentAwardTotal2Local(currentAwardTotal);
			
			lastTimer = setTimeout(function(){
				var awardsInfo = $(".item.active").html().toString();
				
				for (var i = 0; i < commonArray.length; i++) {
					if (commonArray[i].code == awardsInfo){
						//alert(commonArray[i].code);
						$("#nameForCode").html(commonArray[i].name);
						sendLotteryInfo2Server(commonArray[i].code, commonArray[i].name, commonArray[i].department, ARRAY_AWARDS[CURRENT_AWARD_INDEX], CURRENT_ORDER_INDEX);
						break;
					}
				}
				
				removeAndSave2Local(commonArray, lotteryArray, awardsInfo);
				$("#result").prepend("<li>"+awardsInfo  + "&nbsp" + ARRAY_AWARDS[CURRENT_AWARD_INDEX]+"</li>");
				
				clearTimeout(lastTimer);
				//alert(currentAwardTotal);
			    
			},100);
				
		}else{
			isStart = true;
			sync = false;
			start();
		}
		e.preventDefault();
	}
	//e.preventDefault();
});


function initData(){
	
	var startType = 1;//0common  1special
	var groupType = localStorage.getItem("group");
	var awardsIndex = localStorage.getItem("awards");
	var order = localStorage.getItem("order");
	
	if (!$.isEmptyObject(awardsIndex)){
		CURRENT_AWARD_INDEX = Number(awardsIndex);
	}
	
	if (!$.isEmptyObject(groupType)){
		CURRENT_GROUP_INDEX = Number(groupType);
	}
	
	if (!$.isEmptyObject(order)){
		CURRENT_ORDER_INDEX = Number(order);
	}
	
	if (CURRENT_ORDER_INDEX == ORDER_THREE){//如果为第三轮抽奖，设置组别无效，组别为全员组，将会所有人参与抽奖，
		CURRENT_GROUP_INDEX = GROUP_ALL;
		localStorage.setItem("group", GROUP_ALL);
	}
	
	switch (startType){
		case 0:
			initDataForCommon(CURRENT_ORDER_INDEX, CURRENT_GROUP_INDEX, CURRENT_AWARD_INDEX);
			break;
		case 1:
			initDataForCondition(CURRENT_ORDER_INDEX, CURRENT_GROUP_INDEX,CURRENT_AWARD_INDEX);
			break;
		default:
			//initDataForCommon(CURRENT_ORDER_INDEX, CURRENT_GROUP_INDEX, CURRENT_AWARD_INDEX);//出现异常默认正常抽奖模式
			break;
	}
}

function initDataForCommon(orderType, lotteryGroup, lotteryIndex){
	
	if (orderType == ORDER_THREE){
		commonArray = all.slice(0);
		return;
	}
	else{
		switch (lotteryGroup){
		case 1:
			commonArray = company.slice(0);
			break;
		case 2:
			commonArray = construction.slice(0);
			break;
		case 3:
			commonArray = director.slice(0);
			break;
		case 4:
			commonArray = persons.slice(0);
			break;
		default:
			commonArray = persons.slice(0);//默认开始抽员工组别
			break;
		}
	}
}

function initDataForCondition(orderType, lotteryGroup, lotteryIndex){
	/*
	var groupType = localStorage.getItem("group");
	var awardsIndex = localStorage.getItem("awards");
	
	if (!$.isEmptyObject(awardsIndex)){
		CURRENT_AWARD_INDEX = Number(awardsIndex);
	}
	
	if (!$.isEmptyObject(groupType)){
		lotteryGroup = Number(groupType);
	}*/
	
	if (orderType == ORDER_THREE){
		commonArray = all.slice(0);
		return;
	}
	else{
		if (lotteryGroup == GROUP_COMPANY && lotteryIndex == AWARDS_FIRST){
			commonArray = companyAward1.slice(0);
		}
		else if (lotteryGroup == GROUP_COMPANY && lotteryIndex == AWARDS_SECOND){
			commonArray = companyAward2.slice(0);
		}
		else if (lotteryGroup == GROUP_COMPANY && lotteryIndex == AWARDS_THREE){
			commonArray = companyAward3.slice(0);
		}
		else if (lotteryGroup == GROUP_COMPANY && lotteryIndex == AWARDS_SPECIAL){
			commonArray = companyAwardSpecial.slice(0);
		}
		else if (lotteryGroup == GROUP_CONSTRUCTION && lotteryIndex == AWARDS_FIRST){
			commonArray = constructionAward1.slice(0);
		}
		else if (lotteryGroup == GROUP_CONSTRUCTION && lotteryIndex == AWARDS_SECOND){
			commonArray = constructionAward2.slice(0);
		}
		else if (lotteryGroup == GROUP_CONSTRUCTION && lotteryIndex == AWARDS_THREE){
			commonArray = constructionAward3.slice(0);
		}
		else if (lotteryGroup == GROUP_CONSTRUCTION && lotteryIndex == AWARDS_SPECIAL){
			commonArray = constructionAwardSpecial.slice(0);
		}
		else if (lotteryGroup == GROUP_PERSONS && lotteryIndex == AWARDS_FIRST){
			commonArray = personsAward1.slice(0);
		}
		else if (lotteryGroup == GROUP_PERSONS && lotteryIndex == AWARDS_SECOND){
			commonArray = personsAward2.slice(0);
		}
		else if (lotteryGroup == GROUP_PERSONS && lotteryIndex == AWARDS_THREE){
			commonArray = personsAward3.slice(0);
		}
		else if (lotteryGroup == GROUP_DIRECTOR && lotteryIndex == AWARDS_FIRST){
			commonArray = directorAward1.slice(0);
		}
		else if (lotteryGroup == GROUP_DIRECTOR && lotteryIndex == AWARDS_SECOND){
			commonArray = directorAward2.slice(0);
		}
		else if (lotteryGroup == GROUP_DIRECTOR && lotteryIndex == AWARDS_THREE){
			commonArray = directorAward3.slice(0);
		}
		else if (lotteryGroup == GROUP_DIRECTOR && lotteryIndex == AWARDS_ESPECIAL){
			commonArray = directorAwardSpecial.slice(0);
		}
		else {
		//commonData = personsAward3.slice(0);//如果什么都没有设置
		}
	}
}

/**
 * 获得当前设置下对应的中奖人数
 */
function getCurrentOrderGroupAwardTotal(){
	var order = $("#order").val();
	var group = $("#group").val();
	var award = $("#awards").val();
	var total = 0;
	var totalArray = new Array();
	var currentKey = "lotteryArray" + order.toString() + group.toString();
	
	var localStr = localStorage.getItem(currentKey.toString());
	if (localStr != null){
		totalArray = JSON.parse(localStr);
		 for (var i = 0; i < totalArray.length; i++){
		 	var awardStr = totalArray[i].toString().substring(9);//获取最后的中奖信息,其中&nbsp也是算占字符的！
		 	if (awardStr == ARRAY_AWARDS[parseInt(award)]){
		 		total = total + 1;
		 	}
		 }
	}
	
	$("#awardPersons").val(total);
	
}

function getHasLotteryPersons(){
	var currentKey = "lotteryArray" + CURRENT_ORDER_INDEX.toString() + CURRENT_GROUP_INDEX.toString();
	var localStr = localStorage.getItem(currentKey.toString())
	var tempArray = new Array();
	if (!$.isEmptyObject(localStr)){
		tempArray = JSON.parse(localStr);
		//取出已中奖人工号，取前四位为工号，格式为：工号+&nbsp+奖项
		for (var i = 0; i < tempArray.length; i++) {
			var str = tempArray[i].toString().substring(0, 4);
			//var index = $.inArray(str, commonArray);
			var index = -1;
			for (var j = 0; j < commonArray.length; j++) {
				if (commonArray[j].code == str)
				{
					index = j;
					break;
				}
			}
			lotteryArray[i] = str;
			if (index != -1){
				commonArray.splice(index, 1);
			}
			$("#result").prepend("<li>"+tempArray[i] +"</li>");
		}
		/*
		for (var i = 0; i < tempArray.length; i++){
			$("#result").prepend("<li>"+tempArray[i] +"</li>");
		}*/
	}
}

function initGroupInfo(){
	var order = $("#order").val();

	$("#group option").remove();

	if (order == ORDER_FIRST) {
		$("#group").append("<option value='1'>公司组</option>");
		$("#group").append("<option value='2'>工地组</option>");

		//解决当不是通过鼠标点击改变时，不出发change事件问题
		var group = $("#group").val();
		if(group == GROUP_COMPANY) {
			$("#awards option").remove();
			$("#awards").append("<option value='3'>三等奖</option>");
			$("#awards").append("<option value='2'>二等奖</option>");
			$("#awards").append("<option value='1'>一等奖</option>");
			$("#awards").append("<option value='0'>特等奖</option>");
		} //end
	} 
	else if (order == ORDER_SECOND) {
		$("#group").append("<option value='3'>主管组</option>");
		$("#group").append("<option value='4'>员工组</option>");

		//解决当不是通过鼠标点击改变时，不出发change事件问题
		var group = $("#group").val();
		if (group == GROUP_DIRECTOR) {
			$("#awards option").remove();
			$("#awards").append("<option value='3'>三等奖</option>");
			$("#awards").append("<option value='2'>二等奖</option>");
			$("#awards").append("<option value='1'>一等奖</option>");
			$("#awards").append("<option value='6'>特别奖</option>");
		} //end

	}
	else if (order == ORDER_THREE) {
		$("#group").append("<option value='5'>全员组(预留)</option>");

		//解决当不是通过鼠标点击改变时，不出发change事件问题
		var group = $("#group").val();
		if(group == GROUP_ALL) {
			$("#awards option").remove();
			$("#awards").append("<option value='3'>三等奖</option>");
			$("#awards").append("<option value='2'>二等奖</option>");
			$("#awards").append("<option value='1'>一等奖</option>");
		} //end

	} 
	else {

	}
}

function initAwardInfo(){
	var group = $("#group").val();
		
	$("#awards option").remove();
		
	$("#awards").append("<option value='3'>三等奖</option>");
	$("#awards").append("<option value='2'>二等奖</option>");
	$("#awards").append("<option value='1'>一等奖</option>");
		
	if ((group == GROUP_COMPANY) || (group == GROUP_CONSTRUCTION)){
			
		$("#awards").append("<option value='0'>特等奖</option>");
	}
	else if (group == GROUP_DIRECTOR){
			
		$("#awards").append("<option value='6'>特别奖</option>");
	}
	else {
		
	}
}

function initSelectSettingInfo(){
	$("#order").on("change",function(){
		initGroupInfo();
		getCurrentOrderGroupAwardTotal();
	});
	
	$("#group").on("change", function(){
		initAwardInfo();
		getCurrentOrderGroupAwardTotal();
	});
	
	$("#awards").on("change", function(){
		getCurrentOrderGroupAwardTotal();
	});
	
	$("#btnSetting").on("click", function(){
		var order = localStorage.getItem("order");
		var group = localStorage.getItem("group");
		var award = localStorage.getItem("awards");
		
		if ((order != null) && (group != null) && (award != null)){
			
			$("#order").val(parseInt(order));
			
			initGroupInfo();
			initAwardInfo();
			
			$("#group").val(parseInt(group));
			$("#awards").val(parseInt(award));
			//alert("" + parseInt(order) + parseInt(group) + parseInt(award));
		}
		
		getCurrentOrderGroupAwardTotal();
	});
}

$(document).ready(function(){
	
	initData();
	
	getHasLotteryPersons();
	
	ITEM_COUNTS = commonArray.length;
	initItems(commonArray.length, commonArray);
	
	currentAwardTotal = getCurrentAwardTotal4Local();
	
	initSelectSettingInfo();
	
	//localStorage.clear();
});
