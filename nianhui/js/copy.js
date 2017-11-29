
var mainTimer = 0;
var lastTimer = 0;
var persons = new Array(500);//员工
var company = new Array(300);//公司
var construction = new Array(200);//工地
var director = new Array(100);//主管

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
		
		$("#items").append("<div class='item' id='item"+i+"'>"+tempArry[i]+"</div>");
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
		for (var i = 0; i < ITEM_COUNTS; i++){
			if (i != rand){
				$("#item"+i+"").html(commonArray[Math.floor(Math.random() * commonArray.length)]);
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
		
		if (awardTotal > 0){
			localStorage.setItem("awardTotal", awardTotal);
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



$("body").keydown(function(e){
	if (e.keyCode == 32){
		
		if (isStart){
			clearInterval(mainTimer);
			sync = true;
			isStart = !isStart;
			
			lastTimer = setTimeout(function(){
				var awardsInfo = $(".item.active").html().toString();
				//var index1 = $.inArray(awardsInfo, commonArray);
				
				$("#result").prepend("<li>"+awardsInfo  + "&nbsp" + ARRAY_AWARDS[CURRENT_AWARD_INDEX]+"</li>");
				clearTimeout(lastTimer);
			    alert(awardsInfo);
			    
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
	for (var i = 0; i < persons.length; i++){
		persons[i] = "员工" + i;
	}
	for (var i = 0 ; i < company.length; i++) {
		company[i] = "公司" + i;
	}
	for (var i = 0 ; i < director.length; i++) {
		director[i] = "主管" + i;
	}
	for (var i = 0 ; i < construction.length; i++) {
		construction[i] = "工地" + i;
	}
	//测试结束
}


$(document).ready(function(){
	
	testDate();
	var groupType = localStorage.getItem("group");
	var awardsIndex = localStorage.getItem("awards");
	
	if (awardsIndex.length > 0){
		CURRENT_AWARD_INDEX = Number(awardsIndex);
	}
	
	if (groupType.length > 0){
		CURRENT_GROUP_INDEX = Number(groupType);
	}
	
	switch (CURRENT_GROUP_INDEX){
		case GROUP_COMPANY:
			commonArray = company.slice(0);
		break;
		case GROUP_DIRECTOR:
			commonArray = director.slice(0);
			ITEM_COUNTS = commonArray.length - 2;
		break;
		case GROUP_CONSTRUCTION:
			commonArray = construction.slice(0);
		break;
		case GROUP_PERSONS:
			commonArray = persons.slice(0);
		break;
		default:
			commonArray = persons.slice(0);
		break;
	}
	
	
	
	
	initItems(ITEM_COUNTS, commonArray);
	
});
