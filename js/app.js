import { getDatabase, ref, set, onValue, remove, get, child, update as fb_update } from "./firebase.js"

const CheckList = {
    created(){
        let last = localStorage.getItem('CheckListLastList')
        this.choice = last != undefined ? last : ''
        let storage = JSON.parse(localStorage.getItem('CheckListAppLists'))
        if(storage){
            storage.lists.forEach(list => {
                this.cachedCods.push(list)             
            })
           
        }else{
            storage = {lists: [], last: this.choice}
            localStorage.setItem('CheckListAppLists', JSON.stringify(storage))
        }

        const db = getDatabase();
        
        onValue(ref(db, 'lists/' + this.choice), (snapshot) => {
            this.setList()
            
        })

    },
    data() {
        return {
            newItem: '',
            trashItem: [],
            trashList: [],
            lists: [
                {
                    cod: 'dleoldfolf',
                    title: 'Lista de compras',
                    itens: [
                        {
                            title: 'Pão de forma',
                            checked: false
                        }
                    ]
                },
                {
                    cod: 'iikeikk',
                    title: 'outra lista',
                    itens: [
                        {title: 'Pão de forma', checked: false },
                        {title: 'Café', checked: false},
                        {title: 'Leite desnatado', checked: false}
                    ]
                }                
            ],
            cachedCods: [],
            choice: '',
            atual: {cod: '', title: '', itens: []},
            empty: {cod: '', title: '', itens: []}

        }
    },
    methods: {
        clearCache(){
            localStorage.removeItem('CheckListAppLists')
            this.cachedCods = []
        },
        createNew(){
            const utils = new Utils()
            const list = {cod: utils.nameGenerate(4, false)}
            list.title = 'clique aqui para editar o assunto da lista'
            this.choice = list.cod
            this.atual = list
            this.atual.itens = []
            this.update()
            
            let storage = JSON.parse(localStorage.getItem('CheckListAppLists'))
            if(!storage){
                storage = {lists: [list.cod]}
            }else{
                storage.lists.push(list.cod)
            }
            localStorage.setItem('CheckListAppLists', JSON.stringify(storage))
            
        },
        
        createItem(){
            if(this.newItem.trim() != '' && this.atual.title != ''){
                this.atual.itens.push({title: this.newItem.trim(), checked: false})
                this.newItem = ''
                this.update()
            }
        },
        update(){
            const db = getDatabase()
            const updates = {}
            updates["/lists/" + this.atual.cod] = this.atual
            fb_update(ref(db), updates);
        },
        setList(){            
            
            localStorage.setItem('CheckListLastList', this.choice)
            const dbRef = ref(getDatabase())
            if(!this.choice){
                return
            }
            
            get(child(dbRef, `lists/${this.choice.toLowerCase().trim()}`)).then((snapshot) => {
              if (snapshot.exists()) {
                this.atual = snapshot.val()
                if(this.atual.itens == undefined){
                    this.atual.itens = []
                }

                let storage = JSON.parse(localStorage.getItem('CheckListAppLists'))
                if(storage){
                    if(storage.lists.find(cod=> cod == this.choice) == undefined){
                        storage.lists.push(this.choice)                        
                        localStorage.setItem('CheckListAppLists', JSON.stringify(storage))
                    }
                }

              } else {
                this.atual = this.empty
              }
            }).catch((error) => {
              console.error(error);
            });

        },
        toggle(item){
            item.checked = !item.checked
            this.update()
        },
        removeItem(item){
            
            let i = this.atual.itens.findIndex(it => it.title == item.title)
            if(i != -1){
                this.trashItem.push(this.atual.itens[i])
                this.atual.itens.splice(i, 1)
                this.update()
            }

        },
        removeList(){
            this.choice = this.choice.trim()
            if(this.choice == ''){
                return
            }
            this.trashList.push(this.atual)
            const db = getDatabase()
            remove(ref(db, 'lists/' + this.choice))
            this.atual = this.empty
            this.choice = ''

        },
        undoItem(){
            if(this.trashItem.length > 0) {
                this.atual.itens.push(this.trashItem.pop())
                this.update()
            }
        },
        undoList(){
            if(this.trashList.length > 0) {
                this.atual.itens.push(this.trashList.pop())
                this.update()
            }
        }
    }
}

Vue.createApp(CheckList).mount('#app')