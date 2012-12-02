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
                render_chart();
            });
        }
       //render_chart();
    }

    function fetch_data_pais_indicador() {
        console.dir(data_pais_indicador.find().fetch());
    }

    function render_chart() {
        console.log('google chart');
        google.load('visualization', '1', {'packages':['annotatedtimeline']});
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Sold Pencils');
            data.addColumn('string', 'title1');
            data.addColumn('string', 'text1');
            data.addColumn('number', 'Sold Pens');
            data.addColumn('string', 'title2');
            data.addColumn('string', 'text2');
            data.addRows([
                [new Date(2008, 1 ,1), 30000, undefined, undefined, 40645, undefined, undefined],
                [new Date(2008, 1 ,2), 14045, undefined, undefined, 20374, undefined, undefined],
                [new Date(2008, 1 ,3), 55022, undefined, undefined, 50766, undefined, undefined],
                [new Date(2008, 1 ,4), 75284, undefined, undefined, 14334, 'Out of Stock','Ran out of stock on pens at 4pm'],
                [new Date(2008, 1 ,5), 41476, 'Bought Pens','Bought 200k pens', 66467, undefined, undefined],
                [new Date(2008, 1 ,6), 33322, undefined, undefined, 39463, undefined, undefined]
            ]);

            var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
            chart.draw(data, {displayAnnotations: true});
        }
    }

    function _render_chart() {
        var collection = Session.get('paises_indicadores');
        Session.set('paises_indicadores', null);

        console.log('rendering chart');
        var margin = {top: 20, right: 80, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        console.log('1');

        var x = d3.time.scale().range([0, width]);

        var y = d3.scale.linear().range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

        var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); });

        var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dominio = _.keys(collection);
        console.dir(collection);
        console.dir(dominio);
        color.domain(dominio);
        console.log('A');

        var values_map = {}; 
        var values = []; 
        _.each(dominio, function(model) {
            var re_model = _.omit(collection[model], '_id', 'Country Name', 'Country Code', 'Indicator Name', 'Indicator Code');
            values_map[model] = re_model;
            values.push(re_model);
        });

        
        var paises = _.map(color.domain(), function(name) {
            return {
                name: collection[name]['Country Name'],
                values: _.map(values_map[name], function(d) {
                    var key = _.keys(d)[0];
                    return {
                        period: key, indicador: d[key]
                    };
                })
            };
        });
        console.log('B');

        var sample = _.first(values);

        x_min_max = [
            _.min(_.keys(sample), function(period) {
               return parseInt(period); 
            }), 
            _.max(_.keys(sample), function(period) {
               return parseInt(period); 
            })
        ];
        x.domain(x_min_max);

        console.log('C');
        var max_t = 0;
        var min_t = 999999999;
        _.each(values, function(record) {
            _.each(_.values(record), function(v) {
                if(v > max_t) {
                    max_t = v;
                }
                if(v < min_t) {
                    min_t = v;
                }
            });
        });
        console.log('D');

        y_min_max = [min_t, max_t ];
        y.domain(y_min_max);

        console.dir(x_min_max);
        console.dir(y_min_max);
    

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Indicador");

        var pais = svg.selectAll(".pais")
        .data(paises)
        .enter().append("g")
        .attr("class", "pais");

        pais.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

        pais.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.period) + "," + y(d.value.indicador) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

    }



