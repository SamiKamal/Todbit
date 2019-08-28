import {elements} from './base'
import * as listView from './listView'

export function showCategory(name, id) {
            let markup = `
            <li data-id="${id}" class="nav__projects--item"><a href="#">${name}</a><div class="ThreeColumnsProject">⋮</div></li>
            `
        
            document.querySelector(elements.projectsList).insertAdjacentHTML('afterbegin', markup);
            addCatogryToSlecet(name,id)
        
        
}

function addCatogryToSlecet(name, id) {
    let markup = `
    <option value="${id}">${name}</option>
    `

    let html = `
    <li data-id="${id}" class="move-to__item">${name}</li>
    `

    document.querySelector(elements.addTodoSelect).insertAdjacentHTML('beforeend', markup)
    document.querySelector(elements.movetoList).insertAdjacentHTML('afterbegin', html)
}

export function removeCategoryFromSelect(id) {
    Array.from(document.querySelector(elements.addTodoSelect).children).forEach(el => {
        if (el.value === id){
            el.parentElement.removeChild(el)
        }
    })

    Array.from(document.querySelector(elements.movetoList).children).forEach(el => {
        if (el.dataset.id === id){
            el.parentElement.removeChild(el)
        }
    })


}


export function showRelatedLists(currentCategoryID, Lists) {
    Lists.forEach(el => {
        if (el.categoryID === currentCategoryID){
            listView.showList(el.name,el.completed,el.id,currentCategoryID,el.categoryID,el.comment)
        } else {
            Array.from(document.querySelector(`.list__ul--${el.completed}`).children).forEach(els => {
                if (els.dataset.id === el.id){
                    els.parentElement.removeChild(els)
                }
            })
        }
    })
}

function check(id, showedLists) {
    let notDouble = true
    showedLists.forEach(el => {
        if (id === el.dataset.id){
            notDouble = false
        }
    })
    return notDouble;

}