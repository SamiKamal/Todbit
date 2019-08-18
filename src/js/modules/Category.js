import uniqid from 'uniqid'

export default class Category{
    constructor(){
        this.categories = [];
    }

    addCategory(name){
        let category = {
            id: uniqid(),
            name
        }

        this.categories.push(category)
        return category;
    }


    removeCategory(id){
        let index = this.categories.findIndex(el => el.id === id)

        this.categories.splice(index, 1)
     }
}