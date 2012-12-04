    //Charts

    Template.charts.rendered = function(){
        console.log('chart rendered');
        if (Meteor.is_client) {
            Meteor.call('find_pais_indicador', ['ARG', 'BOL', 'BRA'], 'NY.ADJ.DMIN.GN.ZS', function(err,response) {
                if(err) {
                    Session.set('serverDataResponse', "Error:" + err.reason);
                    return;
                }
                console.log('volvio con exito');
                Session.set('paises_indicadores', response);

                try {
                        render_chart();
                } catch(e) {
                    console.log(e);
                }
            });
        }
       //render_chart();
    }

    function fetch_data_pais_indicador() {
        console.dir(data_pais_indicador.find().fetch());
    }


    function render_chart() {
        var collection = Session.get('paises_indicadores');

        var paises_code = _.keys(collection);
        var first_element = collection[_.first(paises_code)];
        var descripcion_indicador = first_element['Indicator Name'];
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
            var country_data = [];
            _.each(periodos, function(periodo) {
                var value = country[periodo] || 0;
                try {
                    value = parseFloat(value);
                } catch(e) {console.log(e);}
                country_data.push([
                    Date.UTC(periodo, 0, 1),
                    value||0
                ]); 
            });
            var serie = {
                //type: 'line',
                name: country['Country Name'],
                //pointInterval: 24 * 3600 * 1000 * 365,
                //pointStart: Date.UTC(2000, 0, 01),
                data: country_data
            }
            series.push(serie);
        });

        var options = {
            indicator_description: descripcion_indicador,
            element_tag: 'chart_div',
            x_title: '',
            y_title: '',
        };

        console.dir(series);

        render_line_chart(series, options);
    }

    function render_line_chart(data, options) {
        chart = new Highcharts.Chart({
            chart: {
                type: 'spline',
                renderTo: options.element_tag,
                zoomType: 'x',
                spacingRight: 20
            },
            title: {
                text: options.indicator_description || ''
            },
            subtitle: {
                text: ''
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
                min: 0.6,
                startOnTick: false,
                showFirstLabel: false
            },
            tooltip: {
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, 'rgba(2,0,0,0)']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 5
                            }
                        }
                    },
                    shadow: true,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    }
                }
            },
    
            series: data
        });
    }

    function _render_chart() {
        var collection = Session.get('paises_indicadores');
        Session.set('paises_indicadores', null);
        console.log('google chart');


        var paises_code = _.keys(collection);
        var paises_name = [];
        _.each(paises_code, function(p_c) {
            paises_name.push(collection[p_c]['Country Name']);
        });

        var first_element = collection[_.first(paises_code)];
        var descripcion_indicador = first_element['Indicator Name'];
        var keys = _.keys(first_element);
        var periodos = [];
        _.each(keys, function(periodo) {
            periodos.push(periodo.toString());
        });
        var records = [];
        _.each(periodos, function(periodo) {
            if(!_.contains([ '_id', 'Country Name', 'Country Code', 'Indicator Name', 'Indicator Code'], periodo)) { 
                var kk = periodo.toString();
                var record = [];
                    record.push(kk);
                    _.each(paises_code, function(pais) {
                        var value = collection[pais][kk] || 0;
                        try {
                            value = parseFloat(value);
                        } catch(e) {console.log(e);}
                        record.push(value||0); 
                    });
                records.push(record);
            }

        });

        var header = _.union(['Periodo'], paises_name);
        
        var pre_data = _.union([header], records);
        var data;
            data  = google.visualization.arrayToDataTable(pre_data);

            var options = {
                title: descripcion_indicador
            };

            var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
            chart.draw(data, options);

    }

 


/*

    var map_indicadores_tareas = {
        Medio Ambiente,Reciclado,Emisiones CO2 per capita,EN.ATM.CO2E.PC
        Medio Ambiente,Huertas,Metano procedente de la actividad agricola,EN.ATM.METH.AG.ZS
        Medio Ambiente,urbana,Problación Urbana porcentaje del total,SP.URB.TOTL.IN.ZS
        Medio Ambiente,transporte,Consumo de gasolina del sector vial per cápita,IS.VEH.PCAR.P3
        Educación,capacitacion,Desempleo,SL.UEM.TOTL.ZS
        Educación,ayuda escolar,Proporción alumnos-maestro nivel primario,SE.PRM.ENRL.TC.ZS
        Educación,Taller,,
        Desarrollo social,Proyecto autogestivos,Tasa de población activa en mujeres,SL.TLF.CACT.FE.ZS
        Desarrollo social,Economia solidaria,Participación en el ingreso del 20% peor remunerado de la población,SI.DST.FRST.20
        Desarrollo social,Cooperativas,Desempleo Varones,SL.UEM.TOTL.MA.ZS
        Desarrollo social,Mercados comunales,indice de producción de alimentos,AG.PRD.FOOD.XD

        Arte y Cultura,Evento,Cantidad de eventos en esta ciudad,/dataset/agenda-cultural
        Arte y Cultura,Exposiciones,Espacios disponibles para exposiciones,http://data.buenosaires.gob.ar/dataset/organizadores-de-exposiciones
        Arte y Cultura,Charlas,Red de bibliotecas públicas,http://data.buenosaires.gob.ar/dataset/catalogo-centralizado-red-bibliotecas-publicas

    };

          Reciclado EN.ATM.CO2E.PC
          Ecologia Urbana SP.URB.TOTL.IN.ZS IS.VEH.PCAR.P3
          Espacio Publico IS.VEH.PCAR.P3
          Reutilizacion EN.ATM.CO2E.PC
          Capacitacion SL.UEM.TOTL.ZS
          Ayuda Escolar SE.PRM.ENRL.TC.ZS
          Taller
          Deporte
          Prevencion
          Evento AG.PRD.FOOD.XD 
          Charla
          Exposicion
          Proyecto Autogestivo
          Economia Solidaria SI.DST.FRST.20
          Cooperativa
          Mercado Comunal
          Festival
          Huerta EN.ATM.METH.AG.ZS
 
 */
