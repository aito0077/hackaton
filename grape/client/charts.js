    //Charts



    Template.charts.rendered = function(){
        console.log('chart rendered');
        if (Meteor.is_client) {

            //Meteor.call('find_pais_indicador', ['ARG', 'BOL', 'BRA'], 'NY.ADJ.DMIN.GN.ZS', function(err,response) {
            //Meteor.call('find_pais_indicador', ['ARG', 'BOL', 'BRA'], 'Reciclado', function(err,response) {
            Meteor.call('find_pais_indicador', [], 'Mercado Comunal', function(err,response) {
                if(err) {
                    Session.set('serverDataResponse', "Error:" + err.reason);
                    return;
                }
                Session.set('paises_indicadores', response.data);
                Session.set('tipo_indicador', response.tipo_indicador);
                Session.set('iniciativas', response.iniciativas);
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
                country_data.push([
                    Date.UTC(periodo, 0, 1),
                    value||0
                ]); 
            });
            country_data.push([
                Date.UTC(2013, 0, 1),
                old_value
            ]); 
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

        posicionar_iniciativas(series, iniciativas);

        render_line_chart(series, options);

    }

    var grafico;

     function render_line_chart(data, options) {
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
                startOnTick: false,
                showFirstLabel: false
            },
            tooltip: {
                enabled: false
            },
            series: data,
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },

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
                    data : [{
                        //x : Date.UTC(iniciativa.year, iniciativa.month, iniciativa.day),
                        x : iniciativa.fecha_creacion,
                        text : iniciativa.titulo 
                    }],
                    onSeries : iniciativa.pais,
                    shape: shape,
                    showInLegend: false,
                    width : 16,
                    events: {
                        click: click_iniciativa_chart
                        //mouseOver: mouseover_iniciativa_chart, 
                        //mouseOut: mouseout_iniciativa_chart
                    },
                    cursor: 'hand',
                    title: '',
                    pointPlacement: 'on'
            };
            series.push(marca_iniciativa);
        });
    }


