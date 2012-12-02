  Session.set("location","Buenos Aires");
  Session.set("tareas",null);

  Template.iniciativaForm.location = function(){
    return Session.get("location");
  }; 

  // TAREAS
  var tareas = [];
  Template.tareasForm.tareas = function(){
      return Session.get("tareas");
  };

  Template.iniciativas.list = function(){
    return Iniciativas.find();
  }

  Template.iniciativaForm.events({
    'click .agregarTarea' : function(){
        tareas.push({
            nombre:$('#tareaNombre').val(),
            categoria:$('#tareaCategoria').val(),
            estado:0
        });

        Session.set("tareas",tareas);
        if (typeof console !== 'undefined'){
            console.log(tareas);
        }
    },
    'click .guardarIniciativa':function(){
        var res = Iniciativas.insert({
            titulo:$('#iniTitulo').val(),
            descripcion:$('#iniDescripcion').val(),
            categoria:$('#iniCategoria').val(),
            tipo:$('#iniTipo').val(),
            titulo:$('#iniTitulo').val(),
            tareas:Session.get('tareas')
        });
        console.log(res);
    }
  });

    var map;

    Template.map.created = function(){
       //initialize();
       google.maps.event.addDomListener(window, 'load', initialize);
    };

    //Google maps

    /*
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }
    */
    function initialize() {
        console.log('inicializando');

        var results = [
            {lat: -34.584111, long:-58.427194},
            {lat: -34.574642, long:-58.441264},
            {lat: -34.573333, long:-58.441564},
            {lat: -34.574444, long:-58.444564}
        ];
        
        var latlng = new google.maps.LatLng(-15.792254,-58.20996);
        var myOptions = {
            zoom: 3,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        _.each(results, function(model) {
            var latlng_mark = new google.maps.LatLng(model.lat,model.long);
            var marker = new google.maps.Marker({
                position: latlng_mark,
                map: map
            });
        });
        marker = new google.maps.Marker({
            position: latlng,
            map: map
        });

        /*
        var mapOptions = {
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        // Try HTML5 geolocation
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

                var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
                });

                map.setCenter(pos);
            }, function() {
            handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
        */
    }




