    var map, 
    my_mark,
    my_latitude = -15.792254, 
    my_longitude = -58.20996;
    posisionate_in_my_location = true
    zoom_my_location = 13;



    Template.mapa.rendered = function(){

       console.log('map rendered');
       //find_pais_indicador('ARG', 'NY.ADJ.NNTY.KD');
       var ret = Iniciativas.find().fetch();
       initialize(ret);
       //google.maps.event.addDomListener(window, 'load', initialize);
   };


    //Google maps
    function initialize(options) {

        var results = [];
        _.each(options,function(iniciativa){
            if (typeof iniciativa.lat === 'undefined'){
            }else{
                results.push({
                    doc:iniciativa
                });
            }
        })
        
        
        var latlng = new google.maps.LatLng(my_latitude, my_longitude);
        var myOptions = {
            zoom: 3,
            center: latlng,
            mapMaker: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        google.maps.event.addListener(map, 'click', function(e) {
            if (!my_mark) {
                my_mark = new google.maps.Marker({ map: map });
            }
            my_mark.setPosition(e.latLng);
            Session.set('latLng',e.latLng);
        });

        var markerTemplate = _.template([
            '<div class="media">',
                '<a class="pull-left" href="#">',
                    '<img class="media-object" src="http://minamistudios.com/hack/images/persona1.png">',
                '</a>',
                '<div class="media-body">',
                    '<h3><a class="iniciativa" data-id="<%= _id %>" href="#"><%= titulo %></a></h3>',
                    '<div class="media">',
                        '<p class="descSmall"><%= descripcion %></p>',
                        '<span><img src="http://minamistudios.com/hack/images/praise.png"> <span class="small2">123 </span>',
                    '</span></div>',
                '</div>',
            '</div>'].join(''));

        _.each(results, function(model) {
            console.log(model.doc.titulo);
            var latlng_mark = new google.maps.LatLng(model.doc.lat,model.doc.lon);
            var marker = new google.maps.Marker({
                title:model.titulo,
                position: latlng_mark,
                map: map
            });
            marker.info = new google.maps.InfoWindow({
                content:markerTemplate(model.doc)
            })
            google.maps.event.addListener(marker, 'click', function(){
                marker.info.open(map, marker);
            });
        });

        if(posisionate_in_my_location) {
            detect_my_location(); 
        }
    }

    function detect_my_location() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                my_latitude = position.coords.latitude;
                my_longitude = position.coords.longitude;
                var pos = new google.maps.LatLng(my_latitude, my_longitude);
                map.setCenter(pos);
                map.setZoom(zoom_my_location);
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            handleNoGeolocation(false);
        }
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(my_latitude, my_longitude),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }

