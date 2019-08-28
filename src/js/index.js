import Category from './modules/Category'
import List from './modules/List'

import * as fd from './bog'
import * as fa from './fittext'

import {elements} from './views/base'

import *  as categoryView from './views/categoryView';
import * as listView from './views/listView'

function setCookie(c_name,value,exdays){var exdate=new Date();exdate.setDate(exdate.getDate() + exdays);var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());document.cookie=c_name + "=" + c_value;}
function getCookie(c_name){var c_value = document.cookie;var c_start = c_value.indexOf(" " + c_name + "=");if (c_start == -1){c_start = c_value.indexOf(c_name + "=");}if (c_start == -1){c_value = null;}else{c_start = c_value.indexOf("=", c_start) + 1;var c_end = c_value.indexOf(";", c_start);if (c_end == -1){c_end = c_value.length;}c_value = unescape(c_value.substring(c_start,c_end));}return c_value;}
function delCookie(name){document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';}

// CHECK IF USER FIRST TIME
if (!getCookie('firsttime')){
    //Runs the code because the cookie doesn't exist and it's the user's first time
    document.querySelector('.sign-in').style.display = 'block'
    document.querySelector('body').style.overflow = 'hidden'
    //Set's the cookie to true so there is a value and the code shouldn't run again.
    setCookie('firsttime',true);
}


let addProjectInput = document.querySelector(elements.addProjectItemInput);
let results;
let objectArr,userId,currentCategory;
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
var firebaseui = require('firebaseui');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "",
    messagingSenderId: "messagingSenderId",
    appId: "appId"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Authentication
let database = firebase.database();
console.log(firebase)

async function callGoogleSignIn(e) {
    if (e.target.closest('.google-button')){
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            localStorage.setItem('userName',user.displayName)
            localStorage.setItem('user',JSON.stringify(user))
            // ...
            writeUserData(user.uid,user.displayName)
            document.querySelector('.sign-in').style.display = 'none'
            document.querySelector('body').style.overflow = 'initial'
            document.querySelector('.google-button__nav').style.display = 'none'
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(errorCode)
        });
    
    }
}
document.addEventListener('click', callGoogleSignIn)

// set nav heading to user's name
chaneHeadingNav(localStorage.getItem('userName'))
// Check if there is user
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      localStorage.setItem('user',JSON.stringify(user))
      userId = user.uid
      // Show sign-out button
      document.querySelector('.sign-out__link').style.display = 'block'
      // change heading
      chaneHeadingNav(user.displayName)
        //   assign the lists and categories to database
            database.ref('users/' + user.uid + '/main').on('value', (el) => {
                if (el.exists()){
                    objectArr = el.val()
                    console.log(objectArr)
                    let listsFire = objectArr.lists || false
                    let categoriesFire = objectArr.categories || false

                    localStorage.setItem('lists', JSON.stringify(listsFire))
                    localStorage.setItem('categories', JSON.stringify(categoriesFire))

    
                } else if (localStorage.getItem('list') || localStorage.getItem('categories')){
                    assignListsAndCategoriesToUser(user.uid)
                }

                
                showIteamsFromLocalStorage()

          })
      
        // save the curernt category
          document.querySelectorAll('.nav__projects--item').forEach(el => {
            if (el.classList.contains('nav__projects--item--active')){
                el.classList.remove('nav__projects--item--active')
            }
        })
        document.querySelector(`[data-id="${localStorage.getItem('currentCategory')}"]`).classList.add('nav__projects--item--active')
        
      // check if the name length of the user name taller than 9 char
    if (user.displayName.length > 8){
          window.fitText(document.querySelector(elements.navHeadingPrimary), 0.6)
    }



    } else {
      // No user is signed in.
      localStorage.removeItem('user')
      userId = null
      state.category.categories = JSON.parse(localStorage.getItem('categories')) || []
      state.lists.lists = JSON.parse(localStorage.getItem('lists')) || []
      chaneHeadingNav('Guest')
      console.log('THERE IS NO USER')
              // save the curernt category
              document.querySelectorAll('.nav__projects--item').forEach(el => {
                if (el.classList.contains('nav__projects--item--active')){
                    el.classList.remove('nav__projects--item--active')
                }
            })
            document.querySelector(`[data-id="${localStorage.getItem('currentCategory')}"]`).classList.add('nav__projects--item--active')
    
    // Sign in button
    document.querySelector('.google-button__nav').style.display = 'block'
    // show lists & projects
    showIteamsFromLocalStorage()

    }

  });
  // Category
let state = {
    category: new Category(),
    lists: new List()
}
if (!localStorage.getItem('currentCategory')){
     currentCategory = 'main';
    localStorage.setItem("currentCategory", currentCategory)
} else {
     currentCategory = localStorage.getItem('currentCategory')
}
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
document.querySelector('.sign-in').addEventListener('click', userFirstTime)
document.querySelector('.sign-out__link').addEventListener('click',userSignOut)




    




// Functions //

// App Functionality
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
    state.category.addCategory(this.value,database.ref('users/' + userId + '/main/categories'), userId)
    categoryView.showCategory(this.value, state.category.categories[state.category.categories.length-1].id)
    console.log(state)
    this.value = ''
    addProjectInput.style.display = 'none'
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

            state.lists.addList(document.querySelector(elements.addTodoInput).value, document.querySelector(elements.addTodoSelect).value, database.ref('users/' + userId + '/main/lists'), userId)
            listView.showList(document.querySelector(elements.addTodoInput).value, state.lists.lists[state.lists.lists.length - 1].completed, state.lists.lists[state.lists.lists.length - 1].id,localStorage.getItem('currentCategory'), state.lists.lists[state.lists.lists.length - 1].categoryID, state.lists.lists[state.lists.lists.length - 1].comment)
            document.querySelector(elements.addTodoInput).value = ''
            console.log(state.lists)
            document.querySelector(elements.addTodoMenu).style.display = 'none'

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
        localStorage.setItem('currentCategory', currentCategory)
        categoryView.showRelatedLists(localStorage.getItem('currentCategory'), state.lists.lists)
    }
}

function completedList(e) {
    if (e.target.closest('span')){
        state.lists.lists.forEach(el => {
            // console.log('dfdfdff')
            if (el.id === e.target.parentNode.dataset.id){
                el.completed = el.completed==='completed' ? 'uncompleted' : 'completed'
                listView.showList(el.name, el.completed, el.id,localStorage.getItem('currentCategory'), el.categoryID, el.comment)
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

        database.ref('users/' + userId + '/main/lists').set(JSON.parse(localStorage.getItem('lists')))

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
        state.lists.removeList(id,database.ref('users/' + userId + '/main/lists'),userId)
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
        database.ref('users/' + userId + '/main/lists').set(JSON.parse(localStorage.getItem('lists')))
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
        database.ref('users/' + userId + '/main/lists').set(JSON.parse(localStorage.getItem('lists')))
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
            if (el.categoryID === id){
                state.lists.removeList(el.id,database.ref('users/' + userId + '/main/lists'),userId)
                 // delete it from both completed lists and uncompleted lists
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
                    localStorage.setItem('currentCategory', currentCategory)
                    categoryView.showRelatedLists(currentCategory,state.lists.lists)
            
                } 
                state.category.removeCategory(el.id,database.ref('users/' + userId + '/main/categories'), userId)
            }
        })
        // remove the project from the UI
        parentProject.parentElement.removeChild(parentProject)
        // Remove the category from select
        categoryView.removeCategoryFromSelect(id)
        // Hide the more section
        document.querySelector(elements.moreProject).style.display = 'none'

    }
}

function userFirstTime(e) {
    if (e.target.closest('.sign-in__link')){
        document.querySelector('.sign-in').style.display = 'none'
        document.querySelector('body').style.overflow = 'initial'

    }
}

function showIteamsFromLocalStorage() {
    // LocalStorage
    if (localStorage.getItem('categories')){
        if (localStorage.getItem('categories') !== 'false'){
         JSON.parse(localStorage.getItem('categories')).forEach(el => {
             categoryView.showCategory(el.name,el.id)
         })
            state.category.categories = JSON.parse(localStorage.getItem('categories'))
    
      }
    
}

if (localStorage.getItem('lists') !== 'false'){
    JSON.parse(localStorage.getItem('lists')).forEach(el => {
        listView.showList(el.name,el.completed,el.id,localStorage.getItem('currentCategory'),el.categoryID,el.comment)
    })
    state.lists.lists = JSON.parse(localStorage.getItem('lists'))
}


}


// Firebase
function writeUserData(userId, name) {
    firebase.database().ref('users/' + userId).update({
      username: name,
    });


  }

function chaneHeadingNav(name) {
    document.querySelector(elements.navHeadingPrimary).textContent = `Hey ${name}.`
}
  
function assignListsAndCategoriesToUser(userId) {
    let categoriesStorage = localStorage.getItem('categories') || null
    let listsStorage = localStorage.getItem('lists') || null
    let parsedCategory,parsedList
    // check if there a local storage
    if (categoriesStorage) parsedCategory = JSON.parse(categoriesStorage) || null
    if (listsStorage) parsedList = JSON.parse(listsStorage) || null



    if ( (listsStorage || categoriesStorage) ){
        database.ref('users/' + userId + '/main').update({
            lists: parsedList,
            categories: parsedCategory
        })

        
    }
}

function userSignOut(e) {
    firebase.auth().signOut()
    this.style.display = 'none'

    let parentProjects = document.querySelector(elements.projectsList)
    // Remove Lists and categories from both UI and localStorage
    JSON.parse(localStorage.getItem('lists')).forEach(el => {
        if (el.completed == 'completed'){
            listView.removeList(el.id, Array.from(document.querySelector(elements.parentListCompleted).children))
        } else {
            listView.removeList(el.id, Array.from(document.querySelector(elements.parentListUncompleted).children))

        }
    })

    JSON.parse(localStorage.getItem('categories')).forEach(el => {
        
        Array.from(parentProjects.children).forEach(els => {
            if (els.dataset.id == el.id){
                parentProjects.removeChild(els)
            }
        })
    })
    
    localStorage.removeItem('lists')
    localStorage.removeItem('categories')
    localStorage.setItem('currentCategory', 'main')
    currentCategory = localStorage.getItem('currentCategory')


}