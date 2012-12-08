    //Charts



    Template.charts.rendered = function(){
        console.log('chart rendered');
        if (Meteor.is_client) {

            //Meteor.call('find_pais_indicador', ['ARG', 'BOL', 'BRA'], 'Reciclado', function(err,response) {
            Meteor.call('find_pais_indicador', [], 'Ecologia Urbana', function(err,response) {
                if(err) {
                    Session.set('serverDataResponse', "Error:" + err.reason);
                    return;
                }
                Session.set('paises_indicadores', response.data);
                Session.set('tipo_indicador', response.tipo_indicador);
                Session.set('iniciativas', response.iniciativas);
                console.log('volvio llamada find_pais_indicador');
                console.dir(response.iniciativas);
                console.dir(response.tipo_indicador);

                try {
                        render_chart();
                } catch(e) {
                    console.log(e);
                }
            });
        }
    }

    function render_chart() {
        console.log('Render Chart!');
        var collection = Session.get('paises_indicadores');
        var tipo_indicador = Session.get('tipo_indicador');
        var iniciativas = Session.get('iniciativas');
        console.dir(iniciativas);

        var paises_code = _.keys(collection);
        var first_element = collection[_.first(paises_code)];
        //var descripcion_indicador = first_element['Indicator Name'];
        var descripcion_indicador = tipo_indicador.descripcion;
        var keys = _.keys(first_element);
        var periodos = [];
        _.each(keys, function(periodo) {
            if(!_.contains([ '_id', 'Country Name', 'Country Code', 'Indicator Name', 'Indicator Code'], periodo)) { 
                if(parseInt(periodo) >= 2000) {
                    periodos.push(periodo.toString());
                }
            }
        });

        var series = [];
        _.each(collection, function(country) {
            var country_data = [],
                value = 0,
                old_value = 0;
            _.each(periodos, function(periodo) {
                if(periodo > 2010) {
                    old_value = value;
                    value = country[periodo] || old_value;
                } else {
                    value = country[periodo] || 0;
                }
                try {
                    value = parseFloat(value);
                } catch(e) {console.log(e);}
                /*
                country_data.push([
                    Date.UTC(periodo, 0, 1),
                    value||0
                ]); 
                */
                country_data.push({
                    x: Date.UTC(periodo, 0, 1),
                    y: value||0
                }); 
            });
            /*
            country_data.push([
                Date.UTC(2013, 0, 1),
                old_value
            ]); 
            */
            country_data.push({
                x: Date.UTC(2013, 0, 1),
                y: old_value
            }); 
            var serie = {
                    name: country['Country Name'],
                    id: country['Country Code'],
                    data: country_data
                };
            series.push(serie);
       });

        var options = {
            indicator_description: descripcion_indicador,
            categoria: tipo_indicador.categoria,
            element_tag: 'charts_indicador_iniciativas',
            x_title: '',
            y_title: '',
        };

        Session.set('current_categoria', tipo_indicador.categoria);

    
        //posicionar_iniciativas(series, iniciativas);
        agregar_iniciativas(series, iniciativas);
        render_line_chart(series, options);

    }

    var grafico;

     function render_line_chart(data, options) {
        var self = this;

        var icon_image = 'medioAmbiente.png';
        switch(this.Session.get('current_categoria')) {
            case "Medio Ambiente":
                icon_image = 'medioAmbiente.png';
                break; 
            case "Educacion":
                icon_image = 'educacion.png';
                break; 
            case "Desarrollo":
                icon_image = 'desarrolloSocial.png';
                break; 
            case "Arte y Cultura":
                icon_image = 'arteCultura.png';
                break; 
            default: 
                icon_image = 'medioAmbiente.png';
                break; 
        }
        var shape = 'url(/images/'+icon_image+')';
 


        grafico = new Highcharts.StockChart({
            chart: {
                type: 'spline',
                renderTo: options.element_tag,
                zoomType: 'x',
                spacingRight: 20
            },
            legend: {
                enabled: true,
                align: '',
                backgroundColor: '#FFFFFF',
                borderColor: 'white',
                borderWidth: 0,
                layout: 'horizontal',
                verticalAlign: 'bottom',
                shadow: true
            },
            rangeSelector: {
                enabled: false
            },
            title: {
                text: options.indicator_description || ''
            },

            subtitle: {
                text: options.categoria || ''
            },
            xAxis: {
                type: 'datetime',
                maxZoom: 14 * 24 * 3600000, // fourteen days
                maxPadding: 0.10,
                title: {
                    text: options.x_title
                }
            },
            yAxis: {
                title: {
                    text: options.y_title
                },
                gridLineColor: '#FFFFFF',
                min: 0,
                maxPadding: 0.10,
                startOnTick: false,
                showFirstLabel: false
            },

            series: data,
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            /*
            tooltip: {
                crosshairs: false,
                shared: false,
                enabled: true,
                useHTML: true,
                formatter: function(){
                    if(this.series.name == 'iniciativas') {
                        return '<image href="'+shape+'"></image>';
                    }
                    else {
                        return "";
                    }
                }                
            },

            plotOptions: {
                spline: {
                    tooltip: {
                        enabled: false
                    },
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                },
                line: {
                    tooltip: {
                        enabled: false
                    }
                },
                flags: {
                    tooltip: {
                        enabled: true,
                        useHTML: true,
                        formatter: function() {
                            return '<image href="'+shape+'"></image>';
                        }
                    }

                }
            }
            */
        });
    }

    /*
    var iniciativas = [
        {
            year: 2008, 
            month: 6,
            day: 23,
            pais: 'BRA',
        },
        {
            year: 2009, 
            month: 3,
            day: 15,
            pais: 'BOL'
        },
        {
            year: 2009, 
            month: 11,
            day: 15,
            pais: 'ARG'
        }
    ];

    */

    function click_iniciativa_chart(evento) {
        console.log('click');
        console.dir(evento);
    }

    function mouseout_iniciativa_chart(evento) {
        console.log('out');
        console.dir(evento);
    }


    function mouseover_iniciativa_chart(evento) {
        console.log('over');
        console.dir(evento);
    }

    function agregar_iniciativas(series, iniciativas) {
        var icon_image = 'medioAmbiente.png';
        switch(this.Session.get('current_categoria')) {
            case "Medio Ambiente":
                icon_image = 'medioAmbiente.png';
                break; 
            case "Educacion":
                icon_image = 'educacion.png';
                break; 
            case "Desarrollo":
                icon_image = 'desarrolloSocial.png';
                break; 
            case "Arte y Cultura":
                icon_image = 'arteCultura.png';
                break; 
            default: 
                icon_image = 'medioAmbiente.png';
                break; 
        }
        var shape = 'url(/images/'+icon_image+')';
 
        _.each(iniciativas, function(iniciativa) {
            var year = new Date(iniciativa.fecha_creacion).getFullYear();
            var rango_year = Date.UTC(year, 0, 1);
            var y_value = 0;
            var serie_a_agregar = [];
            _.each(series, function(serie) {
               if(serie.id == iniciativa.pais) {
                    serie_a_agregar = serie;
                    _.each(serie.data, function(datum) {
                        if(datum['x'] == rango_year) {
                            y_value =  datum['y'];
                        }
                    });
               } 
            });
            var marca = {
                x: iniciativa.fecha_creacion,
                y: y_value,
                marker: {
                    enabled: true,
                    symbol: shape
                },
                text: iniciativa.titulo
            };
            serie_a_agregar.data.push(marca);
        });
        _.each(series, function(serie) {
            serie.data = _.sortBy(serie.data, function(dato) {
                return dato['x'];
            });
        });


    }


    function posicionar_iniciativas(series, iniciativas) {
        var self = this;

        var icon_image = 'medioAmbiente.png';
        switch(this.Session.get('current_categoria')) {
            case "Medio Ambiente":
                icon_image = 'medioAmbiente.png';
                break; 
            case "Educacion":
                icon_image = 'educacion.png';
                break; 
            case "Desarrollo":
                icon_image = 'desarrolloSocial.png';
                break; 
            case "Arte y Cultura":
                icon_image = 'arteCultura.png';
                break; 
            default: 
                icon_image = 'medioAmbiente.png';
                break; 
        }
        var shape = 'url(/images/'+icon_image+')';
        _.each(iniciativas, function(iniciativa) {
            var marca_iniciativa = {
                    type : 'flags',
                    name: 'iniciativas',
                    data : [{
                        //x : Date.UTC(iniciativa.year, iniciativa.month, iniciativa.day),
                        x : iniciativa.fecha_creacion,
                        text : iniciativa.titulo 
                    }],
                    onSeries : iniciativa.pais,
                    //shape: shape,
                    shape: 'circlepin',
                    showInLegend: false,
                    //width : 16,
                    dataLabels: {
                        useHTML: true,
                        formatter: function() {
                            return '<image href="'+shape+'"></image>';
                        }
                    },
                    events: {
                        click: click_iniciativa_chart
                        //mouseOver: mouseover_iniciativa_chart, 
                        //mouseOut: mouseout_iniciativa_chart
                    },
                    cursor: 'hand',
                    title: 'I'//,
            };
            series.push(marca_iniciativa);
        });
    }


