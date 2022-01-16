/*
kakao
24a84e0d94214e6e7fdd697b820464b0

*/ 



$(function(){
/******************************* 글로벌 설정 ********************************/
let time;
let timeDivision;
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
/******************************* 사용자 함수 *******************************/
init();
function init(){
   initBg();
}
function initBg(){
     let d = new Date('2022-01-27 08:14:09');
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
/******************************* 이벤트 등록 ******************************/
/******************************* 이벤트 콜백 *****************************/
});
