import data from './partners.json';
import {CustomSearchProvider} from './CustomSearchProvider';

const iconColor = '#ef6b03';

/**
 * Функция рендера карты ПВЗ
 */

export const renderMap = (recId) => {
  /**
   * Работа с DOM элементами
   */

  // Элемент в который помещается карта
  const $map = $(`#${recId} .sh-mapMarkers`);

  // Вчсчитываю координаты цента для карты
  const mapCenter = data.reduce(
      (acc, {coords}) => [(acc[0] += coords[0]), (acc[1] += coords[1])],
      [0, 0]
  );
  mapCenter[0] /= data.length;
  mapCenter[1] /= data.length;

  /**
   * Инициализация карты
   */
  ymaps.ready(() => {
    // Объект карты
    const sMap = new ymaps.Map($map[0], {
      center: mapCenter,
      zoom: 4,
      controls: ['zoomControl'],
    });

    // Создаю коллекцию
    const sCollection = new ymaps.GeoObjectCollection()

    // Заполняю коллекцию данными
    for (let i = 0; i < data.length; i++) {
      const point = data[i]
      sCollection.add(new ymaps.Placemark(
          point.coords,
          {
            balloonContentHeader: point.name, // name
            balloonContentBody: `
            <p>
              <b>Телефон:</b>
              ${point.phones.map((p) => `<a href="tel:${p}" target="_blank">${p}</a>`).join(', ')}
            </p>
          `,
            balloonContentFooter: point.address,
            hintContent: point.address,
          }
      ))
    }

    sMap.geoObjects.add(sCollection)

    const mySearchControl = new ymaps.control.SearchControl({
      options: {
        // Заменяем стандартный провайдер данных (геокодер) нашим собственным.
        provider: new CustomSearchProvider(data),
        // Не будем показывать еще одну метку при выборе результата поиска,
        // т.к. метки коллекции myCollection уже добавлены на карту.
        noPlacemark: true,
        resultsPerPage: 5,
      },
    });

    sMap.controls.add(mySearchControl);
  });
};

$(function() {
  renderMap(window.shRecId || 'rec315540300');
});
