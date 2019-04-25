// Commas to the price. Add the represented and Status column information below the price.
// Use Dark Green pin for Buyers and Gold for Sellers.
var API_KEY = "AIzaSyCidDwInoB5kG1q7_YJeinEER72BMKsZF0";
var mydata, mybarsdata, myshopsdata, myretailersdata;
var layers=[], gmarkers=[], barsmarkers=[], shopsmarkers=[], retailersmarkers=[];
function csvJSON(csv){
  var lines=csv.split("\n");
  var result = [];

  var headers=lines[0].split(",");
  var price_index = headers.indexOf("Sale Price");
  headers.splice(price_index, 1);
  var description_index = headers.indexOf("Description");
  headers.splice(description_index, 1);
  for(var i=1;i<lines.length;i++){
    
    var obj = {};
    var before_price = lines[i].split('"$')[0];
    var temp = lines[i].split('"$')[1];
    var price = temp.split('","')[0];
    var after_price = temp.split('","')[1];
    var find = ',';
    // var re = new RegExp(find, 'g');
    // price = price.replace(re, '');
    console.log(price);
    if(!after_price)
    {
      after_price = temp.split('",')[1];
      if(!after_price)
        continue;
    }
    // console.log(after_price);
    var description = after_price.split('https:')[0];
    if(description.indexOf('",'))
      description = description.split('",')[0];
    after_price = "https:"+after_price.split('https:')[1];
    obj["price"] = price;
    obj["description"] = description;
    var process_str = before_price + after_price;
    var currentline=process_str.split(","); 

    for(var j=0;j<headers.length;j++){
      obj[headers[j].trim()+"src"] = currentline[j];
    }
    result.push(obj);
  }
  //return result; //JavaScript object
  return (result); //JSON
}
function init_data() {
  $.getJSON("asset/geodata.json", function(json) {
      // console.log(json); // this will show the info it in firebug console
      mydata= json;
      console.log(mydata);
      for(i=0; i<mydata.length; i++) {
        doSomething(map,i);
      }
      // map.setCenter({lat: mydata[0].lat, lng: mydata[0].lng});
      map.setCenter({lat: 34.187175, lng: -120.337598});
      $.getJSON("asset/bars.json", function(json) {
        // console.log(json); // this will show the info it in firebug console
        mybarsdata= json;
        console.log(mybarsdata);
        for(i=0; i<mybarsdata.length; i++) {
          doBars(map,i);
        }
        $.getJSON("asset/shops.json", function(json) {
          // console.log(json); // this will show the info it in firebug console
          myshopsdata= json;
          console.log(myshopsdata);
          for(i=0; i<myshopsdata.length; i++) {
            doShops(map,i);
          } 
          $.getJSON("asset/retailers.json", function(json) {
            // console.log(json); // this will show the info it in firebug console
            myretailersdata= json;
            console.log(myretailersdata);
            for(i=0; i<myretailersdata.length; i++) {
              doRetailers(map,i);
            }
            $(".dobars").hide();
            $(".doshops").hide();
            $(".doretailers").hide();
            for(i=0; i<gmarkers.length; i++) {
              gmarkers[i].setVisible(false);
            }
            $('html, body').animate({
                scrollTop: (0)
            }, 500);
          });
        });
        
      });
    
  });
  
}

function setmaplayer(i) {
  for(j=0; j< layers.length; j++) {
    layers[j].setOptions({'opacity': 0.7});
  }
  layers[i].setOptions({'opacity': 1});
  var scale = Math.pow(2, map.getZoom());
  x_offset = document.getElementById("map").offsetWidth / 4;
  var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(layers[i].getDefaultViewport().getCenter());
  var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

  var worldCoordinateNewCenter = new google.maps.Point(
      worldCoordinateCenter.x - pixelOffset.x,
      worldCoordinateCenter.y + pixelOffset.y
  );

  var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
  var getCenter = layers[i].getDefaultViewport().getCenter();
  map.panTo(getCenter);
}
function setmapmarker(i, str) {
    var markers = [];
    if(str =='bars'){
      markers = barsmarkers;
    }
    if(str =='shops'){
      markers = shopsmarkers;
    }
    if(str =='retailers'){
      markers = retailersmarkers;
    }
    for(j=0; j< gmarkers.length; j++) {
      gmarkers[j].setOptions({'opacity': 0.7});
    }
    markers[i].setOptions({'opacity': 1});
    var scale = Math.pow(2, map.getZoom());
    x_offset = document.getElementById("map").offsetWidth / 4;
    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(markers[i].getPosition());
    var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);var scale = Math.pow(2, map.getZoom());
    x_offset = document.getElementById("map").offsetWidth / 4;
    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(markers[i].getPosition());
    var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
    map.panTo(newCenter);
  
}

function doBars(resultsMap,i) {
  var address = mybarsdata[i].formatted_address;
  // console.log(mydata[i]);
  var temp_content;
  var imagesrc = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+mybarsdata[i].photos[0].photo_reference+"&key="+API_KEY;
  temp_content=`
      <section id="mybarsdata`+i+`" class="dobars c-mapstack__card" data-slug="intro" style="display: block;    box-shadow: inset 0px 0px 10px 0px rgba(0,0,0,.25);" onmouseover="setmapmarker(`+i+`,'bars')">
        <h1 style="font-size: 38px;text-align:center;    border-bottom: 5px solid #e15024;">`+mybarsdata[i].name+`</h1>
        <h2 class="c-entry-summary p-dek" style="text-align:center;">`+address+`</h2>
        <div class="c-mapstack__photo">
            <figure class="e-image">
                <span class="e-image__inner">
                    <span class="e-image__image " data-original="">
                        <picture class="c-picture" data-cid="" data-cdata="">
                            <img src="`+imagesrc+`">
                        </picture>
                    </span>
                </span>

            </figure>
        </div>
    </section>`;

  var content_panel = document.getElementById("content_panel");
  content_panel.innerHTML+=(temp_content);
  // var address = "56 Davis Rd Orinda CA";
  var iconpath = mybarsdata[i].icon.split("icons/")[1];
  var icon = {
      url: "asset/markers/"+iconpath, // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
  };
    var marker = new google.maps.Marker({
      map: resultsMap,
      icon: icon,
      position: {lat: mybarsdata[i].geometry.location.lat, lng: mybarsdata[i].geometry.location.lng}
    });
    

    marker.setOptions({'opacity': 0.7});
    marker.setVisible(false);
    barsmarkers.push(marker);
    gmarkers.push(marker);
    // console.log(mydata[i]);
    marker.addListener('click', function() {
        map.setCenter(this.getPosition());
        var scale = Math.pow(2, map.getZoom());
        x_offset = document.getElementById("map").offsetWidth / 4;
        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(marker.getPosition());
        var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        for(j=0; j< gmarkers.length; j++) {
          gmarkers[j].setOptions({'opacity': 0.7});
        }
        this.setOptions({'opacity': 1});
        map.panTo(newCenter);
        console.log($("#mybarsdata"+i).offset().top-70);
        $('html, body').animate({
              scrollTop: ($("#mybarsdata"+i).offset().top-70)
          }, 500);
    }); 

}
function doShops(resultsMap,i) {
  var address = myshopsdata[i].formatted_address;
  // console.log(mydata[i]);
  var temp_content;
  var imagesrc = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+myshopsdata[i].photos[0].photo_reference+"&key="+API_KEY;
  temp_content=`
      <section id="myshopsdata`+i+`" class="doshops c-mapstack__card" data-slug="intro" style="display: block;    box-shadow: inset 0px 0px 10px 0px rgba(0,0,0,.25);" onmouseover="setmapmarker(`+i+`,'bars')">
        <h1 style="font-size: 38px;text-align:center;    border-bottom: 5px solid #e15024;">`+myshopsdata[i].name+`</h1>
        <h2 class="c-entry-summary p-dek"  style="text-align:center;">`+address+`</h2>
        <div class="c-mapstack__photo">
            <figure class="e-image">
                <span class="e-image__inner">
                    <span class="e-image__image " data-original="">
                        <picture class="c-picture" data-cid="" data-cdata="">
                            <img src="`+imagesrc+`">
                        </picture>
                    </span>
                </span>

            </figure>
        </div>
    </section>`;

  var content_panel = document.getElementById("content_panel");
  content_panel.innerHTML+=(temp_content);
  // var address = "56 Davis Rd Orinda CA";
  var iconpath = myshopsdata[i].icon.split("icons/")[1];
  var icon = {
      url: "asset/markers/"+iconpath, // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
  };
    var marker = new google.maps.Marker({
      map: resultsMap,
      icon: icon,
      position: {lat: myshopsdata[i].geometry.location.lat, lng: myshopsdata[i].geometry.location.lng}
    });
    

    marker.setOptions({'opacity': 0.7});
    marker.setVisible(false);
    shopsmarkers.push(marker);
    gmarkers.push(marker);
    // console.log(mydata[i]);
    marker.addListener('click', function() {
        map.setCenter(this.getPosition());
        var scale = Math.pow(2, map.getZoom());
        x_offset = document.getElementById("map").offsetWidth / 4;
        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(marker.getPosition());
        var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        for(j=0; j< gmarkers.length; j++) {
          gmarkers[j].setOptions({'opacity': 0.7});
        }
        this.setOptions({'opacity': 1});
        map.panTo(newCenter);
        console.log($("#myshopsdata"+i).offset().top-70);
        $('html, body').animate({
              scrollTop: ($("#myshopsdata"+i).offset().top-70)
          }, 500);
    }); 

}
function doRetailers(resultsMap,i) {
  var address = myretailersdata[i].formatted_address;
  // console.log(mydata[i]);
  var temp_content;
  var imagesrc = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+myretailersdata[i].photos[0].photo_reference+"&key="+API_KEY;
  temp_content=`
      <section id="myretailersdata`+i+`" class="doretailers c-mapstack__card" data-slug="intro" style="display: block;    box-shadow: inset 0px 0px 10px 0px rgba(0,0,0,.25);" onmouseover="setmapmarker(`+i+`,'bars')">
        <h1 style="font-size: 38px;text-align:center;    border-bottom: 5px solid #e15024;">`+myretailersdata[i].name+`</h1>
        <h2 class="c-entry-summary p-dek"  style="text-align:center;">`+address+`</h2>
        <div class="c-mapstack__photo">
            <figure class="e-image">
                <span class="e-image__inner">
                    <span class="e-image__image " data-original="">
                        <picture class="c-picture" data-cid="" data-cdata="">
                            <img src="`+imagesrc+`">
                        </picture>
                    </span>
                </span>

            </figure>
        </div>
    </section>`;

  var content_panel = document.getElementById("content_panel");
  content_panel.innerHTML+=(temp_content);
  // var address = "56 Davis Rd Orinda CA";
  var iconpath = myretailersdata[i].icon.split("icons/")[1];
  var icon = {
      url: "asset/markers/"+iconpath, // url
      scaledSize: new google.maps.Size(40, 40), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
  };
    var marker = new google.maps.Marker({
      map: resultsMap,
      icon: icon,
      position: {lat: myretailersdata[i].geometry.location.lat, lng: myretailersdata[i].geometry.location.lng}
    });
    

    marker.setOptions({'opacity': 0.7});
    marker.setVisible(false);
    retailersmarkers.push(marker);
    gmarkers.push(marker);
    // console.log(mydata[i]);
    marker.addListener('click', function() {
        map.setCenter(this.getPosition());
        var scale = Math.pow(2, map.getZoom());
        x_offset = document.getElementById("map").offsetWidth / 4;
        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(marker.getPosition());
        var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        for(j=0; j< gmarkers.length; j++) {
          gmarkers[j].setOptions({'opacity': 0.7});
        }
        this.setOptions({'opacity': 1});
        map.panTo(newCenter);
        console.log($("#myretailersdata"+i).offset().top-70);
        $('html, body').animate({
              scrollTop: ($("#myretailersdata"+i).offset().top-70)
          }, 500);
    }); 

}
function doSomething(resultsMap,i) {
  var address = mydata[i].Addresssrc + ", " + mydata[i].info;
  // console.log(mydata[i]);
  var temp_content;
  if(mydata[i].type !='route') {
    temp_content=`
        <section id="mydata`+i+`"dosomething class="c-mapstack__card" data-slug="intro" style="display: block;    box-shadow: inset 0px 0px 10px 0px rgba(0,0,0,.25);" onmouseover="setmapmarker(`+i+`)">
          <h1 style="font-size: 38px;text-align:center;    border-bottom: 5px solid #e15024;">`+address+`</h1>
          <h2 class="c-entry-summary p-dek" style="text-align:center;">`+mydata[i].title+`</h2>
          <div class="c-mapstack__photo">
              <figure class="e-image">
                  <span class="e-image__inner">
                      <span class="e-image__image " data-original="">
                          <picture class="c-picture" data-cid="" data-cdata="">
                              <img src="`+mydata[i].Imagesrc+`">
                          </picture>
                      </span>
                  </span>
              </figure>
          </div>
          <div class="c-entry-content">
              <p>`+mydata[i].description+`</p>
        </div>
      </section>`;
  } else {
    temp_content=`
      <section id="mydata`+i+`" class="dosomething c-mapstack__card" data-slug="intro" style="display: block;    box-shadow: inset 0px 0px 10px 0px rgba(0,0,0,.25);" onmouseover="setmaplayer(`+i+`)">
        <h1 style="font-size: 38px;text-align:center;    border-bottom: 5px solid #e15024;">`+mydata[i].title+`</h1>
        <div class="c-mapstack__photo">
            <figure class="e-image" style="text-align: center;">
                <span class="e-image__inner" style="">
                    <span class="" data-original="">
                        <picture class="c-picture" data-cid="" data-cdata="">
                            <img src="`+mydata[i].Imagesrc+`">
                        </picture>
                    </span>
                </span>
                <h1 style="display:inline-block;border-bottom: 5px solid #e15024;font-weight: bold;text-align: center;">`+mydata[i].info+`</h1>
            </figure>
        </div>
        <div class="c-entry-content">
            <p>`+mydata[i].description+`</p>
      </div>
    </section>`;
  }
  var content_panel = document.getElementById("content_panel");
  content_panel.innerHTML+=(temp_content);
  // var address = "56 Davis Rd Orinda CA";
  
  if(mydata[i].type =='route') {
    var src  = mydata[i].title.replace(/\s/g, '');
    var kmlLayer = new google.maps.KmlLayer('https://motorcyclemap.000webhostapp.com/asset/geodata/'+src+'.kml', {
      suppressInfoWindows: true,
      preserveViewport: true,
      map: map
    });
    
    // console.log(kmlLayer);
    layers.push(kmlLayer);
    kmlLayer.addListener('click', function(event) {
      // var content = event.featureData.infoWindowHtml;
      // var testimonial = document.getElementById('capture');
      // testimonial.innerHTML = content;
      var getCenter = this.getDefaultViewport().getCenter();
      map.setCenter(getCenter);
      for(j=0; j< layers.length; j++) {
          layers[j].setOptions({'opacity': 0.7});
        }
        this.setOptions({'opacity': 1});
        $('html, body').animate({
            scrollTop: ($("#mydata"+i).offset().top-70)
        }, 500);
    });
  } else {
    var iconpath;
    if(mydata[i].Representedsrc == "Listing Agent")
    {
      iconpath = 'asset/markers/gumber_'+i+".png"
    } else {
      iconpath = 'asset/markers/number_'+i+".png"
    }
    var marker = new google.maps.Marker({
      map: resultsMap,
      icon: iconpath,
      position: {lat: mydata[i].lat, lng: mydata[i].lng}
    });
    

    marker.setOptions({'opacity': 0.7});
    marker.setVisible(false);
    markers.push(marker);
    // console.log(mydata[i]);
    marker.addListener('click', function() {
        map.setCenter(this.getPosition());
        var scale = Math.pow(2, map.getZoom());
        x_offset = document.getElementById("map").offsetWidth / 4;
        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(marker.getPosition());
        var pixelOffset = new google.maps.Point((x_offset/scale) || 0,(0/scale) ||0);

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        for(j=0; j< markers.length; j++) {
          markers[j].setOptions({'opacity': 0.7});
        }
        this.setOptions({'opacity': 1});
        map.panTo(newCenter);
        console.log($("#mydata"+i).offset().top-70);
        $('html, body').animate({
              scrollTop: ($("#mydata"+i).offset().top-70)
          }, 500);
    }); 
  }
    // setTimeout(doSomething(geocoder,resultsMap,i+1), 10000);
}

function onRoutes() {
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li:nth-child(1)").addClass("active");
  $(".doshops").hide();
  $(".doretailers").hide();
  $(".dobars").hide();
  $(".dosomething").show();
  for(i=0; i<gmarkers.length; i++) {
    gmarkers[i].setVisible(false);
  }
  for(i=0; i<layers.length; i++) {
    layers[i].setMap(map);  
  }
  $('html, body').animate({
      scrollTop: (0)
  }, 500);
}

function onBars() {
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li:nth-child(2)").addClass("active");
  $(".doshops").hide();
  $(".doretailers").hide();
  $(".dobars").show();
  $(".dosomething").hide();
  for(i=0; i<gmarkers.length; i++) {
    gmarkers[i].setVisible(false);
  }
  for(i=0; i<layers.length; i++) {
    layers[i].setMap(null);  
  }
  for(i=0; i<barsmarkers.length; i++) {
    barsmarkers[i].setVisible(true);
  }
  $('html, body').animate({
    scrollTop: (0)
 }, 500);
}

function onShops() {
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li:nth-child(3)").addClass("active");
  $(".doshops").show();
  $(".doretailers").hide();
  $(".dobars").hide();
  $(".dosomething").hide();
  for(i=0; i<gmarkers.length; i++) {
    gmarkers[i].setVisible(false);
  }
  for(i=0; i<layers.length; i++) {
    layers[i].setMap(null);  
  }
  for(i=0; i<shopsmarkers.length; i++) {
    shopsmarkers[i].setVisible(true);
  }
  $('html, body').animate({
    scrollTop: (0)
 }, 500);
}

function onRetailers() {
  $(".navbar-nav li").removeClass("active");
  $(".navbar-nav li:nth-child(4)").addClass("active");
  $(".doshops").hide();
  $(".doretailers").show();
  $(".dobars").hide();
  $(".dosomething").hide();
  for(i=0; i<gmarkers.length; i++) {
    gmarkers[i].setVisible(false);
  }
  for(i=0; i<layers.length; i++) {
    layers[i].setMap(null);  
    
  }
  for(i=0; i<retailersmarkers.length; i++) {
    retailersmarkers[i].setVisible(true);
  }
  $('html, body').animate({
    scrollTop: (0)
 }, 500);
}