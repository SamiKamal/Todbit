// let list = {
//     categories: [
//         {
//             id: '324',
//             lists: [
//                 {
//                     id: 'df',
//                     name: 'fix car',
//                     date: '',
//                     comment: '',
//                     completed: false
//                 }
//             ]
//         }
//     ] 
// }

import Category from './modules/Category'
import List from './modules/List'

import * as fd from './bog'

import {elements} from './views/base'

import *  as categoryView from './views/categoryView';
import * as listView from './views/listView'


let addProjectInput = document.querySelector(elements.addProjectItemInput);



// Category
let state = {
    category: new Category(),
    lists: new List()
}
let currentCategory = 'main';
let parent
// state.category.addCategory(document.querySelector('.nav__projects--add-item-input').value)

// console.log(state.category)
// console.log(state.category)

// Events Listners
document.addEventListener('click', openProjectInput)
addProjectInput.addEventListener('change', addProjectItem)
for (event of ['click', 'keypress']){
    document.querySelector(elements.addTodoBox).addEventListener(event, addList)
}
for (event of ['click', 'keypress']){
    document.addEventListener(event,showAddTodoMenu)
}
document.querySelector(elements.projectsList).addEventListener('click',selectedCategory)
document.querySelector(elements.parentList).addEventListener('click', completedList)
document.addEventListener('click', showMore)
document.querySelector(elements.more).addEventListener('click', moreClicked)
document.querySelector(elements.moveto).addEventListener('click', moveListTo)
document.querySelector(elements.searchInput).addEventListener('keyup', searchLists)















// Functions
function openProjectInput(e) {
    e.preventDefault()
    if (e.target.closest(elements.addProjectItem)){
        addProjectInput.style.display = addProjectInput.style.display === 'none' ? 'block' : 'none';
        addProjectInput.focus()
    } else if (e.target !== addProjectInput){
        addProjectInput.style.display = 'none'

    }
}

function addProjectItem() {
    state.category.addCategory(this.value)
    categoryView.showCategory(this.value, state.category.categories[state.category.categories.length-1].id)
    console.log(state)
    this.value = ''
    addProjectInput.style.display = 'none'
}

function showAddTodoMenu(e) { 
    if (e.target.closest(elements.addTodoButton) || e.keyCode === 81 || e.keyCode === 113){
        if (document.querySelector(elements.addTodoMenu).style.display = 'none'){
            document.querySelector(elements.addTodoMenu).style.display = 'block'
            setTimeout(() => {
                document.querySelector(elements.addTodoInput).focus()
                
            }, 100);
        }
    } else if (!e.target.closest(elements.addTodoBox)){
        document.querySelector(elements.addTodoMenu).style.display = 'none'
        document.querySelector(elements.addTodoInput).value = ''
    }
}

function addList(e) {
    if (e.target.closest(elements.addTodoBoxButton) || e.keyCode === 13){
        if (document.querySelector(elements.addTodoInput).value != ''){

            state.lists.addList(document.querySelector(elements.addTodoInput).value, document.querySelector(elements.addTodoSelect).value)
            listView.showList(document.querySelector(elements.addTodoInput).value, state.lists.lists[state.lists.lists.length - 1].completed, state.lists.lists[state.lists.lists.length - 1].id,currentCategory, state.lists.lists[state.lists.lists.length - 1].categoryID, state.lists.lists[state.lists.lists.length - 1].comment)
            document.querySelector(elements.addTodoInput).value = ''
            console.log(state.lists)
            document.querySelector(elements.addTodoMenu).style.display = 'none'
                // categoryView.showRelatedLists(currentCategory, state.lists.lists)

        }

    }
}

function selectedCategory(e) {
    if (e.target.closest('.nav__projects--item--active') || e.target.classList.contains('nav__projects--add-item-input') || e.target.closest(elements.addProjectItem) || e.target.classList.contains('nav__projects--list')) {
        return;
    } else {
        document.querySelectorAll('.nav__projects--item').forEach(el => {
            if (el.classList.contains('nav__projects--item--active')){
                el.classList.remove('nav__projects--item--active')
            }
        })
        e.target.closest('.nav__projects--item').classList.add('nav__projects--item--active')
        currentCategory = e.target.closest('.nav__projects--item').dataset.id
        categoryView.showRelatedLists(currentCategory, state.lists.lists)
    }
}

function completedList(e) {
    if (e.target.closest('span')){
        state.lists.lists.forEach(el => {
            // console.log('dfdfdff')
            if (el.id === e.target.parentNode.dataset.id){
                el.completed = el.completed==='completed' ? 'uncompleted' : 'completed'
                listView.showList(el.name, el.completed, el.id,currentCategory, el.categoryID, el.comment)
                listView.removeList(el.id, Array.from(e.target.parentElement.parentElement.children))
            }
        })
    }
}

function showMore(e) {
    // Show more section
    if (e.target.textContent == '⋮' && e.target === e.target.closest('.threeColumns')){
        document.querySelector(elements.more).style.display = 'block';
        document.querySelector(elements.more).style.top = `${e.clientY}px`
        document.querySelector(elements.more).style.left = `${e.clientX - document.querySelector(elements.more).offsetWidth - 5}px`
         parent = e.target.parentElement
        return parent;
    } else if (e.target.closest(elements.more)) {
        return
    } else {
        // display none all
        document.querySelector(elements.more).style.display = 'none'
        document.querySelector('.more__comment--box').style.display = 'none'
        document.querySelector(elements.moveto).style.display = 'none'
    }


}

function moreClicked(e) {
    let id;
    if (e.target === e.target.closest(elements.moreDeleteTask)){
        id = parent.dataset.id;
        state.lists.lists.forEach(el => {
            if (el.id === id){
                let index = state.lists.lists.indexOf(el)
                state.lists.lists.splice(index,1)
            }
        })   
        parent.parentElement.removeChild(parent)
        document.querySelector(elements.more).style.display = 'none';  
    } else if (e.target === e.target.closest(elements.moreAddComment)){
        this.querySelector('.more__comment--box').style.display = this.querySelector('.more__comment--box').style.display === 'none' ? 'block' : 'none';
        document.querySelector(elements.moreAddCommentInput).focus()
    } else if (e.target === e.target.closest(elements.moreMoveTo)) {
        document.querySelector(elements.moveto).style.display = document.querySelector(elements.moveto).style.display  === 'none' ? 'block' : 'none';
        document.querySelector(elements.moveto).style.top = `${e.y + 25}px`
        document.querySelector(elements.moveto).style.left = `${e.x - 100}px`
    
    }

    if (e.target === e.target.closest(elements.moreAddCommentBtn)){
        parent.querySelector(elements.listComment).textContent = document.querySelector(elements.moreAddCommentInput).value
        // Set the comment property on the lists object
        state.lists.lists.forEach(el => {
            if (el.id === parent.dataset.id){
                el.comment = document.querySelector(elements.moreAddCommentInput).value
            }
        })
        document.querySelector(elements.moreAddCommentInput).value = ''
        document.querySelector(elements.more).style.display = 'none';  

    }

}

function moveListTo(e) {
    if (e.target.closest(elements.movetoItem)){
        let categoryID =  e.target.dataset.id
        // if he want to move it to the same category. return
        if (categoryID === currentCategory) return;

        state.lists.lists.forEach(el => {
            if (el.id === parent.dataset.id){
                el.categoryID = categoryID
                listView.removeList(el.id,Array.from(parent.parentElement.children))
            }
        })
    }

}

function searchLists(e) {
    let filter = this.value.toUpperCase()
    Array.from(document.querySelector(elements.parentListChild).children).forEach(el => {
        let txtValue = el.textContent || el.innerHTML
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            el.style.display = "";
          } else {
            el.style.display = "none";
          }
      
    })
}



