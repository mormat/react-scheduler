var elem = document.querySelector('#foo2');

var clone = elem.cloneNode(true);

clone.innerHTML = "cloned event";

document.body.appendChild(clone);

clone.style['position'] = 'absolute';
clone.style['top'] = '503px';

document.body.removeChild(clone);
<div id=​"foo2" class=​"mormat-scheduler-event" style=​"color:​ white;​ background-color:​ rgb(2, 136, 209)​;​ position:​ absolute;​ top:​ 503px;​">​cloned event​</div>​

