import data from './partners.json'
import ex from './ex.json'

/**
 * Функция рендера карты ПВЗ
 */

export const renderMap = (recId) => {
  /**
   * Работа с DOM элементами
   */

  // Элемент в который помещается карта
  const $map = $(`#${recId} .sh-mapMarkers`)

  ymaps.ready(() => {
    // Указывается идентификатор HTML-элемента.
    const _map = new ymaps.Map($map[0], {
      center: [55.831903, 37.411961],
      zoom: 5,
      controls: ['zoomControl', 'searchControl'],
    }, {
      searchControlProvider: 'yandex#search',
    })

    const objectManager = new ymaps.ObjectManager({
      // Чтобы метки начали кластеризоваться, выставляем опцию.
      clusterize: true,
      // ObjectManager принимает те же опции, что и кластеризатор.
      gridSize: 32,
      // geoObjectOpenBalloonOnClick: false,
      clusterOpenBalloonOnClick: false,
      clusterDisableClickZoom: true,
    })

    objectManager.objects.options.set('preset', 'islands#greenDotIcon')
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons')

    _map.geoObjects.add(objectManager)

    // objectManager.add(ex)

    objectManager.add({
      type: 'FeatureCollection',
      features: data.map((i, idx) => ({
        'type': 'Feature',
        'id': idx.toString(),
        'geometry': {'type': 'Point', 'coordinates': i.coords}, // coors
        'properties': {
          'balloonContentHeader': i.name, // name
          'balloonContentBody': `
            <p>
              <b>Телефон:</b>
              ${i.phones.map((p) => `<a href="tel:${p}" target="_blank">${p}</a>`).join(', ')}
            </p>
          `,
          'balloonContentFooter': 'г.Киров, ул. Блюхера, дом 8а',
          'hintContent': 'г.Киров, ул. Блюхера, дом 8а',
        },
      })),
    })

    // _map.container.fitToViewport()
  })
}

$(function() {
  renderMap(window.shRecId || 'rec315540300')
})

