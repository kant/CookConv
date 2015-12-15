angular.module('languages.service', [])
.factory('Languages', function($q, $log, $cordovaSQLite) {
  'use strict';

  // Méthodes publiques
  var getLanguages = function() {

    var q = $q.defer();

    var _languages = [];

    var dbQuery = "SELECT code, label FROM languages ORDER BY label";

    $cordovaSQLite.execute(_db, dbQuery)
    .then(function(res){
      if(res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          _languages.push({ code : res.rows.item(i).code , label : res.rows.item(i).label });
        }

      }
      q.resolve(_languages);
    },
    function (err) {
      alert("Error get types : " + JSON.stringify(err));
    });

    return q.promise;

  };

  var updateCurrentLanguage = function(language) {

    var q = $q.defer();

    var dbQuery = 'UPDATE settings SET current_lang = ?, current_lang_label = (SELECT label FROM languages WHERE code = ?), current_unit_label = (SELECT name_' + language  + ' FROM unit_type WHERE code = (SELECT current_unit FROM settings))';

    $cordovaSQLite.execute(_db, dbQuery, [language, language])
    .then(function() {
      q.resolve();
    },
    function(error) {
      q.reject(error);
    });

    return q.promise;

  };

  var getCurrentLanguage = function() {

    var q = $q.defer();

    var _current = { current_lang : 'fr' };

    var dbQuery = 'SELECT current_lang FROM settings';

    $cordovaSQLite.execute(_db, dbQuery)
    .then(function(res){
      if(res.rows.length > 0) {
          _current.current_lang = res.rows.item(0).current_lang;
      }
      q.resolve(_current);
    },
    function (err) {
      alert("Error get types : " + JSON.stringify(err));
    });

    return q.promise;

  };

  // Public interface
  return {
    getLanguages:getLanguages,
    updateCurrentLanguage:updateCurrentLanguage,
    getCurrentLanguage:getCurrentLanguage,
  };

});
