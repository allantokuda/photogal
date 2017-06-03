
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
  //get('fullViewImage').src = window.imageName;

  get('container').style.backgroundImage = "url('" + window.imageName + "')"
}


window.onhashchange = function() {
  window.imageName = window.location.hash.substring(1);
  render()
}

