/*
var Iniciativas = new Meteor.Collection("Iniciativas"),
    indicadores = new Meteor.Collection('indicadores'), 
    countries = new Meteor.Collection('countries'),
    indicadores_latin_america = new Meteor.Collection('indicadores_latin_america');
*/


    Meteor.methods({
        find_pais_indicador: function(paises, cod_indicador) {
            var data_pais_indicador = indicadores_latin_america.find({
                'Country Code': {'$in': paises},    
                'Indicator Code': cod_indicador    
            });
            var data = {};
            data_pais_indicador.forEach(function (indicador) {
                data[indicador['Country Code']] = indicador;
            });
            return data;
        }

    });

