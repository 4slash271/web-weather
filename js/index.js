$(function(){
/******************************* 글로벌 설정 ********************************/
let time;
let timeDivision;
let $stageWrapper = $('.stage-wrapper');
/******************************* 사용자 함수 *******************************/
init();
function init(){
   initBg();
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
        $stageWrapper.removeClass('active'+i);//반복문이 1-5를 돌면서 active 모두 제거
    }
    $stageWrapper.addClass('active'+timeDivision);//현재 시간에 해당하는 클래스값만 부여
}
/******************************* 이벤트 등록 ******************************/
/******************************* 이벤트 콜백 *****************************/
});
