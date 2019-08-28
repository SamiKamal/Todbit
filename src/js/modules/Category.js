import uniqid from 'uniqid'

export default class Category{
    constructor(){
        this.categories = [];
    }

    addCategory(name,databaseRef,userId){
        let category = {
            id: uniqid(),
            name
        }

        this.categories.push(category)
        let parsedList = JSON.parse(localStorage.getItem('categories'));
        if (parsedList){
            parsedList.push(category)

            localStorage.setItem('categories',JSON.stringify(parsedList))

        } else {
            localStorage.setItem('categories', JSON.stringify(this.categories))
        }

        if (userId) {
            databaseRef.set(JSON.parse(localStorage.getItem('categories')))
        }

        return category;
    }


    removeCategory(id,databaseRef,userId){
        let index = this.categories.findIndex(el => el.id === id)
        let parsedList = JSON.parse(localStorage.getItem('categories'))
        let indexStorage = parsedList.findIndex(el => el.id === id)
        parsedList.splice(indexStorage, 1)
        localStorage.setItem('categories', JSON.stringify(parsedList))
        
        this.categories.splice(index, 1)
        console.log(indexStorage)

        if (userId) {
            databaseRef.set(JSON.parse(localStorage.getItem('categories')))
        }

     }
}