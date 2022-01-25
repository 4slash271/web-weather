/*
kakao
bee6546e2c854d1ebb4f340f8d231f9f
opemweathermap
d448bd0f037cc68b858d9cc0c8556118


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
let dailyURL = 'https://api.openweathermap.org/data/2.5/weather';
let weeklyURL = 'https://api.openweathermap.org/data/2.5/forecast';
let appid ='d448bd0f037cc68b858d9cc0c8556118';
let sendData = {appid: appid, units:'metric'};
let iconPath = 'http://openweathermap.org/img/wn/';
let defPath = '//via.placeholder.com/40x40/c4f1f1?text=%20';
let $bgWrapper = $('.bg-wrapper');
let $map = $('#map');
/******************************* 사용자 함수 *******************************/
init();
function init(){
   initBg();
   initMap();
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
 //openweathermap에서 icon 가져오기
 function getIcon(icon){
     return iconPath +icon + '@2x.png';
 }
/******************************* 이벤트 등록 ******************************/
function onGetCity(r){
     
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
    console.log(customOverlay.a);
    customOverlay.setMap(map);   
    $(customOverlay.a).mouseenter(onOverlayEnter);
    $(customOverlay.a).mouseleave(onOverlayLeave);
    $(customOverlay.a).click(onOverlayClick);
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
/******************************* 이벤트 콜백 *****************************/
function onOverlayClick(){
    
}
function onOverlayEnter(){
    //this=> .co-wrapper중 호버된 것의 부모
    $(this).find('.co-wrap').css('display','flex');
    $(this).css('z-index', 1);
    sendData.lat = $(this).find('.co-wrapper').data('lat');
    sendData.lon = $(this).find('.co-wrapper').data('lon');
    $.get(dailyURL,sendData, onLoad.bind(this));
    function onLoad(r){
        $(this).find('.temp').text(r.main.temp);
        $(this).find('.icon').attr('src',getIcon(r.weather[0].icon));
        
    }
}
function onOverlayLeave(){
    $(this).css('z-index', 0);
    $(this).find('.co-wrap').css('display',' none');
    
}

});
