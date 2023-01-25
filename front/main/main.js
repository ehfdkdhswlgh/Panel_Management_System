/* 지도 생성 */

let label; 
let openWin;

//IP 설정--------------------------------------------------------------
const ip = "127.0.0.1";
//const ip = "61.80.179.120";
//--------------------------------------------------------------------


var map = new Tmapv2.Map("tmap", { // 지도가 생성될 div
    center : new Tmapv2.LatLng(35.2071463000, 129.0762170000),
    width : "100%", // 지도의 넓이
    height : "100%", // 지도의 높이
    zoom : 16
});
  let new_lat,new_lon;
  let nearStation_id;
 
  let nearStation_name;

let stationInfo;

//오른쪽 마우스 클릭스 수정 삭제 가능.
const contextMenu = document.querySelector(".wrapper");
const trash = document.querySelector("#trash")
const edit = document.querySelector("#edit")



var map = new Tmapv2.Map("tmap", { // 지도가 생성될 div
    center : new Tmapv2.LatLng(35.2071463000, 129.0762170000),
    width : "100%", // 지도의 넓이
    height : "100%", // 지도의 높이
    zoom : 16
});



(async function getStations(){

	
	const dataSet = await axios({
		method: "get",
		url: "http://"+ip+":23000/stations",
		headers: {},
		data: {},
	});

  const logDataSet = await axios({
    method: "get",
    url: "http://"+ip+":23000/stationLogs",
    headers: {},
    data: {},
  });
  
  logStationInfo = logDataSet.data.result;
  
  const tab3 =  document.querySelector("#tab-3Body");
  tab3.innerHTML = stationLogView(logStationInfo);



  stationInfo= dataSet.data.result;



  let stationList = document.querySelector("#station_list_body");

    
  for (var i = 0; i < stationInfo.length; i++) {
    // 마커를 생성합니다

    $(stationList).append("<tr id = station_row value = " + stationInfo[i].station_id+ "> <th>" + stationInfo[i].stationName + "</th> <th>" +stationInfo[i].updateAt + "</th>" +"</tr>");
   
    let coords = new Tmapv2.LatLng(stationInfo[i].dmX, stationInfo[i].dmY);
    
    let markerContents = markerView(stationInfo[i]);
    var title = stationInfo[i].stationName;
    label="<span style='background-color: #46414E;color:white'>"+title+"</span>";
    var marker = new Tmapv2.Marker({
      map: map, // 마커를 표시할 지도
      position: coords, // 마커를 표시할 위치
      icon: "../icon/측정소.png",
      title: title,
      label: label
    });



       marker.addListener("mouseenter", function(evt) {
        const tab1 =  document.querySelector("#tab-1")
        tab1.innerHTML = markerContents
    
     

        $('ul.tabs li#testtest').trigger("click");
  });

      marker.addListener("click", function(evt) {
          console.log(stationInfo[i].station_id)
      });

    
  }

  console.log(stationList)
	$(function() {

    $("#station_list_body tr").on('click',function(e) {
        e.preventDefault();

        var stationID = $(this).attr('value');
     
      

        for (var i = 0; i < stationInfo.length; i++) {
      
          if(stationInfo[i].station_id == stationID){
           
            var ll = new Tmapv2.LatLng(stationInfo[i].dmX, stationInfo[i].dmY);
          
            map.setCenter(ll);
            var markerContents = markerView(stationInfo[i]);
            const tab1 =  document.querySelector("#tab-1");
            tab1.innerHTML = markerContents
            $('ul.tabs li#testtest').trigger("click");
            break;
          }
          
        }

    });


});

  await setLedMarker();

})();






async function setLedMarker(){

let lonlat;
let min_distance = Infinity;
let temp = null; 


    map.addListener("contextmenu", function(evt) {
      lonlat = evt.latLng; 
      new_lat = lonlat.lat();
      new_lon = lonlat.lng();  
    

      for(var i = 0; i < stationInfo.length; i++) {
          temp = getDistance(new_lat,new_lon,stationInfo[i].dmX,stationInfo[i].dmY);


          if(min_distance > temp) {
            min_distance = temp;
        
            nearStation_id = stationInfo[i].station_id
            nearStation_name = stationInfo[i].stationName
            
          }

        
      }

  
      confirmPorm();    
     
     
});


const logDataSet = await axios({
  method: "get",
  url: "http://"+ip+":23000/boardWeatherLogs",
  headers: {},
  data: {},
});


const dataSet = await axios({
  method: "get",
  url: "http://"+ip+":23000/boards",
  headers: {},
  data: {},
});


 ledInfo = dataSet.data.result;
 
 logLedInfo = logDataSet.data.result;
 console.log(logLedInfo[1].board_weather_log_id)
 const tab2 =  document.querySelector("#tab-2Body");
 tab2.innerHTML = LedLogView(logLedInfo);


 let ledList = document.querySelector("#led_list_body");


for (var i = 0; i < ledInfo.length; i++) {
  // 마커를 생성합니다
  

  $(ledList).append("<tr id = led_row value = "  + ledInfo[i].custom_id+"> <th>" + ledInfo[i].custom_id + "</th> <th>" +ledInfo[i].updateAt + "</th>" +"</tr>");

  


  let coords = new Tmapv2.LatLng(ledInfo[i].lat, ledInfo[i].lon);

  let ledmarkerContents = getLedMarkerContent(ledInfo[i])
  let markerID = ledInfo[i].custom_id
  var title = ledInfo[i].name;
  label="<span style='background-color: #46414E;color:white'>"+title+"</span>";
  var marker = new Tmapv2.Marker({
    map: map, // 마커를 표시할 지도
    position: coords, // 마커를 표시할 위치
    draggable: true,
    icon: "../icon/분전함.png",
    label : label,
    title : title
    
  });



  // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
  // 이벤트 리스너로는 클로저를 만들어 등록합니다
  // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다


     marker.addListener("mouseenter", function(evt) {

        const tab1 =  document.querySelector("#tab-1")
        tab1.innerHTML = ledmarkerContents
        $('ul.tabs li#testtest').trigger("click");
});

   

    marker.addListener("dragend", function (evt) {
    
      let isConfilm = confirm("분전함의 위치를 현재 위치로 이동시키시겠습니까?")
      
      let lonlatC = evt.latLng; 
      new_latC = lonlatC.lat();
      new_lonC = lonlatC.lng();


      if(isConfilm) {
        sendLonlatValue(markerID,new_latC,new_lonC);
        location.reload();
      } else {
        location.reload();
      }
    });

//마커 드래그시 좌표값 넘겨주기..
    

}








//수정시 기본값 나오게 하는 함수
$(function() {


  $("#led_list_body tr").on('click',function(e) {
      e.preventDefault();
      var str_id = $(this).attr('value');
    console.log(str_id)

      let defaltName,defaltModem_number,defaltAddr,
      defaltDong,defaltLat,defaltLon,defaltInstallAt,defaltStation_id,defaltStationName,defaltMemo
      for (var i = 0; i < ledInfo.length; i++) {

        if(ledInfo[i].custom_id == str_id){
          defaltName = ledInfo[i].name;
          defaltModem_number = ledInfo[i].modem_number;
          defaltAddr = ledInfo[i].address;
          defaltDong = ledInfo[i].administrative_dong;
          defaltLat = ledInfo[i].lat;
          defaltLon = ledInfo[i].lon;
          defaltInstallAt = ledInfo[i].installAt;
          defaltStation_id = ledInfo[i].station_id;
          defaltStationName = ledInfo[i].stationName;
          defaltMemo = ledInfo[i].memo;

          var ll = new Tmapv2.LatLng(ledInfo[i].lat, ledInfo[i].lon);
          map.setCenter(ll);
          var markerContents = getLedMarkerContent(ledInfo[i]);
          const tab1 =  document.querySelector("#tab-1");
          tab1.innerHTML = markerContents;


          $('ul.tabs li#testtest').trigger("click");
          break;
        }
      }
      



      

  $("#led_list_body tr").on('contextmenu rightclick', function(e){

  
    console.log(str_id)
    let x = e.offsetX, y = e.offsetY,
  
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    cmWidth = contextMenu.offsetWidth,
    cmHeight = contextMenu.offsetHeight;

    x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
    y = y > winHeight - cmHeight ? winHeight - cmHeight -5 : y;
    
    contextMenu.style.left = `${x+100}px`;
    contextMenu.style.top = `${y+30}px`;
    contextMenu.style.visibility = "visible";

    trash.onclick = function (event) {
      if (confirm("분전함을 삭제하시겠습니까?") == true){    
        contextMenu.style.visibility = "hidden";
          deleteLed(str_id);

    }else{ 
      contextMenu.style.visibility = "hidden";
        return false;
   
    }
   
    };

    edit.onclick = function(event) {
      if (confirm("분전함을 수정하시겠습니까?") == true){    
        contextMenu.style.visibility = "hidden";
        console.log(defaltAddr)
        showEditPopup(str_id,defaltName,defaltModem_number,defaltAddr,
          defaltDong,defaltLat,defaltLon,defaltMemo,defaltStation_id,defaltStationName);
      }
      else {
        contextMenu.style.visibility = "hidden";
        return false;
      }
    }

})  
    $("#led_list_body tr").bind('click', function(){
      contextMenu.style.visibility = "hidden";
    })

  



  });

});



}


//탭 이동기능


$(document).ready(function(){
 
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');

   
	})

});







function sendLonlatValue(led_id,lat_data,lon_data) {


      // [요청 url 선언]
  var reqURL = "http://"+ip+":23000/boards"; // 요청 주소
  
  // [요청 json 데이터 선언]
  var jsonData = { // Body에 첨부할 json 데이터
      "custom_id" : led_id,
      "lat" : lat_data,
      "lon" : lon_data,
      };  


  console.log(jsonData)

  
  console.log("");
  console.log("[requestPostBodyJson] : [request url] : " + reqURL);
  console.log("[requestPostBodyJson] : [request data] : " + JSON.stringify(jsonData));
  console.log("[requestPostBodyJson] : [request method] : " + "POST BODY JSON");
  console.log("");
  
  $.ajax({
      // [요청 시작 부분]
      url: reqURL, //주소
      data: JSON.stringify(jsonData), //전송 데이터
      type: "patch", //전송 타입
      async: true, //비동기 여부
      timeout: 5000, //타임 아웃 설정
      dataType: "JSON", //응답받을 데이터 타입 (XML,JSON,TEXT,HTML,JSONP)    			
      contentType: "application/json; charset=utf-8", //헤더의 Content-Type을 설정
                      
      // [응답 확인 부분 - json 데이터를 받습니다]
      success: function(response) {
          alert("분전함의 위치가 이동되었습니다!")

      },
                      
      // [에러 확인 부분]
      error: function(xhr) {
          alert("DB에러")			
      },
                      
      // [완료 확인 부분]
      complete:function(data,textStatus) {
          console.log("");
          console.log("[requestPostBodyJson] : [complete] : " + textStatus);
          console.log("");    				
      }
      });		
  

}




function deleteLed(custom_id) {

     // [요청 url 선언]
  var reqURL = "http://"+ip+":23000/boards/"+custom_id; // 요청 주소
  
  
  // [요청 json 데이터 선언]



  
  console.log("");
  console.log("[requestPostBodyJson] : [request url] : " + reqURL);
  console.log("[requestPostBodyJson] : [request method] : " + "POST BODY JSON");
  console.log("");
  
  $.ajax({
      // [요청 시작 부분]
      url: reqURL, //주소
      type: "delete", //전송 타입
      async: true, //비동기 여부
      timeout: 5000, //타임 아웃 설정
      dataType: "JSON", //응답받을 데이터 타입 (XML,JSON,TEXT,HTML,JSONP)    			
      contentType: "application/json; charset=utf-8", //헤더의 Content-Type을 설정
                      
      // [응답 확인 부분 - json 데이터를 받습니다]
      success: function(response) {
          alert("분전함이 삭제되었습니다!")
          reloadFunc()
    
      },
                      
      // [에러 확인 부분]
      error: function(xhr) {
          alert("DB에러")			
      },
                      
      // [완료 확인 부분]
      complete:function(data,textStatus) {
          console.log("");
          console.log("[requestPostBodyJson] : [complete] : " + textStatus);
          console.log("");    				
      }
      });		
  
}





// 최단거리 

function getDistance(lat1, lon1, lat2, lon2) {
  var distance;
  var radius = 6371; // 지구 반지름(km)
  var toRadian = Math.PI / 180;

  var deltaLatitude = Math.abs(lat1 - lat2) * toRadian;
  var deltaLongitude = Math.abs(lon1 - lon2) * toRadian;

  var sinDeltaLat = Math.sin(deltaLatitude / 2);
  var sinDeltaLng = Math.sin(deltaLongitude / 2);
  var squareRoot = Math.sqrt(
        sinDeltaLat * sinDeltaLat +
        Math.cos(lat1 * toRadian) * Math.cos(lat2 * toRadian) * sinDeltaLng * sinDeltaLng);

    distance = 2 * radius * Math.asin(squareRoot);

    return distance;
}


function reloadFunc(){

  location.reload();
}

function reloadFunc2(){
  setTimeout(() => {
    location.reload();
  }, 100);
  
}


setInterval(reloadFunc, 1000 * 60 * 15)



//
$(document).ready(function(){
  //Show contextmenu:
  $(document).contextmenu(function(e){
    //Get window size:
    var winWidth = $(document).width();
    var winHeight = $(document).height();
    //Get pointer position:
    var posX = e.pageX;
    var posY = e.pageY;
    //Get contextmenu size:
    var menuWidth = $(".contextmenu").width();
    var menuHeight = $(".contextmenu").height();
    //Security margin:
    var secMargin = 10;
    //Prevent page overflow:
    if(posX + menuWidth + secMargin >= winWidth
    && posY + menuHeight + secMargin >= winHeight){
      //Case 1: right-bottom overflow:
      posLeft = posX - menuWidth - secMargin + "px";
      posTop = posY - menuHeight - secMargin + "px";
    }
    else if(posX + menuWidth + secMargin >= winWidth){
      //Case 2: right overflow:
      posLeft = posX - menuWidth - secMargin + "px";
      posTop = posY + secMargin + "px";
    }
    else if(posY + menuHeight + secMargin >= winHeight){
      //Case 3: bottom overflow:
      posLeft = posX + secMargin + "px";
      posTop = posY - menuHeight - secMargin + "px";
    }
    else {
      //Case 4: default values:
      posLeft = posX + secMargin + "px";
      posTop = posY + secMargin + "px";
    };
    //Display contextmenu:
    $(".contextmenu").css({
      "left": posLeft,
      "top": posTop
    }).show();
    //Prevent browser default contextmenu.
    return false;
  });
  //Hide contextmenu:
  $(document).click(function(){
    $(".contextmenu").hide();
  });
});


function changeColor(){
	$('#led_row').mouseover(function(){
	   $(this).addClass('changeColor');
	}).mouseout(function() {
	   $(this).removeClass('changeColor');
	});
}








async function showEditPopup(id,name,modem_number,addr,dong,lat,lon,memo,station_id,stationName) { 
    
    
  
  var _width = '650';
  var _height = '380';

  // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
  var _left = Math.ceil(( window.screen.width - _width )/2);
  var _top = Math.ceil(( window.screen.height - _height )/2); 
    


    openWin = window.open('../popup/editPopup.html', 'a', 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top );

    setTimeout(function()  {
      openWin.document.getElementById('new_id').value=id;
      openWin.document.getElementById('new_name').value=name;
      openWin.document.getElementById('new_mdNum').value=modem_number;
      openWin.document.getElementById('new_addr').value=addr;
      openWin.document.getElementById('new_dong').value=dong;
      openWin.document.getElementById('new_lat').value=lat;
      openWin.document.getElementById('new_lon').value=lon;
      openWin.document.getElementById('memo').value=memo;

  
      selected_list = openWin.document.getElementById('defalut')
      selected_list.value = station_id;
      selected_list.text = stationName + " (id =" +station_id + ")"
     

    },200);
    
}





//브라우저 우클릭 비활성화
window.oncontextmenu = function () {
  return false;
};






function confirmPorm() {
 
      if (confirm("현재 위치에 분전함을 등록하시겠습니까?") == true){    
          showPopup()
         
      }else{   //취소
          
   
          return false;
     
      }
     
  }









  async function showPopup() { 
    
    
  
    var _width = '650';
    var _height = '380';
 
    // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2); 
      
      openWin = window.open('../popup/popup.html', 'a', 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top );
    

     
      setTimeout(function()  {
        openWin.document.getElementById('new_lat').value=new_lat
        openWin.document.getElementById('new_lon').value=new_lon
     
  
        // openWin.document.getElementById('defaultID').value=nearStation_id
        selected_list = openWin.document.getElementById('defalut')
        selected_list.value = nearStation_id;
        selected_list.text = nearStation_name + " (id =" +nearStation_id + ")"
       
      }, 200);
     
 
      
  }







function getLedMarkerContent(data) {

  return `
  
  <table>
      <tbody>
          <tr>
              <td class = "category">분전함 id</td>
              <td>${data.custom_id}</td>
          </tr>
           <tr>
              <td class = "category">분전소명</td>
              <td>${data.name}</td>
          </tr>

          <tr>
              <td class = "category">설치일자</td>
              <td>${data.installAt}</td>
          </tr>

          
          <tr>
              <td class = "category">날씨측정일자</td>
              <td>${data.weatherMeasureAt}</td>
          </tr>
          
          <tr>
              <td class = "category">날씨반영일자</td>
              <td>${data.updateAt}</td>
          </tr>


          <tr>
              <td class = "category">기온</td>
              <td>${data.T1H}</td>
          </tr>


          <tr>
              <td class = "category">강수형태</td>
              <td>${data.PTY}</td>
          </tr>


          <tr>
              <td class = "category">1시간 강수량</td>
              <td>${data.RN1}</td>
          </tr>


          <tr>
              <td class = "category">습도</td>
              <td>${data.REH}</td>
          </tr>

          <tr>
              <td class = "category">오존 농도</td>
              <td>${data.o3Value}</td>
          </tr>

          <tr>
              <td class= "category">오존 등급</td>
              <td>${data.o3Grade}</td>
          </tr>

          <tr>
              <td class = "category">미세먼지 농도</td>
              <td>${data.pm10Value}</td>
          </tr>

          <tr>
              <td class = "category">미세먼지 등급</td>
              <td>${data.pm10Grade}</td>
          </tr>
          <tr>
              <td class = "category">초미세먼지 농도</td>
              <td>${data.pm25Value}</td>
          </tr>

          <tr>
              <td class= "category">초미세먼지 등급</td>
              <td>${data.pm25Grade}</td>
          </tr>

          
          <tr>
              <td class = "category">모뎀번호</td>
              <td>${data.modem_number}</td>
          </tr>


          <tr>
              <td class = "category">주소 </td>
             <td>${data.address}</td>
          </tr>

          <tr>
                <td class = "category">메모</td>
                <td>${data.memo}</td>
          </tr>

          <tr>
              <td class = "category">근접측정소 이름</td>
              <td>${data.stationName}</td>
          </tr>
              
          <tr>
              <td class= "category">위도</td>
              <td>${data.lat}</td>
          </tr>

            <tr>
                <td class = "category">경도</td>
                <td>${data.lon}</td>
          </tr>


  
          
      </tbody>
       
     </table>
  `;``
}



  //tab1에 마커 정보 띄우기
  function statistics(ledLen,stationLen) {
    return `
    <table>
    <tbody>
        <tr>
            <td class = "category">분전함 개수</td>
            <td>${ledLen}</td>
        </tr>

        <tr>
           <td class = "category">측정소 개수</td>
            <td>${stationLen}</td>
       </tr>
    

    </tbody>
     
   </table>
      `
  }

  function markerView(data) {
  
    return `
    
    <table>
        <tbody>
            <tr>
                <td class = "category">측정소 id</td>
                <td>${data.station_id}</td>
            </tr>
             <tr>
                <td class = "category">측정소명</td>
                <td>${data.stationName}</td>
            </tr>

            <tr>
                <td class = "category">측정일시</td>
                <td>${data.measureAt}</td>
            </tr>

          <tr>
              <td class = "category">측정반영일시</td>
              <td>${data.updateAt}</td>
          </tr>

            
            <tr>
                <td class = "category">상태</td>
                <td>${data.status}</td>
            </tr>


            <tr>
                <td class = "category">주소 </td>
               <td>${data.addr}</td>
            </tr>

    
            <tr>
                <td class = "category">오존 농도</td>
                <td>${data.o3Value}</td>
            </tr>

            <tr>
                <td class= "category">오존 등급</td>
                <td>${data.o3Grade}</td>
            </tr>

            <tr>
                <td class = "category">미세먼지 농도</td>
                <td>${data.pm10Value}</td>
            </tr>

            <tr>
                <td class = "category">미세먼지 등급</td>
                <td>${data.pm10Grade}</td>
            </tr>
            <tr>
                <td class = "category">초미세먼지 농도</td>
                <td>${data.pm25Value}</td>
            </tr>

            <tr>
                <td class= "category">초미세먼지 등급</td>
                <td>${data.pm25Grade}</td>
            </tr>

            
            <tr>
                <td class= "category">경도</td>
                <td>${data.dmX}</td>
            </tr>

              <tr>
                  <td class = "category">위도</td>
                  <td>${data.dmY}</td>
            </tr>

        </tbody>
         
       </table>
    `;``
  }



  function stationLogView(data) {

  
    for(var i = 0; i < data.length; i++) {

          `   
          <table>
              <tbody>
           <tr>
                <td class = "category">측정소 id</td>
                <td>${data.station_id}</td>
            </tr>
             <tr>
                <td class = "category">측정소명</td>
                <td>${data.stationName}</td>
            </tr>

            <tr>
                <td class = "category">측정일시</td>
                <td>${data.measureAt}</td>
            </tr>

          <tr>
              <td class = "category">측정반영일시</td>
              <td>${data.updateAt}</td>
          </tr>

            
            <tr>
                <td class = "category">상태</td>
                <td>${data.status}</td>
            </tr>


            <tr>
                <td class = "category">주소 </td>
               <td>${data.addr}</td>
            </tr>

    
            <tr>
                <td class = "category">오존 농도</td>
                <td>${data.o3Value}</td>
            </tr>

            <tr>
                <td class= "category">오존 등급</td>
                <td>${date.o3Grade}</td>
            </tr>

            <tr>
                <td class = "category">미세먼지 농도</td>
                <td>${data.pm10Value}</td>
            </tr>

            <tr>
                <td class = "category">미세먼지 등급</td>
                <td>${data.pm10Grade}</td>
            </tr>
            <tr>
                <td class = "category">초미세먼지 농도</td>
                <td>${data.pm25Value}</td>
            </tr>

            <tr>
                <td class= "category">초미세먼지 등급</td>
                <td>${data.pm25Grade}</td>
            </tr>

            
            <tr>
                <td class= "category">경도</td>
                <td>${data.dmX}</td>
            </tr>

              <tr>
                  <td class = "category">위도</td>
                  <td>${data.dmY}</td>
            </tr>
            </tbody>
         
            </table>

          `
          
    }
  }

  function stationLogView(data) {
  
 
    var tr = '';

    for(var i =0; i<data.length; i++) {
    tr += '<tr>';
    tr += '  <td>' + data[i].measuring_log_id + '</td>';
    tr += '  <td>' + data[i].stationName + '</td>';
    tr += '  <td>' + data[i].measureAt + '</td>';
    tr += '  <td>' + data[i].createAt + '</td>';
    tr += '  <td>' + data[i].status + '</td>';
    tr += '  <td>' + data[i].o3Value + '</td>';
    tr += '  <td>' + data[i].o3Grade + '</td>';
    tr += '  <td>' + data[i].pm10Value + '</td>';
    tr += '  <td>' + data[i].pm10Grade + '</td>';
    tr += '  <td>' + data[i].pm25Value + '</td>';
    tr += '  <td>' + data[i].pm25Grade + '</td>';

    tr += '</tr>';
    }

    console.log(data)

    return tr;
          
    
}






function LedLogView(data) {
  
 
  var tr = '';

  for(var i =0; i<data.length; i++) {
  tr += '<tr>';
  tr += '  <td>' + data[i].board_weather_log_id + '</td>';
  tr += '  <td>' + data[i].custom_id + '</td>';
  tr += '  <td>' + data[i].weatherMeasureAt + '</td>';
  tr += '  <td>' + data[i].createAt + '</td>';
  tr += '  <td>' + data[i].T1H + '</td>';
  tr += '  <td>' + data[i].PTY + '</td>';
  tr += '  <td>' + data[i].RN1 + '</td>';
  tr += '  <td>' + data[i].REH + '</td>';
  tr += '</tr>';
  }

  console.log(data)

  return tr;
        
  
}





      


