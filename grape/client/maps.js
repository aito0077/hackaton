    var map, 
        my_mark,
        my_latitude = -15.792254, 
        my_longitude = -58.20996;
        posisionate_in_my_location = true
        zoom_my_location = 13;



    Template.mapa.rendered = function(){
        console.log('map rendered');

       //find_pais_indicador('ARG', 'NY.ADJ.NNTY.KD');
       initialize();
       //google.maps.event.addDomListener(window, 'load', initialize);
    };


    //Google maps
    function initialize() {

        var results = [
            {lat: -34.584111, long:-58.427194},
            {lat: -34.574642, long:-58.441264},
            {lat: -34.573333, long:-58.441564},
            {lat: -34.574444, long:-58.444564}
        ];
        
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
            console.log(e.latLng);
        });

        _.each(results, function(model) {
            var latlng_mark = new google.maps.LatLng(model.lat,model.long);
            var marker = new google.maps.Marker({
                position: latlng_mark,
                map: map
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
                console.log('Mi latitude: '+my_latitude+' - longitud: '+my_longitude);
                var pos = new google.maps.LatLng(my_latitude, my_longitude);
                map.setCenter(pos);
                map.setZoom(zoom_my_location);
                /*
                var infowindow = new google.maps.InfoWindow({
                    map: map,
                    position: pos,
                    content: 'Estoy aqui.'
                });
                */
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

