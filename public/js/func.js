console.log( creatElem({i: 'Dilovar Mizrobov', a: [[,'d']]}) );

// o - object
// el - element
// elt - element text
// elf - element fragment
// a - attribute
// i - innerHTML
// ch - child
// d - data
// el -  event listener
function creatElem(o) {
  var el;
  if (o.el) el = document.createElement(o.el);
  else if (o.elt) el = document.createTextNode(o.elt);
  else if (o.elf) el = document.createDocumentFragment(o.elf);
  else if (o.o) el = o.o;
  else el = document.createElement('div');

  if (o.i) el.innerHTML = o.i;

  if ( Array.isArray(o.ch) )
    for (var i = 0; i < o.ch.length; i++) el.appendChild(o.ch[i]);
  else if(o.ch) el.appendChild(o.ch);

  if (o.a) for (var i = 0; i < o.a.length; i++) el.setAttribute(o.a[i][0] || 'class' , o.a[i][1] || '');

  if (o.d) el.data = o.d;

  return el;
};
