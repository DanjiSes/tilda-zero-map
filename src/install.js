/* eslint-disable no-var */

$(function() {
  var hash = '[hash]'
  var devMode = window.location.hostname.split('.').reverse()[0] === 'ws'

  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = devMode ? 'http://savchenko.sl:3000/bundle.js' : 'https://danjises.github.io/slider-konstatntin-tilda/dist/bundle.' + hash + '.js'

  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = devMode ? 'http://savchenko.sl:3000/bundle.css' : 'https://danjises.github.io/slider-konstatntin-tilda/dist/bundle.' + hash + '.css'

  $('body').append([script, link])
})
