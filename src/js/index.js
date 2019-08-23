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
// let listStorage = localStorage.getItem('lists') || localStorage.setItem('list','');
// let categoryStorage = localStorage.getItem('categories') || localStorage.setItem('category','');
state.category.categories = JSON.parse(localStorage.getItem('categories')) || []
state.lists.lists = JSON.parse(localStorage.getItem('lists')) || []

let currentCategory = 'main';
let parent, parentProject



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
document.querySelector(elements.moreList).addEventListener('click', moreClicked)
document.querySelector(elements.moveto).addEventListener('click', moveListTo)
document.querySelector(elements.searchInput).addEventListener('keyup', searchLists)
document.addEventListener('click', showMoreProjects)
document.querySelector(elements.moreProject).addEventListener('click', deleteProject)

// LocalStorage
if (localStorage.getItem('categories')){
    JSON.parse(localStorage.getItem('categories')).forEach(el => {
        categoryView.showCategory(el.name,el.id)
    })
    
}

if (localStorage.getItem('lists')){
    JSON.parse().forEach(el => {
        listView.showList(el.name,el.completed,el.id,currentCategory,el.categoryID,el.comment)
    })
    
}










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
    console.log(localStorage.getItem('categories'))
}

function showAddTodoMenu(e) { 
    if (document.activeElement === document.querySelector('.nav__projects--add-item-input') || document.activeElement === document.querySelector(elements.searchInput) || document.activeElement === document.querySelector(elements.moreAddCommentInput)) return
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
    if (e.target.closest('.nav__projects--item--active') || e.target.classList.contains('nav__projects--add-item-input') || e.target.closest(elements.addProjectItem) || e.target.classList.contains('nav__projects--list') || e.target.closest(`.nav__projects--list div`)) {
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

        // Local storage
        let parsedList = JSON.parse(localStorage.getItem('lists'))
        parsedList.forEach(el => {
            if (el.id === e.target.parentNode.dataset.id){
                el.completed = el.completed==='completed' ? 'uncompleted' : 'completed'
                localStorage.setItem('lists',JSON.stringify(parsedList))
                
            }
        })

    }
}

function showMore(e) {
    // Show more section
    if (e.target.textContent == '⋮' && e.target === e.target.closest('.threeColumns')){
        document.querySelector(elements.moreList).style.display = 'block';
        document.querySelector(elements.moreList).style.top = `${e.clientY}px`
        document.querySelector(elements.moreList).style.left = `${e.clientX - document.querySelector(elements.moreList).offsetWidth - 5}px`
         parent = e.target.parentElement
        return parent;
    } else if (e.target.closest(elements.moreList)) {
        return
    } else {
        // display none all
        document.querySelector(elements.moreList).style.display = 'none'
        document.querySelector('.more__comment--box').style.display = 'none'
        document.querySelector(elements.moveto).style.display = 'none'
    }


}

function moreClicked(e) {
    let id;
    if (e.target === e.target.closest(elements.moreDeleteTask)){
        id = parent.dataset.id;
        state.lists.removeList(id)
        parent.parentElement.removeChild(parent)
        document.querySelector(elements.moreList).style.display = 'none';  
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
        // Set the comment property on the localStorage
        let parsedList = JSON.parse(localStorage.getItem('lists'))
        parsedList.forEach(el => {
            if (el.id === parent.dataset.id){
                el.comment = document.querySelector(elements.moreAddCommentInput).value
                localStorage.setItem('lists',JSON.stringify(parsedList))
            }

        })
        document.querySelector(elements.moreAddCommentInput).value = ''
        document.querySelector(elements.moreList).style.display = 'none';  

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
        // Local storage
        let parsedList = JSON.parse(localStorage.getItem('lists'))
        parsedList.forEach(el => {
            if (el.id === parent.dataset.id){
                el.categoryID = categoryID
                localStorage.setItem('lists',JSON.stringify(parsedList))
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

function showMoreProjects(e) {
        // Show more section
        if (e.target.textContent == '⋮' && e.target === e.target.closest('div') && e.target.closest('.ThreeColumnsProject')){
            
            document.querySelector(elements.moreProject).style.display = 'block';
            document.querySelector(elements.moreProject).style.top = `${e.clientY}px`
            document.querySelector(elements.moreProject).style.left = `${e.clientX - document.querySelector(elements.moreProject).offsetWidth - 5}px`
            parentProject = e.target.parentElement
            return parentProject;
        } else if (e.target.closest(elements.moreProject)) {
            return
        } else {
            // display none all
            document.querySelector(elements.moreProject).style.display = 'none'
        }
    
}

function deleteProject(e) {
    // check if clicked on delete project
    if (e.target.closest('.more__list--deleteTask--Project')){
        // store the id
        const id = parentProject.dataset.id;
        
        // loop over the lists and delete it
        state.lists.lists.forEach(el => {
            console.log(el)
            if (el.categoryID === id){
                state.lists.removeList(el.id)
                // // delete it from both completed lists and uncompleted lists
                listView.removeList(el.id,Array.from(document.querySelector(elements.parentListUncompleted).children))
                listView.removeList(el.id,Array.from(document.querySelector(elements.parentListCompleted).children))
                
            }
        })
        // console.log(state.lists.lists)
        // loop over the categories and delete it
        state.category.categories.forEach(el => {
            if (el.id === id ){
                if (parentProject.classList.contains('nav__projects--item--active')){
                    document.querySelector('.nav__projects--item--main').classList.add('nav__projects--item--active')
                    currentCategory = 'main'
                    categoryView.showRelatedLists(currentCategory,state.lists.lists)
            
                } 
                state.category.removeCategory(el.id)
            }
        })
        // remove the project from the UI
        parentProject.parentElement.removeChild(parentProject)
        // set the current project to Personal
        // set the active link on Personal
        // if (document.querySelector('.nav__projects--item--main').classList.contains('nav__projects--item--active')){
        //     document.querySelector('.nav__projects--item--main').classList.remove('nav__projects--item--active')
        // } else {
        //     document.querySelector('.nav__projects--item--main').classList.add('nav__projects--item--active')
        // }
        // remove the category from Move to and Selecet
        categoryView.removeCategoryFromSelect(id)
        // Hide the more section
        document.querySelector(elements.moreProject).style.display = 'none'

    }
}