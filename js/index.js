/*
kakao
0ae3d753b977480d61f51266d65cf7a6

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
 }
/******************************* 이벤트 등록 ******************************/
function onResize(){
    let windowHeight = $(window).innerHeight();
    let lat = (windowHeight > 800 || 600 > windowHeight) ? mapCenter.lat : mapCenter.lat +1.2
    map.setCenter(new kakao.maps.LatLng(lat, mapCenter.lon))
    map.setLevel(windowHeight > 800 ? 13 : 14)

}
/******************************* 이벤트 콜백 *****************************/
$(window).resize(onResize);
});
