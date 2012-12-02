    /*
        indicadores_collection = 'indicadores', 
        countries_collection = 'countries',
        bm_data_collection = 'indicadores_latin_america';
    */

    function find_pais_indicador(codigo_pais, codigo_indicador) {
        var data_pais_indicador = countries_collection.find();
        /*
        DataIndicador = new Meteor.Collection(bm_data_collection);
        console.log('codigo_pais: '+codigo_pais+' - indicador: '+codigo_indicador);
        var data_pais_indicador = DataIndicador.find({
            'Country Code': codigo_pais
        }).fetch();
        console.dir(data_pais_indicador.docs());
        */
        var count = 0;

        console.log('Cantidad: '+data_pais_indicador.count());
        console.dir(data_pais_indicador);
        data_pais_indicador.forEach(function (indicador) {
            console.dir(indicador);
            //console.log("Pais" + indicador.+ ": " + post.title);
            count += 1;
        });
    }
