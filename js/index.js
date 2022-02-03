/*
kakao
bee6546e2c854d1ebb4f340f8d231f9f
opemweathermap
df79ca72c06b8286f455e64a4e2c65e4


openweathermap.com icon: http://openweathermap.org/img/wn/10d@2x.png

24시간 전 날씨정보: https://api.openweathermap.org/data/2.5/onecall?lat=37.56322905592715&lon=126.98987106691214&exclude=&appid=d448bd0f037cc68b858d9cc0c8556118&units=metric&dt=1620780822


*/ 



$(function(){
/******************************* 글로벌 설정 ********************************/
let time;
let timeDivision;
let mapCenter ={
    lat: 35.8396893956944, lon: 127.555918
};
let weatherIcon = {
    i01: 'bi-brightness-high',
    i02: 'bi-cloud-sun',
    i03: 'bi-cloud',
    i04: 'bi-clouds',
    i09: 'bi-cloud-rain-heavy',
    i10: 'bi-cloud-drizzle',
    i11: 'bi-cloud-lightning',
    i13: 'bi-cloud-snow',
    i50: 'bi-cloud-haze',
}
let todayURL = 'https://api.openweathermap.org/data/2.5/weather';
let weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
let yesterdayURL = 'https://api.openweathermap.org/data/2.5/onecall/timemachine';
let sendData = {appid:'df79ca72c06b8286f455e64a4e2c65e4', units:'metric', lang:'kr'};
let iconPath = 'http://openweathermap.org/img/wn/';
let defPath = '//via.placeholder.com/40x40/c4f1f1?text=%20';
let $bgWrapper = $('.bg-wrapper');
let $map = $('#map');
/******************************* 사용자 함수 *******************************/
init();
function init(){
   initBg();
   initMap();
   initWeather();
}
function initBg(){
     let d = new Date();
    time = d.getHours();
    timeDivision = 
    (time >= 2&& time < 6) ? 1 :
    (time >= 6&& time < 10) ? 2 :
    (time >= 10&& time < 14) ? 3 :
    (time >= 14&& time < 18) ? 4 :
    (time >= 18&& time < 22) ? 5 : 6;
    
    for(let i=1; i<6; i++){
        $bgWrapper.removeClass('active'+i);//반복문이 1-5를 돌면서 active 모두 제거
    }
    $bgWrapper.addClass('active'+timeDivision);//현재 시간에 해당하는 클래스값만 부여
}
 function initMap(){
 
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lon), //지도의 중심좌표.
        level: 13, //지도의 레벨(확대, 축소 정도),
        draggable: false,
        zommable:false
    };  
    map = new kakao.maps.Map($map[0], options); //지도 생성 및 객체 리턴
    map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);   

    //윈도우 사이즈가 변경되면 지도 중심 맞추기
     $(window).resize(onResize).trigger('resize');
    //도시정보 가져오기
    $.get('../json/city.json', onGetCity);
 }
 function initWeather(){
     navigator.geolocation.getCurrentPosition(onSuccess, onError);
     function onSuccess(r){
         console.log(r);
         console.log(r.coords.latitude);
         var lat = r.coords.latitude;
         var lon = r.coords.longitude;
         var data = cloneObject(sendData);
         data.lat = lat;
         data.lon = lon;
         $.get(todayURL, data, onToday);
         $.get(weeklyURL, data, onWeekly);

     }
     function onError(err){
        var data = cloneObject(sendData);
        data.lat = 37.563229;
        data.lon = 126.989871;
        $.get(todayURL, data, onToday);
        $.get(weeklyURL, data, onWeekly);
     }
  
 }
 //openweathermap에서 icon 가져오기
 function getIcon(icon){
     return iconPath +icon + '@2x.png';
 }
 /******************************* 이벤트 콜백 *****************************/
 function onToday(r){
     console.log(r);
     var $wrapper = $('.weather-wrapper');
     var $title = $wrapper.find('.title-wrap');
     var $summery = $wrapper.find('.summery-wrap');
     var $desc = $wrapper.find('.desc-wrap');
     var $icon = $wrapper.find('.icon-wrap');
     $title.find('.name').text(r.name + ',KR');
     $title.find('.time').text(moment(r.dt*1000).format('hh시 mm분 기준'));
     $summery.text(r.weather[0].description);
     $desc.find('.temp .current-temp').text(r.main.temp);
     $desc.find('.temp-gap .max').text(r.main.temp_max);
     $desc.find('.temp-gap .min').text(r.main.temp_min);
     $icon.find('img').attr('src',getIcon(r.weather[0].icon));


     var data = cloneObject(sendData);
     data.lat = r.coord.lat;
     data.lon = r.coord.lon;
     console.log(data.lat);
     console.log(data.lon);
     data.dt = r.dt - 84600;


     console.log(r.dt);
     console.log(data.dt);
     $.get(yesterdayURL,data, onYesterday );
     function onYesterday(r2){
         console.log(r2);
         var gap = (r.main.temp - r2.current.temp).toFixed(1);
         if(gap === 0){
            $desc.find('.temp-desc .josa').text('와');
            $desc.find('.temp-desc .gap').hide();
            $desc.find('.temp-desc .desc').text('같아요');

         }
         else{
           $desc.find('.temp-desc .josa').text('보다');
           $desc.find('.temp-desc .gap').show();
           $desc.find('.temp-desc .gap .gap-temp').text(Math.abs(gap));
           $desc.find('.temp-desc .desc').text((gap > 0)? '높아요':'낮아요');
         }
         console.log(gap);
    }
}
function onWeekly(r){
    var $slick = $('.weather-wrapper .slide-wrapper');
    var $btPrev = $('.weather-wrapper .weekly-wrapper .bt-slide.left');
    var $btNext = $('.weather-wrapper .weekly-wrapper .bt-slide.right');
    var slick = {
        autoplay: true,
        autoplaySpeed: 2000,
        infinite: true,
        touchThreshold: 10,
        arrows: false,
        dots: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      }; 
      $('.weather-wrapper .slide-wrapper').slick(slick);
      makeSlickButton($slick, $btPrev, $btNext);
}
function onGetCity(r){
    console.log(r);
    
    r.city.forEach(function(v, i){
        var content ='';
        content += '<div class="co-wrapper '+(v.minimap ? '':"minimap")+'" data-lat="'+v.lat+'"data-lon="'+v.lon+'"> ';
        content += '<div class ="co-wrap">';
        content += '<div class ="icon-wrap">';
        content += '<img src="'+defPath+'"class="icon w-100">';
        content += '</div>';
        content += '<div class ="temp-wrap">';
        content += '<span class="temp"></span>℃';
        content += '</div>';
        content += '</div>';
        content += v.name;
        content += '</div>';
        var customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(v.lat, v.lon),
            content: content,
            xAnchor: v.anchor? v.anchor.x :0,
            yAnchor: v.anchor? v.anchor.y :0,
        });
        customOverlay.setMap(map);   
        $(customOverlay.a).mouseenter(onOverlayEnter);
        $(customOverlay.a).mouseleave(onOverlayLeave);
        $(customOverlay.a).click(onOverlayClick);

        // var html = '<li class="city '+(v.title ? 'title' : '')+'" data-lat="' + v.lat + '" data-lon="' + v.lon + '">'+v.name+'</li>';
		// 	$('.weather-wrapper .city-wrap').append(html);
    });
    
    $(window).trigger('resize');
    
}
function onResize(){
    let windowHeight = $(window).innerHeight();
    let lat = (windowHeight > 800 || 600 > windowHeight) ? mapCenter.lat : mapCenter.lat +1.2
    map.setCenter(new kakao.maps.LatLng(lat, mapCenter.lon))
    if(windowHeight < 800){
        $(".minimap").hide();
        map.setLevel(14);
    }
    else{
        $(".minimap").show();
        map.setLevel(13);
    }
    
}

/******************************* 이벤트 등록 ******************************/
function onOverlayClick(){
    var data = cloneObject(sendData);
    data.lat = $(this).find('.co-wrapper').data('lat');
    data.lon = $(this).find('.co-wrapper').data('lon');
    $.get(todayURL, data, onToday);
    $('.co-wrapper').removeClass('click');
    $(this).find('.co-wrapper').addClass('click');
  
}
function onOverlayEnter(){
    //this=> .co-wrapper중 호버된 것의 부모
    $(this).find('.co-wrap').css('display','flex');
    $(this).css('z-index', 1);
    var data = cloneObject(sendData);
    data.lat = $(this).find('.co-wrapper').data('lat');
    data.lon = $(this).find('.co-wrapper').data('lon');
    $.get(todayURL,data, onLoad.bind(this));
    function onLoad(r){
        console.log(r);
        $(this).find('.temp').text(r.main.temp);
        $(this).find('.icon').attr('src',getIcon(r.weather[0].icon));
        
    }
}
function onOverlayLeave(){
    $(this).css('z-index', 0);
    $(this).find('.co-wrap').css('display',' none');
    
}

});
