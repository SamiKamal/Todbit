import uniqid from 'uniqid'

export default class List{
    constructor(){
        this.lists = []
    }

    addList(name,categoryID){
        const list = {
            name,
            id: uniqid(),
            categoryID,
            completed: 'uncompleted',
            comment: ''
        }
        console.log(this.lists)
        this.lists.push(list)
        let parsedList = JSON.parse(localStorage.getItem('lists'));
        if (parsedList){
            parsedList.push(list)

            localStorage.setItem('lists',JSON.stringify(parsedList))

        } else {
            localStorage.setItem('lists', JSON.stringify(this.lists))
        }
        return this.lists
    }

    removeList(id){
        // const index = this.lists.findIndex(el => el.id === id)
        // this.lists.splice(index, 1)
        const parsedList = JSON.parse(localStorage.getItem('lists'))
        const indexStorage = parsedList.findIndex(el => el.id === id)
        parsedList.splice(indexStorage, 1)
        localStorage.setItem('lists', JSON.stringify(parsedList))
        this.lists = parsedList
        
     }

     
}