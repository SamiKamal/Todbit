let addTodoEl = document.querySelector('.add__to-do');
let searchParent = document.querySelector('.search');

document.getElementById('nav-toggle').addEventListener('click', (e) => {
    document.getElementById('nav-toggle').classList.toggle('active');

    toggleNav();
})

for(event of  ['load', 'resize']) {
  window.addEventListener(event, changeAddtodoBtnPlace)
}



function changeAddtodoBtnPlace() {
  if (getWidth() > 583){
    searchParent.insertAdjacentElement("beforeend", addTodoEl)
  } else {
    document.querySelector('body').insertAdjacentElement('beforeend', addTodoEl)
}
// console.log('Width:  ' +  getWidth() );
// console.log('Height: ' + getHeight() );
}

function toggleNav() {
    if (document.querySelector('body').classList.contains('show-nav')){
        document.querySelector('body').classList.remove('show-nav');
        document.querySelector('nav').classList.remove('pull-nav');
        document.querySelector('body').style.overflowY = 'initial'

        // document.querySelector('nav').style.display = 'none'
        
    
} else {
    document.querySelector('body').classList.add('show-nav')
    document.querySelector('body').style.overflowY = 'hidden'

    // document.querySelector('nav').classList.add('pull-nav')
    // document.querySelector('nav').style.display = 'block' 

}
}

function getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  
  function getHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }
  
  