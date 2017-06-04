PADDING = 5 // pixel padding between images
PAGE_MARGIN = 8; // pixel margin of webpage

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

window.onkeydown = function(keyboardEvent) {
  switch (keyboardEvent.key) {
    case 'Escape':
      window.location.hash = '#';
      break;

    case 'ArrowLeft':
    case 'ArrowUp':
    case 'k':
      window.location.hash = '#' + prevImage();
      break;

    case 'ArrowRight':
    case 'ArrowDown':
    case 'j':
    case ' ': // spacebar
      window.location.hash = '#' + nextImage();
      break;
  }
}

window.onresize = function() {
  stretchThumbnails();
}

window.onload = function() {
  stretchThumbnails();
}

function stretchThumbnails() {
  var thumbs = document.getElementsByClassName('thumbnail');

  // Reset heights first
  Array.prototype.forEach.call(thumbs, function(thumb) {
    thumb.height = 200;
  });

  // Group by vertical row
  var groups = {};
  var groupSizes = {};
  Array.prototype.forEach.call(thumbs, function(thumb) {
    var rect = thumb.getBoundingClientRect();
    var topPosition = rect.top;
    groups[topPosition] = groups[topPosition] || []
    groups[topPosition].push(thumb);
    groupSizes[topPosition] = (groupSizes[topPosition] || 0) + rect.width;
    console.log(rect.width);
  });

  // Calculate ideal height for each group so they fill the page width
  var groupHeights = {};
  Object.keys(groupSizes).forEach(function(topPosition) {
    var naturalWidth = groupSizes[topPosition];
    if (naturalWidth > 0) {
      var numImagesInRow = groups[topPosition].length;
      var scale = (window.innerWidth - PAGE_MARGIN * 2 - PADDING * numImagesInRow) / naturalWidth;
      console.log(topPosition, numImagesInRow, naturalWidth, scale, 200*scale);
      groupHeights[topPosition] = 200 * scale * 0.98;
    }
  });

  Object.keys(groups).forEach(function(topPosition) {
    groups[topPosition].forEach(function(thumb) {
      thumb.height = groupHeights[topPosition];
    });
  });
}
