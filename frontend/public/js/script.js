$(document).ready(function(){

	$('.info__icon').on("mouseenter" ,function(e){
		e.preventDefault();
		$(this).find('.info__dropdown').css("display" ,"block");
	});
	$('.info__icon').on("mouseleave" ,function(e){
		e.preventDefault();
		$(this).find('.info__dropdown').css("display" ,"none");
	});

	$(document).click(function(event) { 
	  var $target = $(event.target);
	  if(!$target.closest('.dropdown__input').length) {
	    $(".dropdown__input .dropdown__box").fadeOut(200);
	  }        
	});

	$('.dropdown__input .dropdown__box ul li a').on("click" , function(e){
		console.log('click a1');
		e.preventDefault();

		// $(this).closest(".dropdown__input").find(">a>.dropdown__logo>img").attr("src" , $(this).find(".logo__crypto>img").attr("src"));
		// $(this).closest(".dropdown__input").find(">a>.text__dropdown").text($(this).find('.text__drop').text());
		$(this).closest(".dropdown__box").fadeOut(200);
		$(this).closest(".dropdown__input").removeClass("opened__dropdown");

	});
	$(".dropdown__input>a").on("click" , function(e){
		console.log('click a2');
		
		e.preventDefault();
		$('.dropdown__box').css("display" , "none");
		$(this).closest('.dropdown__input').find(".dropdown__box").fadeIn(300);
		$(this).closest('.dropdown__input').addClass("opened__dropdown");
	});
	$("a.dropdown__input").on("click" , function(e){
		console.log('click a3');
		e.preventDefault();
		$('.dropdown__box').css("display" , "none");
		$(this).closest('.dropdown__input').find(".dropdown__box").fadeIn(300);
		$(this).closest('.dropdown__input').addClass("opened__dropdown");
	});


	$('.theme__switcher a').on("click" ,function(e){
		e.preventDefault();
		if ($(this).hasClass("dark__switch")) {
			$('.theme__switcher a').removeClass("dark__switch");
			$('.theme__switcher a').addClass("light__switch");
			$('.theme__switcher>div').removeClass("dark__switch");
			$('.theme__switcher>div').addClass("light__switch");
			$('.main__wallet').removeClass("dark__theme");
			$(".main__wallet").addClass("light__theme");
			$("body").removeClass("dark");
			$("body").addClass("light");
		} else {
			$('.theme__switcher a').removeClass("light__switch");
			$('.theme__switcher a').addClass("dark__switch");
			$('.theme__switcher>div').removeClass("light__switch");
			$('.theme__switcher>div').addClass("dark__switch");
			$('.main__wallet').addClass("dark__theme");
			$(".main__wallet").removeClass("light__theme");
			$("body").addClass("dark");
			$("body").removeClass("light");
		}
	});

	$('.theme__switcher--button').on("click" ,function(e){
		e.preventDefault();
		if ($(this).find(".theme__switcher>div").hasClass("dark__switch")) {
			$('.theme__switcher a').removeClass("dark__switch");
			$('.theme__switcher a').addClass("light__switch");
			$('.theme__switcher>div').removeClass("dark__switch");
			$('.theme__switcher>div').addClass("light__switch");
			$('.main__wallet').removeClass("dark__theme");
			$(".main__wallet").addClass("light__theme");
			$("body").removeClass("dark");
			$("body").addClass("light");
		} else {
			$('.theme__switcher a').removeClass("light__switch");
			$('.theme__switcher a').addClass("dark__switch");
			$('.theme__switcher>div').removeClass("light__switch");
			$('.theme__switcher>div').addClass("dark__switch");
			$('.main__wallet').addClass("dark__theme");
			$(".main__wallet").removeClass("light__theme");
			$("body").addClass("dark");
			$("body").removeClass("light");
		}
	});
	$(window).on('resize' ,function(){
		if ($(window).width() > 991) {
			$(".header__button").removeClass("opened__menu");
			$(".small__menu").fadeOut(300);
			$("body,html").css("overflow-y" , "auto");
		}
	});
	$('.header__button>a').on("click" ,function(e){
		e.preventDefault();
		if ($(this).closest(".header__button").hasClass('opened__menu')) {
			$(this).closest(".header__button").removeClass("opened__menu");
			$(".small__menu").fadeOut(300);
			$("body,html").css("overflow-y" , "auto");
		} else {
			$(this).closest(".header__button").addClass("opened__menu");
			$(".small__menu").fadeIn(300);
			$("body,html").css("overflow-y" , "hidden");
		}
	});
});