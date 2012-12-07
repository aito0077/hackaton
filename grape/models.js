var Iniciativas = new Meteor.Collection("Iniciativas");
var Participantes = new Meteor.Collection("Participantes");
var indicadores = new Meteor.Collection('indicadores'), 
    countries = new Meteor.Collection('countries'),
    indicadores_latin_america = new Meteor.Collection('indicadores_latin_america');

Iniciativas.allow({
	insert: function (userId, doc) {
    	// the user must be logged in, and the document must be owned by the user
    	return false;
    },
    update: function (userId, docs, fields, modifier) {
	    // can only change your own documents
	    return _.all(docs, function(doc) {
	    	return doc.creador === userId;
	    });
	},
	remove: function (userId, docs) {
	    // can only remove your own documents
	    return _.all(docs, function(doc) {
	    	return doc.creador === userId;
	    });
	}//,
	//fetch: ['owner']
});


if (Meteor.isServer) {
    Meteor.publish("Iniciativas", function () {
          return Iniciativas.find();
    });
}

Meteor.methods({
	crearIniciativa: function (options) {
		options = options || {};
		/*
		    var Iniciativa = {
      titulo:$('#iniTitulo').val(),
      descripcion:$('#iniDescripcion').val(),
      categoria:$('#iniCategoria').val(),
      tipo:$('#iniTipo').val(),
      titulo:$('#iniTitulo').val(),
      tareas:Session.get('tareas')
    };
    */
		if(! (
			typeof options.titulo === "string" && options.titulo.length 
			&& typeof options.descripcion === "string" && options.descripcion.length
			&& typeof options.categoria === "string" && options.categoria.length
			&& typeof options.tipo === "string" && options.tipo.length
		)){
			throw new Meteor.Error(400,'Falta un dato');
		}
	    if (Meteor.userId() === null){
	      mostrarMensaje('Debes ingresar al sitio para participar :)', 'error');
	      return;
	    }
	    options.creador = Meteor.userId();
	    options.fecha_creacion = Date.now();
   		return Iniciativas.insert(options);
   	},

	generarIniciativa: function (options) {
   		return Iniciativas.insert(options);
   	},

    //find_pais_indicador: function(paises, cod_indicador) {
    find_pais_indicador: function(paises, tipo) {
        if(!paises.length) {
            paises = ['PER', 'BOL', 'COL', 'BRA', 'CHL', 'ARG'];
        }
        console.log(tipo);

        var tipo_indicador = find_indicador_por_tipo(tipo);
        var iniciativas_paises_tipo = Iniciativas.find({
            'pais': 'ARG',
            'tipo': tipo
        });
        var iniciativas_data = [];
        iniciativas_paises_tipo.forEach(function (iniciativa) {
            iniciativas_data.push(
                iniciativa
            );
        });
        console.dir(iniciativas_data);
 
        var data_pais_indicador = indicadores_latin_america.find({
            'Country Code': {'$in': paises},    
            'Indicator Code': tipo_indicador.indicador
        });

        var data = {};
        data_pais_indicador.forEach(function (indicador) {
            data[indicador['Country Code']] = indicador;
        });

        return {
            data: data,
            iniciativas: iniciativas_data,
            tipo_indicador: tipo_indicador
        };
    },

    traer_iniciativas_categoria_pais: function(paises, tipo) {
        console.log(tipo);

        var iniciativas_paises_tipo = Iniciativas.find({
            'Country Code': {'$in': paises},    
            'Indicator Code': cod_indicador    
        });
        var data = {};
        iniciativas_paises_tipo.forEach(function (iniciativa) {
            data[inciativa['pais']] = iniciativa;
        });
        return data;
    },

    obtener_pais_desde_localizacion: function (latitud, longitud) {
        this.unblock();
        var result = Meteor.http.call(
            "GET",
            'http://maps.googleapis.com/maps/api/geocode/json',
            {params: {
                latlng: ''+latitud+','+longitud+'',
                sensor: true
            }}); 
            console.dir(result);
            var pais = 'Argentina',
                provincia = '',
                localidad = '',
                status = 200;
            if (result.statusCode === 200) {
                var found = false;
                _.each(result.data.results, function(geo_data) {
                    if(_.contains(geo_data.types, 'administrative_area_level_2')) {
                        _.each(geo_data.address_components, function(component) {
                            if(_.contains(component.types, 'administrative_area_level_2')) {
                                localidad = component.short_name;
                            }
                            if(_.contains(component.types, 'administrative_area_level_1')) {
                                provincia = component.long_name;
                            }
                            if(_.contains(component.types, 'country')) {
                                pais = component.long_name;
                            }
                        });
                        found = true;
                    }
                    if(!found && _.contains(geo_data.types, 'administrative_area_level_1')) {
                        _.each(geo_data.address_components, function(component) {
                            if(_.contains(component.types, 'administrative_area_level_1')) {
                                provincia = component.long_name;
                            }
                            if(_.contains(component.types, 'country')) {
                                provincia = component.long_name;
                            }
                        });
                        found = true;
                    }
                    if(!found && _.contains(geo_data.types, 'country')) {
                        pais = geo_data.formatted_address;
                    }
                });
            } else {
                status = 300;
            }
            return {
                status: status,
                pais: pais,
                provincia: provincia,
                localidad: localidad
            };
    }


});

    function find_indicador_por_tipo(tipo) {
        var tipo_indicador = tipo_indicadores[tipo];
        if(tipo_indicador.indicador == '') {
            var tipo_indicador_alternativo =  _.find(tipo_indicadores, function(alternativo) {
                return (alternativo.categoria == tipo_indicador.categoria);  
            }); 
            tipo_indicador = tipo_indicador_alternativo;
        }
        return tipo_indicador;
    }



    var tipo_indicadores = {
          'Reciclado': {
                indicador: 'EN.ATM.CO2E.PC',
                descripcion: 'Emisiones CO2 per capita',
                categoria: 'Medio Ambiente'
           },
          'Huerta': {
                indicador: '',
                descripcion: 'Metano procedente de la actividad agricola',
                categoria: 'EN.ATM.METH.AG.ZS'
           },
           'Ecologia Urbana': {
                indicador: 'SP.URB.TOTL.IN.ZS',
                descripcion: 'Población Urbana porcentaje del total',
                categoria: 'Medio Ambiente'
           },
          'Espacio Publico': {
                indicador: 'IS.VEH.PCAR.P3',
                descripcion: 'Consumo de gasolina del sector vial per cápita',
                categoria: 'Medio Ambiente'
           },
          'Reutilizacion': {
                indicador: 'EN.ATM.CO2E.PC',
                descripcion: 'Emisiones CO2 per capita',
                categoria: 'Medio Ambiente'
           },
          'Capacitacion': {
                indicador: 'SL.UEM.TOTL.ZS',
                descripcion: 'Desempleo',
                categoria: 'Educacion'
           },
          'Ayuda Escolar': {
                indicador: 'SE.PRM.ENRL.TC.ZS',
                descripcion: 'Proporción alumnos-maestro nivel primario',
                categoria: 'Educacion'
           },
          'Taller': {
                indicador: 'SL.UEM.TOTL.ZS',
                descripcion: 'Desempleo',
                categoria: 'Educacion'
           },
          'Deporte': {
                indicador: '',
                descripcion: '',
                categoria: 'Educacion'
           },
          'Prevencion': {
                indicador: '',
                descripcion: '',
                categoria: 'Educacion'
           },
          'Evento': {
                indicador: '',
                descripcion: '',
                categoria: 'Arte y Cultura'
           },
          'Charla': {
                indicador: '',
                descripcion: '',
                categoria: 'Educacion'
           },
          'Exposicion': {
                indicador: '',
                descripcion: '',
                categoria: 'Educacion'
           },
          'Proyecto Autogestivo': {
                indicador: 'SL.TLF.CACT.FE.ZS',
                descripcion: 'Tasa de población activa en mujeres',
                categoria: 'Desarrollo Social'
           },
          'Economia Solidaria': {
                indicador: 'SI.DST.FRST.20',
                descripcion: 'Participación en el ingreso del 20% peor remunerado de la población',
                categoria: 'Desarrollo Social'
           },
          'Cooperativa': {
                indicador: 'SL.UEM.TOTL.MA.ZS',
                descripcion: 'Desempleo Varones',
                categoria: 'Desarrollo Social'
           },
          'Mercado Comunal': {
                indicador: 'AG.PRD.FOOD.XD',
                descripcion: 'Indice de producción de alimentos',
                categoria: 'Desarrollo Social'
           },
          'Festival': {
                indicador: '',
                descripcion: '',
                categoria: 'Arte y Cultura'
           }
     };


