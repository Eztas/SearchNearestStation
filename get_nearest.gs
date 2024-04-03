/*
全体のフロー
search_the_nearest_stations_with_this_name関数の引数にて, map画像の有無, 目的地名を取得
↓
get_information_of_address関数にて, 目的地名からGeoCoderで住所, 緯度経度の情報を得る
↓
search_the_nearest_stations_with_this_name関数に戻る
↓
get_text_from_API関数で, 目的地の緯度経度から, 目的地に関する最寄り駅jsonテキストを取得
↓
search_the_nearest_stations_with_this_name関数に戻る
↓
make_station_HTMLtable関数を呼び出す
↓
zoom_For_distance関数を呼び出して, ズーム倍率を決める
↓
get_distance_and_time_or_map関数を呼び出す
↓
距離と徒歩時間を得る
↓
(画像有なら)
(
条件を満たしているなら, getGoogleMap_image_src関数を呼び出す
↓
getGoogleMap_image_src関数にて, getSavedImageID関数を呼び出し, Driveに画像を保存する
↓
getGoogleMap_image_src関数に戻る
)
↓
make_station_HTMLtable関数に戻り, 情報を載せたHTMLテーブルを作成する
↓
search_the_nearest_stations_with_this_name関数に戻り, htmlのscriptに戻る
↓
ウィンドウを閉じればdeleteImages関数でDriveの画像を自動削除
*/

/*
heartrails 2024年3月17日現在、サイト自体は存在するし、APIも使えそう
*/

let UseMap_UseNone; // htmlのラジオボタンにて, MAPあり, MAPなしに関するvalueを受け取る
let Zoom_Scope; // 2地点の距離ではなく, 直線距離により求められたzoom倍率の値

function doGet() { // GASでのHTMLWebページ展開に必要
  return HtmlService.createHtmlOutputFromFile('Search_Nearest_Station');
}

function deleteImages() { // Driveに保存した画像を消す.
  var folderId = "1D4drTVzCZNbyH4ry828jYJYL8MGPAHm4"; // 対象のフォルダIDを指定
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFilesByType(MimeType.PNG); // PNG画像の場合
  while (files.hasNext()) {
    var file = files.next();
    file.setTrashed(true);
  }
}

function get_information_of_address(spot_name){ // Geocoderを使うことで, 場所名から住所情報を得る
  const res = Maps.newGeocoder();
  res.setLanguage('ja');

  const information = res.geocode(spot_name);
  return information;
}

function get_text_from_API(coordinate){ // 住所情報(緯度, 経度)を元に, APIを使って最寄り駅のjsonテキストを取得
  const url = "http://express.heartrails.com/api/json?method=getStations&x=" + coordinate['results'][0]['geometry']['location']['lng'] 
    + "&y=" + coordinate['results'][0]['geometry']['location']['lat'];

  const url_fetched = UrlFetchApp.fetch(url);
  const text = JSON.parse(url_fetched.getContentText());
  return text;
}

function get_distance_and_time_or_map(start_name, end_name){ // 目的地からその最寄り駅までの距離と時間, さらにラジオボタンの値により静的地図画像も得る
  var rootFinder = Maps.newDirectionFinder();
  var directions = rootFinder
    .setOrigin(start_name)
    .setDestination(end_name+"駅")
    .setMode(Maps.DirectionFinder.Mode.WALKING) // 徒歩時間
    .getDirections();

  let distance_time_infomation = directions.routes[0].legs[0].distance.value + "m(" 
      + Math.round(directions.routes[0].legs[0].duration.value / 60) + "分)";

  if(UseMap_UseNone == "map"){ // MAPあり
    let mapImgSrc =  getGoogleMap_image_src(directions.routes[0]);
    return distance_time_infomation + "</a><br>" + mapImgSrc;
  }
  else{ // UseMap_UseNone == "none", 未選択
    return distance_time_infomation + "</a>";
  }
}

function zoom_For_distance(route_liner_distance) { // geometry.distanceじゃなくてAPIで得た直線距離を使って倍率調整
	if      (route_liner_distance <=  150)	return 19;
  else if (route_liner_distance <=  200)	return 18;
	else if (route_liner_distance <=  600)	return 17;
	else if (route_liner_distance <=  950)	return 16;
  else if (route_liner_distance <= 2200)  return 15;
	else						                        return 14;
}

function getGoogleMap_image_src(route){ // ルート情報から静的地図画像を取得する.
  // マップアイテム設定
  let markerSize = Maps.StaticMap.MarkerSize.MID;
  let markerColor = Maps.StaticMap.Color.RED
  let markerLetterCode_Start = 'S'.charCodeAt();
  let markerLetterCode_Goal = 'G'.charCodeAt();
  let map = Maps.newStaticMap().setZoom(Zoom_Scope);
  let leg; 

  leg = route.legs[0]; // スタート地点のマーカー
  map.setMarkerStyle(markerSize, markerColor, String.fromCharCode(markerLetterCode_Start));
  map.addMarker(leg.start_location.lat, leg.start_location.lng);

  leg = route.legs[route.legs.length - 1]; // エンド地点のマーカー
  map.setMarkerStyle(markerSize, markerColor, String.fromCharCode(markerLetterCode_Goal));
  map.addMarker(leg.end_location.lat, leg.end_location.lng);

  map.addPath(route.overview_polyline.points);
  map.setCenter(((leg.end_location.lat+leg.start_location.lat)/2), ((leg.end_location.lng+leg.start_location.lng)/2)); // 地図の中心を2地点の中点に

  let mapImageUrl = getSavedImageID(map.getBlob());

  return "<img src='" + mapImageUrl + "'>";
}

function getSavedImageID(blob){ // Google Driveに引数Blobにある静的地図画像を保存し, またそのURLを取得
  const SaveImageFolderID = "FolderID";
  var folder = DriveApp.getFolderById(SaveImageFolderID);
  var file = folder.createFile(blob);

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  //return "http://drive.google.com/uc?export=view&id=" + file.getId(); // Google Driveの仕様変更で今はこれで画像を表示できない
  return "https://lh3.googleusercontent.com/d/" + file.getId();
}

function make_station_HTMLtable(spot_name_to_start, data){ // 場所名とjsonテキストのデータを用いることで, 最寄り駅のgooglemap一覧テーブルを生成
  let table_of_stations = "<table border='1' style='border-collapse:collapse;'>";
  let moyorieki_num = 0;

  for(moyorieki_num = 0; moyorieki_num < data.response.station.length; moyorieki_num++){
    let link_map = "https://www.google.com/maps/dir/?api=1&origin=" + spot_name_to_start
      + "&destination=" + data.response.station[moyorieki_num].name + "駅&travelmode=walking";
    
    Zoom_Scope = zoom_For_distance(parseInt(data.response.station[moyorieki_num].distance.match(/\d+/)[0])); // 直線距離でズーム倍率設定

    let kyori_jikan_map = get_distance_and_time_or_map(spot_name_to_start, data.response.station[moyorieki_num].name);

    table_of_stations += "<tr>";
    table_of_stations += "<td class='column1'><a href='" + link_map.toString() + "' target='_blank'>"
    + (data.response.station[moyorieki_num].name).toString() 
    + "<br>" + (data.response.station[moyorieki_num].line).toString()
    + "<br>" + kyori_jikan_map
    + "</td>";
    table_of_stations += "</tr>";
  }
  table_of_stations += '</table>';

  return table_of_stations;
}

function search_the_nearest_stations_with_this_name(place_name, map_option) { // htmlのscriptで呼び出され, 最寄り駅検索の結果を載せたHTMLソースを渡す.
  const NO_INPUT = 0; // 調べたい場所名が入力されていないとき
  const NO_ADDRESS = 1; // その場所の住所が見つからない時
  const NO_STATIONS = 2; // 最寄り駅が見つからない時
  UseMap_UseNone = map_option; // map or none, 大域変数に値を代入

  if(!place_name){
    return NO_INPUT;
  }

  const address = get_information_of_address(place_name);
  if(address['results'][0] == null){ 
    return NO_ADDRESS;
  }

  const nearest_stations_data = get_text_from_API(address);
  if (nearest_stations_data.response.station == "") { 
    return NO_STATIONS;
  }

  return make_station_HTMLtable(place_name, nearest_stations_data);
}
