import {elements} from './base'
 
export function showCategory(name, id) {
    let markup = `
    <li data-id="${id}" class="nav__projects--item"><a href="#">${name}</a></li>
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

export function showRelatedLists(currentCategoryID, Lists) {
    Lists.forEach(el => {
        if (el.categoryID === currentCategoryID){
            console.log('AHAAAA')
            const html = `
             <li data-id="${el.id}" class="list__item list__item--${el.completed}"><span>${el.name}</span><p class="list__item--comment">${el.comment}</p><div class="threeColumns">⋮</div></li>
                 `
         document.querySelector(`.list__ul--${el.completed}`).insertAdjacentHTML('afterbegin', html);
        } else {
            console.log('NOOOOOOOOOOOOOO')
            Array.from(document.querySelector(`.list__ul--${el.completed}`).children).forEach(els => {
                if (els.dataset.id === el.id){
                    els.parentElement.removeChild(els)
                }
            })
        }

        console.log(el.categoryID === currentCategoryID && check(el.id,Array.from(document.querySelector(elements.parentListUncompleted).children)))
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