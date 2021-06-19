import data from './partners.json'
import {CustomSearchProvider} from './CustomSearchProvider';

const iconColor = '#ef6b03'

/**
 * Функция рендера карты ПВЗ
 */

export const renderMap = (recId) => {
  /**
   * Работа с DOM элементами
   */

  // Элемент в который помещается карта
  const $map = $(`#${recId} .sh-mapMarkers`)

  const mapCenter = data.reduce((acc, {coords}) => [acc[0]+=coords[0], acc[1]+=coords[1]], [0, 0])
  mapCenter[0] /= data.length
  mapCenter[1] /= data.length

  ymaps.ready(() => {
    // Указывается идентификатор HTML-элемента.
    const _map = new ymaps.Map($map[0], {
      center: mapCenter,
      zoom: 4,
      controls: ['zoomControl'],
    })


    const objectManager = new ymaps.ObjectManager({
      // Чтобы метки начали кластеризоваться, выставляем опцию.
      clusterize: true,
      // ObjectManager принимает те же опции, что и кластеризатор.
      gridSize: 32,
      // geoObjectOpenBalloonOnClick: false,
      clusterOpenBalloonOnClick: false,
      // clusterDisableClickZoom: true,
    })

    objectManager.objects.options.set('preset', 'islands#orangeDotIcon')
    objectManager.clusters.options.set('preset', 'islands#orangeClusterIcons')
    objectManager.objects.options.set('iconColor', iconColor)
    objectManager.clusters.options.set('iconColor', iconColor)

    _map.geoObjects.add(objectManager)

    objectManager.add({
      type: 'FeatureCollection',
      features: data.map((i, idx) => ({
        'type': 'Feature',
        'id': idx.toString(),
        'geometry': {'type': 'Point', 'coordinates': i.coords}, // coords
        'properties': {
          'balloonContentHeader': i.name, // name
          'balloonContentBody': `
            <p>
              <b>Телефон:</b>
              ${i.phones.map((p) => `<a href="tel:${p}" target="_blank">${p}</a>`).join(', ')}
            </p>
          `,
          'balloonContentFooter': i.address,
          'hintContent': i.address,
        },
      })),
    })

    // _map.container.fitToViewport()

    const mySearchControl = new ymaps.control.SearchControl({
      options: {
        // Заменяем стандартный провайдер данных (геокодер) нашим собственным.
        provider: new CustomSearchProvider(data),
        // Не будем показывать еще одну метку при выборе результата поиска,
        // т.к. метки коллекции myCollection уже добавлены на карту.
        noPlacemark: true,
        resultsPerPage: 5,
      }});

    _map.controls.add(mySearchControl);
  })
}

$(function() {
  renderMap(window.shRecId || 'rec315540300')
})

