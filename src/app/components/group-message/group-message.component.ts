import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ChangeChatService } from '../../services/change-chat.service';
import { FriendListService } from '../../services/friend-list.service';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { user } from '@angular/fire/auth';

type GroupMessage = {username: string} & {lastMessage: string} & {uid: string} & {userSend: string} & {userGet: string} & {url: string} 

@Component({
  selector: 'app-group-message',
  templateUrl: './group-message.component.html',
  styleUrl: './group-message.component.css'
})

export class GroupMessageComponent implements OnInit {
  constructor(private apiService: ApiService, private chat: ChangeChatService, private friendService: FriendListService ){
  }
 //Recebe todas as mensagens desse usuário, enviadas e recebidas
  allMessage: any[] = []
  //valores de cada mensagem em ordem
  groupMessage: any[] = []
  //Uid de cada usuário que trocou mensagens
  groupKeys: String[] = []
  //para acessar o objeto Object.keys/values
  dataAllMessage: any[] = []
  //todos os usuários
  allUser: any[] =[]

  friendList: any[] = []
  //par username e url
  usernameGroup: GroupMessage[] = [] 
  userNames: string[] = []
  friendKey: any[] = [];
  friendValues: any[] = []
  friendGroup: any[] = []

  addGroupFilter: GroupMessage[] = []
  word: string = 'olá meu nome'
  toggle: boolean = true

  ngOnInit(): void {
    this.getAllMessage();
    this.getGroupMessage();
    this.getFriendList()
    this.getMessage()

    if(localStorage.getItem('ChatOpen')){
      localStorage.setItem('ChatOpen', '')
    }

    /*

    let [wo1, wo2] = this.word.split(' meu ')

    console.log(wo1)
    console.log(wo2)*/

    this.friendService.currentKey.subscribe((data: any[])=>{
      this.friendKey = data
      
    })

    this.friendService.currentValues.subscribe((data: any[])=>{
    
      this.friendValues = data
    
    })

  }


 
    worker(){
      
        navigator.serviceWorker.getRegistration().then(function(reg) {
          if (reg) {
            console.log('Service worker registrado e ativo', reg);
          } else {
            console.log('Service worker não está registrado');
          }
        });
        
  
    }
    
  getAllMessage(){

    this.apiService.getAllMessage().subscribe(
   
      (data: any[])=>{

      this.allMessage = data

    },

    (err: any)=>{
      console.log("erro ao receber todas as mensagens desse usuário")
    }

    )
    
  }

  getGroupMessage(){
    this.apiService.getGroupMessage().subscribe(
      (data: any[])=>{

        this.dataAllMessage = data
        this.groupMessage = Object.values(data)
        this.groupKeys = Object.keys(data)
      
        this.getAllUser()
        // usar para detectar o index de uma chave específica e recuperar seus dados de mensagem const numbe = this.groupKeys.indexOf("fafsafsafasf") 
 
      },

      (err: any[])=>{
        console.log("erro ao receber dados de groupMessage"+ err)
      }
    )
  }

  getMessage(){

    this.apiService.getMessage().subscribe(
      (data: any)=>{
        
        if(localStorage.getItem('Auth') == data.userGet){
          
            if (!this.usernameGroup.some(group=>  group.uid.includes(data.userSend))){
             //refazer isso, criar uma linkedlist com username e Uid
           
             const user = this.allUser.filter(el => el.userUid == data.userSend)
             const username = user[0].userUsername
             
             const group = {
               "username": username,
               "lastMessage": data.messageChat,
               "uid": data.userSend,
               "userSend": data.userSend,
               "userGet": data.userGet,
               "url": "null"
             }
           
             const messageGroup = {
             
              "idChat": user[0].userId,
              "userSend": data.userSend,
              "messageChat": data.messageChat,
              "userGet": data.userGet,
              "dateChat": data.dateChat
    
             }

             this.addGroupFilter.push(group)
             this.usernameGroup.unshift(group)
             this.groupKeys.unshift(data.userSend)
             this.groupMessage.unshift(messageGroup)


            }

 
        }
       
      },

      (err: any[])=>{
        console.log("erro ao receber a mensagem ", err)
      }
      
    )
  }


  getAllUser(){

    this.apiService.getAllUser().subscribe(
      (data: any[])=>{

        this.allUser = data
       const user =  this.allUser.filter((el)=>{
          return el.userUid == localStorage.getItem("Auth")
        })
        localStorage.setItem("Username", user[0].userUsername) 

        this.allUser.forEach((el)=>{

          if(this.groupKeys.includes(el.userUid)){
            const index = this.groupKeys.indexOf(el.userUid)
            const lastMessage = this.groupMessage[index].messageChat
            const userSend = this.groupMessage[index].userSend
            const userGet = this.groupMessage[index].userGet
            
            const group = {
              "username": el.userUsername,
              "lastMessage": lastMessage,
              "uid": el.userUid,
              "userSend": userSend,
              "userGet": userGet,
              "url": "null"
            }
            this.usernameGroup.push(group)
            
          }

        }
      )
      },

      (err: any[])=>{
        console.log("erro ao receber dados de groupMessage"+ err)
      }
    )
  }

  getFriendList(){

    this.friendService.getFriendList().subscribe(
      (data: any[])=>{
        this.friendList = data


      },

      (err: any)=>{
    
        console.log("erro ao receber a lista de ami")
    
      }

    )
    
  }

  chatMessage(group: any){
    
    if(group.uid != localStorage.getItem('ChatOpen')){
      localStorage.setItem('ChatOpen', group.uid)
      const box = document.querySelector(".background") as HTMLElement
      this.chat.changeChat(group);
    }    
    
  }

teste(){
  alert("allaal")
}

  async showMenu(){
    const icon = document.querySelectorAll(".menuCircle span") as NodeListOf<HTMLElement>
    const menuButton = document.querySelector(".menu_Button") as HTMLElement
    const menuClose = document.querySelector(".menu_Close") as HTMLElement
    if(this.toggle){    
      menuButton.style.display = "none"
      menuClose.style.visibility = "visible"
      menuClose.classList.add('translateIcon')

      await icon.forEach((el)=>{
        el.style.visibility = "visible"
      })
      
  
      const values: any = [90, 0, 63, 63, 0, 90, -63, 63, -90, 0, 34, 89]
      let cont = 0
  
  
      for(let i = 0; i < icon.length; i++){
      
        icon[i].style.transform = `translate(${values[cont]}px, ${values[cont += 1]}px)`;
        icon[i].classList.add('translateIcon');
        cont += 1;
  
        await this.delay(300);
      }

      
    }

    else{

     await menuClose.classList.remove('translateIcon')
      menuButton.style.display = "block"
      menuClose.style.visibility = "hidden"
      
      let cont = 0
      for(let i = 0; i < icon.length; i++){
      
        icon[i].style.transform = `translate(0px, 0px)`;
        icon[i].classList.remove('translateIcon');
        icon[i].style.visibility = "hidden"
        cont += 1;
  
        await this.delay(300);
      }

    }
    this.toggle = !this.toggle
 
   
    
  
}

clickCloseMenu(){
  const menuClose = document.querySelector(".menu_Close") as HTMLElement
 
  if(menuClose && menuClose.classList.contains('translateIcon')){
    this.showMenu()  
  }
}

async closeMenu(){
  const icon = document.querySelectorAll(".menuCircle span") as NodeListOf<HTMLElement>
  const menuButton = document.querySelector(".menu_Button") as HTMLElement
  const menuClose = document.querySelector(".menu_Close") as HTMLElement
  
     await menuClose.classList.remove('translateIcon')
      menuButton.style.display = "block"
      menuClose.style.visibility = "hidden"
      
      let cont = 0
      for(let i = 0; i < icon.length; i++){
      
        icon[i].style.transform = `translate(0px, 0px)`;
        icon[i].classList.remove('translateIcon');
        icon[i].style.visibility = "hidden"
        cont += 1;
  
        await this.delay(300);
      }

}

delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



showFriendList(){
  this.showMenu()
  const friendAll = document.querySelector(".friendAll") as HTMLElement
  friendAll.style.display = "block"


}

groupSubscribe(){
  
}

addNewGroup(){

  this.friendValues.forEach((key)=>{

 if (!this.usernameGroup.some(group=>  group.uid.includes(key.friendUid))){

  //refazer isso, criar uma linkedlist com username e Uid

  const user = this.allUser.filter(el => el.userUid == key.friendUid)
  const username = user[0].userUsername
  
  const group = {
    "username": username,
    "lastMessage": '',
    "uid": key.friendUid,
    "userSend": key.userUid,
    "userGet": key.friendUid,
    "url": "null"
  }

  const messageGroup = {
             
    "idChat": user[0].userId,
    "userSend": key.userUid,
    "messageChat": '',
    "userGet": key.friendUid,
    "dateChat": ''

   }

  this.addGroupFilter.push(group)
  this.usernameGroup.unshift(group)
  this.groupKeys.unshift(key.friendUid)
  this.groupMessage.unshift(messageGroup)
 }



  })

  /* "username": el.userUsername,
              "lastMessage": lastMessage,
              "uid": el.userUid,
              "userSend": userSend,
              "userGet": userGet,
              "url": "null"*/

  
}


}
