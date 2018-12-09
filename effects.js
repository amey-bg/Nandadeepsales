 
$(document).ready(function(){
	
/****************** Lightbox Coding **********/

	var img_links = [];
	var img_names = [];
	var rel; // this var will hold the value group name assigned to each image...
	var curr_img_url; // denotes the current active image...
	var curr_img_loc; // denotes the current active image index...
	var first_img_loc; // denotes the first image index...
	var last_img_loc; // denotes the last image index...
	var total_imgs; // denotes the total images available in the particular section or group...
	var img_caption;
	
	/** Slideshow option related variables **/
	var time_interval; // This var is useful in slideshow option 
	var slideshow_timer = 4200; // This var is to set animation duration in slideshow...
	
	/** fade effect's related variables **/
	var fadeout_time = 600;
	var fadein_time = 900;
	var easing_function = 'swing';
	
	//getting all <a> references which are having class as lightbox...
	var img_links = $('.img_box a.lightbox'); // please give your outer container name which holds all the images..

	$('a.lightbox').on('click', function(e){
		
		//console.log($(this).attr('href'));
		e.preventDefault();
		
		img_grp_name = $(this).attr('rel');
		img_caption = $(this).attr('title');
		console.log('Title = ' +img_caption);
		
		var cnt=0;			
		for(var i=0; i < img_links.length; i++)
		{	
			if($(img_links[i]).attr('rel') == img_grp_name){
				img_names[cnt] = $(img_links[i]).attr('href');
				cnt++;
			}	
		}		
		total_imgs = img_names.length; /* assigning total images present in the img_names[]... */
		console.log(total_imgs);
		/* Assigning values to first_img_loc and last_img_loc if array has images... */
		if(total_imgs > 0) {
			first_img_loc = 0;
			last_img_loc = total_imgs - 1;
		}				
		curr_img_url = $(this).attr('href'); /* extracting the currently displayed image's URL... */
		/* Assigning value to curr_img_loc from currently opened image's URL using loop...  */
		/*for( var i=0; i< total_imgs; i++) {
			if(curr_img_url == img_names[i]) {
				curr_img_loc = i;
				break;
			}
		}*/
		
		/***
			Code for dynamically generating full screen overlay with all control 
			buttons like close, next, prev, slideshow etc.
		***/
		var lightbox_obj = $('<div />', {
			"class" : 'full_screen_box'	
		});
		
		var close_btn_obj = $('<p />', {
			"class": 'close_btn',
			"html": '<i class="fa fa-times-circle" aria-hidden="true"></i>',
			"title" : 'Exit'
		});
		
		var img_caption_back = $('<span />', {
			"class": 'img_caption'
		});
		/*var navigation_btns_obj = $('<div />', {
			"id": 'nav_btns'
		});
		
		var next_btn_obj = $('<span />', {
			"class" : 'next_btn',
			"html" : '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>',
			"title" : 'Next'
		});
		
		var play_btn_obj = $('<span />', {
			"class" : 'play_btn',
			"html" : '<i class="fa fa-play-circle" aria-hidden="true"></i>',
			"title" : 'Start Slideshow'
		});
		
		var prev_btn_obj = $('<span />', {
			"class" : 'prev_btn',
			"html" : '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>',
			"title" : 'Previous'
		});
		
		var clearfix_obj = $('<div />', {
			"class" : 'clr_float'
		}); 
		*/
		/** Appending next and prev btns and obviously clearfix div to
			navigation_btns 
		**/	
		/*
		navigation_btns_obj.append(prev_btn_obj)
							.append(play_btn_obj)
							.append(next_btn_obj)
							.append(clearfix_obj);
		*/
		/** Appending navigation_btns and close_btn to lightbox **/
		close_btn_obj.appendTo(lightbox_obj);
		img_caption_back.appendTo(lightbox_obj);
		//navigation_btns_obj.appendTo(lightbox_obj);
		
		/** Appending lightbox to div with id wrap...
			Actual insertion in the DOM 
		**/
		lightbox_obj.appendTo('#wrapper'); // please give the main wrapper div id name of your html page...
		
		/******************************************************************/		
		/* Fading the lightbox viewer... */
		$('.full_screen_box').fadeIn(600, easing_function, function(){
			
			$('.full_screen_box').append('<div class="loader_box"><div class="loader"></div></div>');
			
			$('.full_screen_box').append('<img />');
			$('.full_screen_box img').on('load', function() {
				console.log('Image is fully loaded ' +curr_img_url);
				$('.full_screen_box .loader_box').detach();
			}).attr({'src' : curr_img_url});
			$(img_caption_back).html(img_caption);
			
			//$('.full_screen_box').append('<img src="'+curr_img_url+'">'); /* appending currently clicked image to lightbox... */
				
		});
		
		/* function to close the image viewer box... */
		$('.full_screen_box .close_btn').on('click', function(){
			$('.full_screen_box').fadeOut(fadeout_time, easing_function, function(){
				$('.full_screen_box').remove();  /* removing the entire lightbox with its children after closing the lightbox... */
				img_names = []; // Flushing the array of img_names to set to empty...
				/** the below step is important to clear the timer set while enabling slideshow and forgot
				   	to stop slideshow or clear the interval before closing the lightbox...
				**/
				clearInterval(time_interval);
			});
		});
		
		/** Closing the lightbox if Esc key is pressed... **/
		/** Important Note : keyCode is now in the process of being deprecated and most modern browsers offer 
			the key property now, although you'll still need a fallback for decent browser support.
			Keypress will return a character connected to a key ( in correct caps etc ), Keyup will return 
			the number of hardware button pressed. For ESC you'd want the hardware code 27
			( not the ascii character 27 ). 
			
			Kaycode for Esc button is '27'.
		**/ 	
		$(document).on('keydown', function(e){
			e = e || window.event;
			var isPressed = false;
			if( 'key' in e) {
				isPressed = (e.key == 'Escape' || e.key == 'Esc');
			} else { 
				isPressed = (e.keycode == 27);
			}
			if( isPressed ) {
				
				$('.full_screen_box').fadeOut(400, easing_function, function(){
					$('.full_screen_box').remove();  /* removing the entire lightbox with its children after closing the lightbox... */
					img_names = []; // Flushing the array of img_names to set to empty...
					/** the below step is important to clear the timer set while enabling slideshow and forgot
					   to stop slideshow or clear the interval before closing the lightbox...
					**/      
					clearInterval(time_interval);
				});
			}
		});
		/***********************************************************************************/

	}); // lightbox click function ends...
	

/*************** Back To Top Anchor **********/

	$(window).scroll(function() {
		if ($(document).scrollTop() >= 500) {
			$('.back_to_top').fadeIn(200);
		} 
		else 
		{
			$('.back_to_top').fadeOut(200);
		}
	});
	//on click function to get back to top of a document...
	$('.back_to_top').click(function(){
			$('html, body').stop().animate({
					scrollTop : 0
				}, 1300);
	});
/**********************************************/

/************ Menu trial 29_Sep_16************/
	
	/****** 21_Oct_2016 *******/
// Open the menu
		var menu_ic = $('.responsive_menu_icon i');
		$(menu_ic).on('click', function() {
			
			show_menu();
			
		});	
		
		function show_menu() {
			var patch_height = $('.overlay').height();
			var temp_patch_height, z_index;
			
			var menu_icon_cls = 'fa-bars';
			var close_icon_cls = 'fa-times';
			var add_cls, remove_cls;
			
			var overlay_obj, main_menu, main_menu_icon; 
			overlay_obj = $('.overlay');
			//main_menu = $('.responsive_menu_icon');
			main_menu_icon = $('.responsive_menu_icon i');
			
			//var inner_menu_height = $('.submenu_box').height();
			
			if(patch_height > 0) {
				//if( inner_menu_height > 0)
					//show_inner_menu(); // calling this function to close the inner menu if and only if it is opened...
					
				temp_patch_height = 0;
				z_index = 5;
				add_cls = menu_icon_cls;
				remove_cls = close_icon_cls;
				
			} else {
				
				temp_patch_height = 100;
				z_index = 20;
				add_cls = close_icon_cls;
				remove_cls = menu_icon_cls;
			}
			
			overlay_obj.animate({
				'height' : temp_patch_height + '%'
			}, 300, function() {
				main_menu_icon.css({ 'z-index' : z_index});
				main_menu_icon.removeClass(remove_cls).addClass(add_cls);
			});
				
		}
	
/***********************************/	



	function smooth_scroll(){
		
		$('a[href^="#"]').on('click', function(e){
		
			// this will store the href value of currently clicked link...
			var target = $(this).attr('href');
			console.log('target = '+target);
			// this will stop the default behavior of <a> tag to jump from the one place to another...
			e.preventDefault();
			
			var pos;
			//check if the valid link is clicked if not then exit...
			//if( target === '#')
				//return false;
			//else
			    pos = $(target).offset().top;
				
			
			console.log('pos = '+pos);
			
			var par = $(this).parents('div#menu');
			console.log('PAR = '+ par.css('width'));
			// This will ensure that #menubar will not be shown/hidden if we click on any other sublinks...
			if(!(par.hasClass('desk_menu')))
			{
				if($('.responsive_menu_icon i').hasClass('fa-bars'))
				{	
					console.log('inside the smooth If'); 
					show_menu();
				}
				else{
					console.log('inside the smooth Else');
					show_menu();
				}
			}
			//else{ //return false;
				
		//	}	
			
			$('html, body').stop().animate({
				scrollTop : pos
			}, 1000);
			
			
		});
	}
		
	smooth_scroll();
/**********************************************/


/******** Accordian Section ***************/

	var accordion = $('.accordion');
	var heading = $('.category_head');
	var content_box = $('.category_content');
	var icon = $('.category_head i');
	
	content_box.not(':first').hide();
	accordion.on('click', '.category_head', function(){
		var this_obj = $(this);
		var temp_content_box = this_obj.next();
		if(!temp_content_box.is(':visible')) {
			temp_content_box.trigger('showContent');
		}
	});
	var animateAccordion = function(element, duration, easing){
		content_box.stop(true,true).slideUp(duration, easing);
		$(element).stop(true,true).slideDown(duration, easing);
	}
	
	accordion.on('showContent', '.category_content', function(){
		animateAccordion(this, 300, 'linear');
	});
	
	
/******************************************/


/********** Read More **************/

	$('span.read_more').on('click', function(){
		var obj = $('.hidden_text');
		var read_btn = $('.read_more');
		if(read_btn.hasClass('show')){
			read_btn.removeClass('show').addClass('hide');
			read_btn.text('Read Less...');
		}else {
			read_btn.text('Read More...');
			read_btn.removeClass('hide').addClass('show');
		}
		obj.slideToggle(200, 'linear', function(){
			
		});
	});

/*********************************/

/*********** Clients Section Slider **************/

	var animationSpeed = 1000;
	var pause = 3000;
	var currentSlide = 1;
	var margin_bet;
	var limit;
	
	var slider = $('#main_cont');
	var sliderCont = slider.find('.clients');
	//console.log('UL length ='+sliderCont.length);
	if($(window).width() < 540)
	{
		margin_bet = 20;
		limit = 5;
	}else if($(window).width() < 811){
		margin_bet = 30;
		limit = 4;
	}else if($(window).width() < 1030){
		margin_bet = 40;
		limit = 3;
	}else {
		margin_bet = 80;
		limit = 3;
	}
	var slides = sliderCont.find('.clogo'); 
	var width = slides.width() + margin_bet;
	//console.log(slides.length);
	//console.log('Li width ='+width);
	var interval;
	var flag=1, value = 0;
	
	function startSliding(){
		interval = setInterval(function(){
			
			if(flag == 0)
			{
				value=0;
				console.log('flag in if(flag==0) = '+flag);
			}else
			{
				value -= width;
				console.log('flag in if(flag==0) else = '+flag);
			}
			sliderCont.animate({'margin-left' : value }, animationSpeed, function(){
				
				//console.log(currentSlide + ' n = '+value);
				
				if(currentSlide == limit){
					currentSlide = 0;
					flag=0;
				}else if(currentSlide < limit) {
					flag=1;
					currentSlide++;
					//console.log('m in else = '+m +' currentslide = '+currentSlide);
				}
				
			});
		}, pause);
	}// function startSliding() ends...
	
	startSliding();


/*************************************************/
		
		
		
		
}); // document.ready function ends here...