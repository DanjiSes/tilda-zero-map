/* eslint-disable no-redeclare */
/* eslint-disable no-var */
/* eslint-disable new-cap */

// Провайдер данных для элемента управления ymaps.control.SearchControl.
// Осуществляет поиск геообъектов в по массиву points.
// Реализует интерфейс IGeocodeProvider.
function CustomSearchProvider(points) {
  this.points = points;
}

// Провайдер ищет по полю text стандартным методом String.ptototype.indexOf.
CustomSearchProvider.prototype.geocode = function(request, options) {
  var deferred = new ymaps.vow.defer();
  var geoObjects = new ymaps.GeoObjectCollection();
  // Сколько результатов нужно пропустить.
  var offset = options.skip || 0;
  // Количество возвращаемых результатов.
  var limit = options.results || 20;

  var points = [];
  // Ищем в свойстве text каждого элемента массива.
  for (var i = 0, l = this.points.length; i < l; i++) {
    var point = this.points[i];
    if (
      point.name.toLowerCase().indexOf(request.toLowerCase()) != -1 ||
      point.address.toLowerCase().indexOf(request.toLowerCase()) != -1
    ) {
      points.push(point);
    }
  }
  // При формировании ответа можно учитывать offset и limit.
  points = points.splice(offset, limit);
  // Добавляем точки в результирующую коллекцию.
  for (var i = 0, l = points.length; i < l; i++) {
    var point = points[i];
    var coords = point.coords;
    var text = point.name;

    geoObjects.add(
        new ymaps.Placemark(coords, {
          name: text,
          description: point.address,
          balloonContentBody: '',
          boundedBy: [coords, coords],
        })
    );
  }

  deferred.resolve({
    // Геообъекты поисковой выдачи.
    geoObjects: geoObjects,
    // Метаинформация ответа.
    metaData: {
      geocoder: {
        // Строка обработанного запроса.
        request: request,
        // Количество найденных результатов.
        found: geoObjects.getLength(),
        // Количество возвращенных результатов.
        results: limit,
        // Количество пропущенных результатов.
        skip: offset,
      },
    },
  });

  // Возвращаем объект-обещание.
  return deferred.promise().then((data) => {
    console.log(window.__shMap__?.getZoom())
    return data
  })
};

export {CustomSearchProvider};
