import { OnInit ,Component, Renderer2 } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FriendListService } from '../../services/friend-list.service';
import { FriendEntity } from '../../newFriend.model';
import { ChangeChatService } from '../../services/change-chat.service';

type friendList = {username: String} & {userUid: String} & {friendUid: String}& {friendStatus: String}& {friendDate: String}

@Component({
  selector: 'app-friend-all',
  templateUrl: './friend-all.component.html',
  styleUrl: './friend-all.component.css'
})

export class FriendAllComponent implements OnInit{
  constructor(private api: ApiService, private friendService: FriendListService, private renderer: Renderer2, private chat: ChangeChatService){
    this.getUserSort()
  }

  friendKeys: String[] = []
  textSearch: string = ""
  userAll: any[] = []
  usernames: string[] = []
  userValues: any[] = []
  friendsObject: any[] = []
  friendsValues: any[] = []
  users: any[] = []
  uidUser: String[] = []
  listPending: friendList[] = []
  listRefuse: friendList[] = []
  listAccept: friendList[] = []

  stateFriend: number = 0
  friendListShow: boolean = false
  username: any = []
  user: any = []
  addStatus: string = ''
  toggleAdd: boolean = false
  toggleList: boolean = false

  friendEntity: FriendEntity = {
    userUid: '',
    friendUid: '',
    friendStatus: '',
    friendDate: ''
  };

  ngOnInit(): void {
    this.invitedFriend()
  }

  searchFriend(){
    const searchBar = document.querySelector(".searchBar") as HTMLElement
    const buttonAdd = document.querySelector(".buttonAdd") as HTMLElement
    const friendItem = document.querySelector(".friend_Item")  as HTMLElement

    if(!this.toggleAdd){
      buttonAdd.textContent = 'Enviar pedido de amizade'
      buttonAdd.style.width = "max-content"
      buttonAdd.style.padding = "8px"
      searchBar.style.transform = "translateX(0)"
    }

    else{
      buttonAdd.textContent = 'Adicionar amigos'
      buttonAdd.style.width = '139px'
      buttonAdd.style.padding = "12px"
      searchBar.style.transform = "translateX(280px)"
      friendItem.style.transform = "translateX(280px)"
      this.textSearch = ""
      this.user = ""
    }
    
   
    this.toggleAdd = !this.toggleAdd
    
    
  }

  getUserSort(){
    this.api.getUserSort().subscribe(
      (data: any[])=>{

        this.userAll = data
        this.usernames = Object.keys(this.userAll)
        let aux: any[] = []
        for(let user of this.usernames){

          aux.push(user.toLocaleLowerCase())
        }
        this.usernames = aux
        this.userValues = Object.values(this.userAll)

        this.userValues.forEach((el)=>{this.uidUser.push(el.userUid)})

        this.getFriendList()
      },

      (err: any)=>{
        console.log("erro ao obter os usuários em FriendAll")
      }
    )
  }

  getFriendList(){
  
    this.friendService.getFriendList().subscribe(
  
      (data: any[])=>{
   
        this.friendsObject = data
        this.friendKeys = Object.keys(this.friendsObject)
        this.friendsValues = Object.values(this.friendsObject)

        this.sortFriendList()
      },
   
      (err: any)=>{
   
        console.log("erro ao receber friendList")
   
      }
    )
  }

  sortFriendList(){

      this.friendsValues.forEach((el)=>{
        let friend: friendList = {
          username: '',
          userUid: '',
          friendUid: '',
          friendDate: '',
          friendStatus: ''
        };

        let pos;

        if(!el.friendUid.includes(localStorage.getItem('Auth'))){

          pos = this.uidUser.indexOf(el.friendUid)
           // {username: String} & {userUid: String} & {friendUid: String}& {friendStatus: String}& {friendDate: String}

          }

        else{

          pos = this.uidUser.indexOf(el.userUid)
        
        }
    
        if(el.friendStatus.includes('pending')){

          friend.username = this.userValues[pos].userUsername
          friend.userUid = el.userUid   
          friend.friendUid = el.friendUid
          friend.friendStatus = "pending"
          friend.friendDate = el.friendDate

          this.listPending.push(friend)
         // {username: String} & {userUid: String} & {friendUid: String}& {friendStatus: String}& {friendDate: String}

        }

        else if(el.friendStatus.includes('accepted')){
          
          friend.username = this.userValues[pos].userUsername
          friend.userUid = el.userUid   
          friend.friendUid = el.friendUid
          friend.friendStatus = "accepted"
          friend.friendDate = el.friendDate
          this.listAccept.push(friend)
          

        }

        else if(el.friendStatus.includes('refused')){

          friend.username = this.userValues[pos].userUsername
          friend.userUid = el.userUid   
          friend.friendUid = el.friendUid
          friend.friendStatus = "refused"
          friend.friendDate = el.friendDate

          this.listRefuse.push(friend)
        }

      })

      this.friendService.setKeyValue(this.listAccept)
  }

  
  invitedFriend(){
    this.friendService.invitedFriend().subscribe(
      (data: FriendEntity)=>{

        this.friendKeys.push(data.userUid)
        this.friendsValues.push(data)

        let friend: friendList = {
          username: '',
          userUid: '',
          friendUid: '',
          friendDate: '',
          friendStatus: ''
        };

       const user: any = this.api.getByUser(data.userUid).subscribe()
      
       friend.username = user.userUsername
       friend.userUid = data.userUid
       friend.friendUid = `${localStorage.getItem('Auth')}`
       friend.friendDate = data.friendDate
       friend.friendStatus = data.friendStatus

       this.listPending.push(friend)
       this.friendKeys.push(friend.userUid)
       this.friendsValues.push(data)

        new Notification("Pedido de amizade recebido de: "+ data.userUid , { icon: "https://cdn-icons-png.flaticon.com/512/456/456212.png" })

      }
    )
  }
 
  userSearch(){
 
    let word = this.textSearch.toLocaleLowerCase()
    console.log(word)
    if(word != ""){
      
      const friendItem = document.querySelector(".friend_Item")  as HTMLElement
      if(this.usernames.includes(word) && localStorage.getItem('Username') != word){
    
        const index = this.usernames.indexOf(word)
    
        this.user = this.userValues[index]
  
        const indexFriend = this.friendKeys.indexOf(this.user.userUid)
  
       friendItem.style.transform = "translateX(0px)"
       
        if(this.friendsValues[indexFriend] && (this.friendsValues[indexFriend].friendStatus == "accepted" || this.friendsValues[indexFriend].friendStatus == "pending")){
          
          this.addStatus = "added"
          return;
        }
  
        else if(this.friendsValues[0] && this.friendsValues[0].friendStatus == "refused"){
  
            this.textSearch = ""
          return;
        }
       this.addStatus = "newFriend"
  
      }
      else{
      
        alert("usuário não encontrado")

      }


    }
    

  }

  addNewFriend(){
    const dateString: any = new Date().toLocaleDateString()
    const dateHours: any = new Date().toLocaleTimeString()
     
    const year = `${dateString[6]}${dateString[7]}${dateString[8]}${dateString[9]}`
    const month =  `${dateString[3]}${dateString[4]}`
    const day = `${dateString[0]}${dateString[1]}`
  
    let format: string = `${year}-${month}-${day}`
     
    const dateFormat: string = `${format}T${dateHours}`
   
    this.friendEntity.userUid = `${localStorage.getItem('Auth')}`
    this.friendEntity.friendUid = this.user.userUid
    this.friendEntity.friendStatus = "pending"
    this.friendEntity.friendDate = dateFormat

    
    this.friendService.putNewFriend(this.friendEntity).subscribe()

  }

  manageRequest(friend:friendList, option: String){
    
    let newFriend: FriendEntity ={
      userUid: '',
      friendUid: '',
      friendStatus: '',
      friendDate: ''
    }

    const dateString: any = new Date().toLocaleDateString()
    const dateHours: any = new Date().toLocaleTimeString()
     
    const year = `${dateString[6]}${dateString[7]}${dateString[8]}${dateString[9]}`
    const month =  `${dateString[3]}${dateString[4]}`
    const day = `${dateString[0]}${dateString[1]}`
  
    let format: string = `${year}-${month}-${day}`
     
    const dateFormat: string = `${format}T${dateHours}`

    newFriend.userUid = friend.userUid
    newFriend.friendUid = friend.friendUid

    newFriend.friendDate = dateFormat

    if(option == "accept"){

      console.log(newFriend.userUid +"user")
      console.log(newFriend.friendUid +"friend")

      newFriend.friendStatus = "accepted"
      this.friendService.changeRequest(newFriend).subscribe()

      let aux: friendList[]
    
      aux = this.listPending.filter((el)=>{
          
        return el != friend
  
      })

      this.listPending = [...aux]

      friend.friendStatus = "accepted"
      friend.friendDate = dateFormat
      this.listAccept.unshift(friend)

    }

    else if(option == "refuse"){

      newFriend.friendStatus = "refused"
      this.friendService.changeRequest(newFriend)

      let aux: friendList[]
    
      aux = this.listPending.filter((el)=>{
          
        return el != friend
  
      })

      this.listPending = [...aux]

      friend.friendStatus = "refused"
      friend.friendDate = dateFormat
      this.listRefuse.unshift(friend)


    }
    //
    let pos = -1

    if(friend.userUid != localStorage.getItem('Auth')){

      pos = this.friendKeys.indexOf(friend.userUid)

    }

    else if(friend.friendUid != localStorage.getItem('Auth')){
      pos = this.friendKeys.indexOf(friend.friendUid)
    }

    this.friendsValues[pos].friendStatus = friend.friendStatus
    this.friendsValues[pos].friendDate = friend.friendDate


    this.friendService.setKeyValue(this.listAccept)
  
  }

  showFriendList(){
    const searchFriend = document.querySelector(".search_Friend") as HTMLElement
    const friendItem = document.querySelector(".friend_Item") as HTMLElement
    const friendList = document.querySelector(".friend_List") as HTMLElement
    const button = friendList.querySelector('button') as HTMLElement
    const buttonsCategories = document.querySelector(".buttons_Categories") as HTMLElement
    
    if(!this.toggleList){

      searchFriend.style.transform = "translateX(300px)"
      if(friendItem)
      friendItem.style.transform = "translateX(300px)"
      
    
      setTimeout(() => {
        friendList.style.top = "20px"
      }, 100);
      
      setTimeout(() => {
        buttonsCategories.style.right = "-230px"
      }, 300);
     
      button.innerText = "Fechar lista de amigos"


    }

    else if(this.toggleList){
     
     friendList.style.top = "55%"

     setTimeout(() => {
      searchFriend.style.transform = "translateX(0px)"
      
      if(this.user.userUsername != undefined){
          friendItem.style.transform = "translateX(0px)"
      }

     }, 50);
     setTimeout(() => {
      buttonsCategories.style.right = "-300px"
    }, 100);
   
     button.innerText = "Ver lista de amigos"
    }
    
    this.toggleList = !this.toggleList
    this.friendListShow = !this.friendListShow

  }


  listCategories(option: String){

    //Falta criar um put para mudar o estado de pending para accept no banco
    const listAccept = document.querySelector('.accept') as HTMLElement
    const listRefuse = document.querySelector('.refuse') as HTMLElement
    const listPending = document.querySelector('.pending') as HTMLElement

    const listMargin = document.querySelectorAll('.item_List_All') as NodeListOf<HTMLElement>

    listMargin.forEach((el)=>{
      el.style.display = "none"
    })

    if(option == "accept"){

      listAccept.style.display = 'flex'
      
    }

    else if(option == "pending"){

      listPending.style.display = 'flex'
   
    }

    else if(option == "refuse"){
      listRefuse.style.display = 'flex'
    }
    
  }

  closeFriendBox(){
   this.stateFriend = this.stateFriend + 1
    this.chat.changeFriendList(this.stateFriend);

   
  }
}
