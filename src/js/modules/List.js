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
        this.lists.push(list)
        return this.lists
    }

    removeList(id){
        let index = this.lists.findIndex(el => el.id === id)

        this.lists.splice(index, 1)
     }

     
}