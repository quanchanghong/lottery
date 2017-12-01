
var mainTimer = 0;
var lastTimer = 0;
var currentAwardTotal = 0;//当前设置下的中奖总人数
//var persons = new Array(50);//员工
//var company = new Array(30);//公司
//var construction = new Array(40);//工地
//var director = new Array(20);//主管
var lotteryArray = new Array();//已经中奖人员
var commonArray = new Array();
var isStart = false;
var sync = false;

function initItems(itemsSum, itemInfo){
	var i = 0;
	
	if (itemInfo.length <= 0){
		return;
	}
	
	var tempArry = itemInfo.slice(0);
	
	tempArry.sort(function(){
		return (0.5-Math.random());
	});
	
	for (i = 0; i < itemsSum; i++) {
		
		$("#items").append("<div class='item' id='item"+i+"'>"+tempArry[i].code+"</div>");
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
			rand = Math.floor(Math.random() * ITEM_COUNTS);
			if ((rand != preRandNum) || (rand == 0)){
				preRandNum = rand;
				break;
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
		
		for (var i = 0; i < ITEM_COUNTS; i++){
			if (i != rand){
				//var randIndex = Math.floor(Math.random() * commonArray.length);
				$("#nameForCode").html(commonArray[i].name);
				$("#item"+i+"").html(commonArray[i].code);
				
				if (commonArray.length != ITEM_COUNTS){
					for (var j = 0; j < (ITEM_COUNTS - commonArray.length + 1); j++){
						$("#item"+(ITEM_COUNTS-j)+"").html(commonArray[Math.floor(Math.random()*commonArray.length)].code);
					}
				}
			}
		}
		
	}, 150);
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
	var localKey = "lotteryArray"+CURRENT_GROUP_INDEX;
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
	localStorage.setItem("lotteryArray"+CURRENT_GROUP_INDEX, JSON.stringify(temp));
	
}

function checkCurrentAwardTotal(total){
	var group = localStorage.getItem("group");
	var order = localStorage.getItem("order");
	var awards = localStorage.getItem("awards");
	var localTotalKey = "awardTotal" + order + group + awards;
	var localTotal = localStorage.getItem(localTotalKey);
	if (!$.isEmptyObject(localTotal)){
		if (currentAwardTotal >= Number(localTotal)){
			alert("本次抽奖人数已满！");
		}
	}
}

//防止按着一直不放，keydown改为keyup
$("body").keyup(function(e){
	if (e.keyCode == 32){
		
		if (isStart){
			clearInterval(mainTimer);
			sync = true;
			isStart = !isStart;
			currentAwardTotal = currentAwardTotal + 1;
			lastTimer = setTimeout(function(){
				var awardsInfo = $(".item.active").html().toString();
				
				for (var i = 0; i < commonArray.length; i++) {
					if (commonArray[i].code == awardsInfo){
						//alert(commonArray[i].code);
						$("#nameForCode").html(commonArray[i].name);
					}
				}
				
				removeAndSave2Local(commonArray, lotteryArray, awardsInfo);
				$("#result").prepend("<li>"+awardsInfo  + "&nbsp" + ARRAY_AWARDS[CURRENT_AWARD_INDEX]+"</li>");
				
				clearTimeout(lastTimer);
			    checkCurrentAwardTotal(currentAwardTotal);
			    
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


function testDate(){
	//测试代码
	for (var i = 10; i < persons.length+10; i++){
		persons[i-10] = "员工" + i;
	}
	for (var i = 10 ; i < company.length+10; i++) {
		company[i-10] = "公司" + i;
	}
	for (var i = 10 ; i < director.length+10; i++) {
		director[i-10] = "主管" + i;
	}
	for (var i = 10 ; i < construction.length+10; i++) {
		construction[i-10] = "工地" + i;
	}
	//测试结束
}


function initData(commonArray){
	var groupType = localStorage.getItem("group");
	var awardsIndex = localStorage.getItem("awards");
	
	if (!$.isEmptyObject(awardsIndex)){
		CURRENT_AWARD_INDEX = Number(awardsIndex);
	}
	
	if (!$.isEmptyObject(groupType)){
		CURRENT_GROUP_INDEX = Number(groupType);
	}
	
	if (CURRENT_GROUP_INDEX == GROUP_COMPANY && CURRENT_AWARD_INDEX == AWARDS_FIRST){
		commonArray = companyAward1.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_COMPANY && CURRENT_AWARD_INDEX == AWARDS_SECOND){
		commonArray = companyAward2.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_COMPANY && CURRENT_AWARD_INDEX == AWARDS_THREE){
		commonArray = companyAward3.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_COMPANY && CURRENT_AWARD_INDEX == AWARDS_SPECIAL){
		commonArray = companyAwardSpecial.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_CONSTRUCTION && CURRENT_AWARD_INDEX == AWARDS_FIRST){
		commonArray = constructionAward1.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_CONSTRUCTION && CURRENT_AWARD_INDEX == AWARDS_SECOND){
		commonArray = constructionAward2.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_CONSTRUCTION && CURRENT_AWARD_INDEX == AWARDS_THREE){
		commonArray = constructionAward3.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_CONSTRUCTION && CURRENT_AWARD_INDEX == AWARDS_SPECIAL){
		commonArray = constructionAwardSpecial.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_PERSONS && CURRENT_AWARD_INDEX == AWARDS_FIRST){
		commonArray = personsAward1.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_PERSONS && CURRENT_AWARD_INDEX == AWARDS_SECOND){
		commonArray = personsAward2.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_PERSONS && CURRENT_AWARD_INDEX == AWARDS_THREE){
		commonArray = personsAward3.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_DIRECTOR && CURRENT_AWARD_INDEX == AWARDS_FIRST){
		commonArray = directorAward1.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_DIRECTOR && CURRENT_AWARD_INDEX == AWARDS_SECOND){
		commonArray = directorAward2.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_DIRECTOR && CURRENT_AWARD_INDEX == AWARDS_THREE){
		commonArray = directorAward3.slice(0);
	}
	else if (CURRENT_GROUP_INDEX == GROUP_DIRECTOR && CURRENT_AWARD_INDEX == AWARDS_ESPECIAL){
		commonArray = directorAwardSpecial.slice(0);
	}
	else {
		//commonData = personsAward3.slice(0);//如果什么都没有设置
	}
}

function getHasLotteryPersons(){
	var currentKey = "lotteryArray" + CURRENT_GROUP_INDEX;
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

$(document).ready(function(){
	//testDate();
	
	initData(commonArray);
	
	getHasLotteryPersons();
	
	ITEM_COUNTS = commonArray.length;
	currentAwardTotal = 0;
	initItems(10, commonArray);
	//localStorage.clear();
});
