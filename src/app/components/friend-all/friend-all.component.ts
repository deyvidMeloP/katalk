import { OnInit ,Component, Renderer2 } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FriendListService } from '../../services/friend-list.service';
import { FriendEntity } from '../../newFriend.model';

type friendList = {username: String} & {userUid: String} & {friendUid: String}& {friendStatus: String}& {friendDate: String}

@Component({
  selector: 'app-friend-all',
  templateUrl: './friend-all.component.html',
  styleUrl: './friend-all.component.css'
})

export class FriendAllComponent implements OnInit{
  constructor(private api: ApiService, private friendService: FriendListService, private renderer: Renderer2){
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
        this.friendService.setKeyValue(this.friendKeys, this.friendsValues)

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
    
        if(el.friendStatus.includes('pendente')){

          friend.username = this.userValues[pos].userUsername
          friend.userUid = this.userValues[pos].userUid   
          friend.friendUid = this.userValues[pos].friendUid
          friend.friendStatus = "pendente"
          friend.friendDate = el.friendDate

          this.listPending.push(friend)
         // {username: String} & {userUid: String} & {friendUid: String}& {friendStatus: String}& {friendDate: String}

        }

        else if(el.friendStatus.includes('aceitado')){
          
          friend.username = this.userValues[pos].userUsername
          friend.userUid = this.userValues[pos].userUid   
          friend.friendUid = this.userValues[pos].friendUid
          friend.friendStatus = "aceitado"
          friend.friendDate = el.friendDate
          this.listAccept.push(friend)
          

        }

        else if(el.friendStatus.includes('negado')){

          friend.username = this.userValues[pos].userUsername
          friend.userUid = this.userValues[pos].userUid   
          friend.friendUid = this.userValues[pos].friendUid
          friend.friendStatus = "negado"
          friend.friendDate = el.friendDate

          this.listRefuse.push(friend)
        }

      })
  }

  
  invitedFriend(){
    this.friendService.invitedFriend().subscribe(
      (data: FriendEntity)=>{

        this.friendKeys.push(data.userUid)
        this.friendsValues.push(data)
        new Notification("Pedido de amizade recebido de: "+ data.userUid , { icon: "https://cdn-icons-png.flaticon.com/512/456/456212.png" })

      }
    )
  }
 
  userSearch(){
 
    const word = this.textSearch.toLocaleLowerCase()
 
    if(this.usernames.includes(word) && localStorage.getItem('Username') != word){
  
      const index = this.usernames.indexOf(word)
  
      this.user = this.userValues[index]

      const indexFriend = this.friendKeys.indexOf(this.user.userUid)

    
      if(this.friendsValues[indexFriend] && (this.friendsValues[indexFriend].friendStatus == "aceito" || this.friendsValues[indexFriend].friendStatus == "pendente")){
        
        this.addStatus = "added"

        return;
      }

      else if(this.friendsValues[0] && this.friendsValues[0].friendStatus == "negado"){


        return;
      }
     this.addStatus = "newFriend"
      
      


    }
    else{
    
      alert("usuário não encontrado")
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
    this.friendEntity.friendStatus = "pendente"
    this.friendEntity.friendDate = dateFormat

    
    this.friendService.putNewFriend(this.friendEntity).subscribe()

  }

  getFriends(){

  }

  showFriendList(){
    const searchFriend = document.querySelector(".search_Friend") as HTMLElement
    const friendItem = document.querySelector(".friend_Item") as HTMLElement
    const friendList = document.querySelector(".friend_List") as HTMLElement
    if(!this.toggleList){

      searchFriend.style.transform = "translateX(300px)"
      if(friendItem)
      friendItem.style.transform = "translateX(300px)"
  
      setTimeout(() => {
        friendList.style.top = "20px"
      }, 100);
    }

    else if(this.toggleList){
     
     friendList.style.top = "55%"

     setTimeout(() => {
      searchFriend.style.transform = "translateX(0px)"
      if(friendItem)
      friendItem.style.transform = "translateX(0px)"
     }, 50);

    }
    
    this.toggleList = !this.toggleList
    this.friendListShow = !this.friendListShow

  }
}
