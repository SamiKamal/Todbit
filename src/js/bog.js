document.getElementById('nav-toggle').addEventListener('click', (e) => {
    document.getElementById('nav-toggle').classList.toggle('active');

    toggleNav();
})

function toggleNav() {
    if (document.querySelector('body').classList.contains('show-nav')){
        document.querySelector('body').classList.remove('show-nav')
        document.querySelector('nav').classList.remove('pull-nav')
        // document.querySelector('nav').style.display = 'none'
        
    
} else {
    document.querySelector('body').classList.add('show-nav')
    // document.querySelector('nav').classList.add('pull-nav')
    // document.querySelector('nav').style.display = 'block'

}
}