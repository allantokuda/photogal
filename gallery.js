PADDING = 5 // pixel padding between images
PAGE_MARGIN = 20; // pixel margin of webpage
SCALE_MIN = 175;
SCALE_MAX = 225;

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

  get('prevImageLink').href = "#" + imageJump(-1);
  get('nextImageLink').href = "#" + imageJump(1);

  // In next event loop, preload nearby images (invisibly) for faster jump
  setTimeout(function() {
    get('preload1').src = imageJump(1);
    get('preload2').src = imageJump(2);
    get('preload3').src = imageJump(-1);
    get('preload4').src = imageJump(-2);
  });

  get('container').style.backgroundImage = "url('" + window.imageName + "')"
}

function imageList() {
  var thumbLinkElements = document.getElementsByClassName('thumbLink');
  return Array.prototype.map.call(thumbLinkElements, function(a) {
    return a.hash.substring(1);
  });
}

function imageJump(steps) {
  var list = imageList();
  var i = list.indexOf(window.imageName);
  return list[(i + steps + list.length) % list.length];
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
      window.location.hash = '#' + imageJump(-1);
      break;

    case 'ArrowRight':
    case 'ArrowDown':
    case 'j':
    case ' ': // spacebar
      window.location.hash = '#' + imageJump(1);
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

  // Reset heights smaller than nominal height first
  Array.prototype.forEach.call(thumbs, function(thumb) {
    thumb.height = SCALE_MIN;
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
      groupHeights[topPosition] = Math.min(SCALE_MIN * scale * 0.98, SCALE_MAX);
    }
  });

  Object.keys(groups).forEach(function(topPosition) {
    groups[topPosition].forEach(function(thumb) {
      thumb.height = groupHeights[topPosition];
    });
  });
}
