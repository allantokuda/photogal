
function get(domClass) {
  return document.getElementsByClassName(domClass)[0]
}

function show(domClass) {
  get(domClass).style.display = 'block';
}
function hide(domClass) {
  get(domClass).style.display = 'none';
}

function render() {
  if (window.imageName) {
    show('fullView');
    hide('thumbView');
  } else {
    hide('fullView');
    show('thumbView');
  }

  get('prevImageLink').href = "#" + prevImage();
  get('nextImageLink').href = "#" + nextImage();

  get('container').style.backgroundImage = "url('" + window.imageName + "')"
}

function imageList() {
  var thumbLinkElements = document.getElementsByClassName('thumbLink');
  return Array.prototype.map.call(thumbLinkElements, function(a) {
    return a.hash.substring(1);
  });
}

function prevImage() {
  var list = imageList();
  var i = list.indexOf(window.imageName);
  return list[(i - 1 + list.length) % list.length];
}

function nextImage() {
  var list = imageList();
  var i = list.indexOf(window.imageName);
  return list[(i + 1) % list.length];
}


window.onhashchange = function() {
  window.imageName = window.location.hash.substring(1);
  render()
}

