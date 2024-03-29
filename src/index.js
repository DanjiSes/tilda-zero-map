import { CustomSearchProvider } from "./CustomSearchProvider";
import defaultData from "./partners.json";

const iconColor = window.sMarkerColor || "#ef6b03";

const data = window.sMapData || defaultData;

/**
 * Функция рендера карты ПВЗ
 */

export const renderMap = (recId) => {
  /**
   * Работа с DOM элементами
   */

  // Элемент в который помещается карта
  const $map = $(`#${recId} .sh-mapMarkers`);
  $map.height($map.parent().height());

  // Вчсчитываю координаты цента для карты
  const mapCenter = data.reduce(
    (acc, { coords }) => [(acc[0] += coords[0]), (acc[1] += coords[1])],
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
      controls: ["zoomControl"],
    });

    window.__shMap__ = sMap;

    // Создаю коллекцию
    const sCollection = new ymaps.GeoObjectCollection();

    // Заполняю коллекцию данными
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      sCollection.add(
        new ymaps.Placemark(
          point.coords,
          {
            balloonContentHeader: point.name,
            balloonContentBody: `
            <p>
              <b>Телефон:</b>
              ${point.phones
                .map((p) => `<a href="tel:${p}" target="_blank">${p}</a>`)
                .join(", ")}
            </p>
          `,
            balloonContentFooter: point.address,
            hintContent: point.address,
          },
          {
            // iconColor: iconColor,
            iconLayout: "default#image",
            iconImageSize: [30, 36],
            iconImageHref:
              "https://danjises.github.io/tilda-map-with-cities/dist/mark.png",
          }
        )
      );
    }

    sMap.geoObjects.add(sCollection);

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

    mySearchControl.events.add("resultshow", () => {
      __shMap__.setZoom(17);
    });

    window.__mySearchControl__ = mySearchControl;

    sMap.controls.add(mySearchControl);
  });

  /**
   * Вешаю обработчик клика на город
   */
  $('[href^="#sh-mapMarkers:"').on("click", function (event) {
    event.preventDefault();

    const city = $(this).attr("href").split(":")[1];
    const markersIncity = data.filter(
      (i) => i.city.toLocaleLowerCase() === city.toLocaleLowerCase()
    );
    const center = markersIncity.reduce(
      (acc, { coords }) => [(acc[0] += coords[0]), (acc[1] += coords[1])],
      [0, 0]
    );
    center[0] /= markersIncity.length;
    center[1] /= markersIncity.length;

    __shMap__.setZoom(10);
    __shMap__.setCenter(center);
  });
};

$(function () {
  renderMap(window.shRecId || "rec315540300");
});

console.log("Tilda Custom Map: Developed by savchenko.dev");
