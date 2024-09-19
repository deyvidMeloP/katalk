import { Component, Renderer2 } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FriendListService } from '../../services/friend-list.service';
import { FriendEntity } from '../../newFriend.model';

@Component({
  selector: 'app-friend-all',
  templateUrl: './friend-all.component.html',
  styleUrl: './friend-all.component.css'
})
export class FriendAllComponent {
  constructor(private api: ApiService, private friendService: FriendListService, private renderer: Renderer2){
    this.getUserSort()
    this.getFriendList()
  }

  friendKeys: string[] = []
  textSearch: string = ""
  userAll: any[] = []
  usernames: string[] = []
  userValues: any[] = []
  friendsObject: any[] = []
  friendsValues: any[] = []
  username: any = []
  user: any = []
  addStatus: string = ''

  friendEntity: FriendEntity = {
    userUid: '',
    friendUid: '',
    friendStatus: '',
    friendDate: ''
  };

  searchFriend(){
    const searchBar = document.querySelector(".searchBar") as HTMLElement
    const buttonAdd = document.querySelector(".buttonAdd") as HTMLElement
    searchBar.style.transform = "translateY(0)"
    buttonAdd.style.display = 'none'
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

      },
   
      (err: any)=>{
   
        console.log("erro ao receber friendList")
   
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

}
