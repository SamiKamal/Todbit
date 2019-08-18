import {elements} from './base'

export function showList(name,isCompleted, id,currentCategoryID,categoryID, comment) {
    if (currentCategoryID === categoryID){
        const html = `
        <li data-id="${id}" class="list__item list__item--${isCompleted}"><span>${name}</span><p class="list__item--comment">${comment}</p><div class="threeColumns">⋮</div></li>
        `
    
        document.querySelector(`.list__ul--${isCompleted}`).insertAdjacentHTML('afterbegin', html);
    }

}

export function removeList(id,parent) {
    parent.forEach(el => {
        if (el.dataset.id === id){
            el.parentElement.removeChild(el)
            console.log(el.parentElement)
        }
    });
}


