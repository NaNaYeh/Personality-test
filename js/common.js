

//側欄選單
$(function(){

	var bMenuStatus = 0; //開關狀態
	
	//fn選單開
	function fnMenuOpen(){
		bMenuStatus = 1;
		$("html").css({"overflow-y":"hidden"});/*維持一個捲軸，目前捲軸在.side*/
		$("body").css({"overscroll-behavior":"contain"});/*阻止Android滾動刷新*/
		$(".side").addClass("active");
	}
	
	//fn選單關
	function fnMenuClose(){
		bMenuStatus = 0;
		$("html").css({"overflow-y":"visible"});
		$(".side").removeClass("active");	
	}
	
	//按鈕 選單開
	$(".btn_open").on("click", fnMenuOpen);

	//按鈕 選單關
	$(".side .btn_close, .side .menu a").on("click", function(){
		if( bMenuStatus === 1){fnMenuClose();}
	});

});


//題目換頁
$(function(){

	let ansList = [];
	let asnTotal = 0;
	let resultInfo = {};

	//初始
	$(".step_qna_0").addClass("current");//加上class後 show題目


	//QA打字效果+ 出現題目 動畫=====================
	function fnQa(){

		if($(".step.current").length === 0 ) return false;

		let iQa = $(".qa_box .step.current .qa_title");
		let iQaList = $(".qa_box .step.current .ans-list li");
		let iQastrings = iQa.text();
		iQa.find('em').typed({
			strings: [iQastrings],
			typeSpeed: 3,
			cursorChar: "",
			contentType: 'html', // or 'text'
			backSpeed: 500,
			callback: function() {
				const myTL1 = new TimelineMax();
				myTL1.staggerTo(iQaList, .5,{ opacity:1, y: -15}, .2);
			}
		});
	}

	fnQa();

	//選題目
	function fnShowStep() {

		let idx = $(this).parent().parent().attr("class").split("step_qna_")[1].split("current")[0] | 0;//轉成數字
		ansList[idx] = $(this).data("ans");
		
		if(idx === 4){
			window.setTimeout(function(){
				$(".result_name").focus();
			}, 1000);
		}
		
		$(this).addClass('active').delay(300).queue(function () {
			$(this).parents('.step').removeClass('current');
			$(this).parents('.step').next().addClass('current');
			fnQa();
		});
		
	}
	

	//資料計算分數
	function fnTotal() {
		asnTotal = ansList.reduce((pre, item) => {
			return pre + item
		}, 0);

		switch (true) {
			case asnTotal === 100:
				resultInfo = `result_page_1.htm`;
				break;
			case asnTotal >= 90:
				resultInfo = `result_page_2.htm`
				break;
			case asnTotal >= 70:
				resultInfo = `result_page_3.htm`
				break;
			case asnTotal >= 50:
				resultInfo = `result_page_4.htm`
				break;
			case asnTotal >= 30:
				resultInfo = `result_page_5.htm`
				break;
			case asnTotal === 25:
				resultInfo = `result_page_6.htm`
				break;
			default:
				alert("default都不是");
		}
	}

	//每按一次題目
	$(".step ul li").one("click", fnShowStep);


	//輸入使用者名稱===========================================

	$(".btn_user_title").on("click", function () {	
		fnTotal();
		location.href = `${resultInfo}?title=${$(".result_name").val()}`;		
	});
	
	//Enter送出後
	$(".result_name").keypress(function(event) {
		
		if(event.keyCode === 13){
			event.preventDefault();
			fnTotal();
			location.href = `${resultInfo}?title=${$(".result_name").val()}`;
		}
	});

});


//帶入結果頁 名字
$(function(){
	let urlTitle = window.location.href.split("?title=")[1];//輸入的名稱
	let decodedTitle = decodeURIComponent(urlTitle);//亂碼轉中文
	$(".result .main .step_result strong").append(decodedTitle);
});


//輪播+打開light_box
$(function () {

	let sTxt = "";

	//gallery_1 輪播
	$('.gallery_1 .run .inner').bxSlider({
		auto: false,
		pager: false,
	});

	function fnShow() {
		$(".light_box .inner .video").html(sTxt);
		$(".light_box").fadeIn(300);
	}

	//塞入iframe結構
	$("a[data-lb]").on("click", function (e) {
		e.preventDefault();
		var sUrl = $(this).data("lb");

		if (true) {
			sTxt = `<iframe src="${sUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
		}

		fnShow();

	});

	//關掉影片
	$(".light_box .btn_close, .light_box .overlap").on("click", function () {
		$(".light_box .inner .video").html("");
		$(".light_box").fadeOut(300);
	});

});
