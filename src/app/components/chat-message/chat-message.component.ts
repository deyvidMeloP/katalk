import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChangeChatService } from '../../services/change-chat.service';
import { ApiService } from '../../services/api.service';
import { ChatEntity } from '../../chat-entity.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent implements OnInit, AfterViewInit {

allMessage: any[] = []
chatInformation: any;
keysMessage: String[] = []
valuesMessage: any[] = []
clearMessage: any[] = []
closedMessage: boolean = false
username: string| null = ""
usernames: string[] = []
message: string = ""
chatEntity: ChatEntity = {
  userSend: '',
  userGet: '',
  messageChat: '',
  dateChat: '',
  idChat: 0
};


  constructor(private api: ApiService ,private changeService: ChangeChatService){}

  ngOnInit(){

    this.getAllMessage()
   
    this.changeService.currentChatMessage.subscribe((data)=>{
      if(data != "" && data){
        this.chatInformation = data
        this.newChat()
      }
    })
    this.getMessage()
  }

  ngAfterViewInit(): void {
 
  }

  getAllMessage(){

    this.api.getGroupAllMessage().subscribe(
      (data: any[])=>{

        this.allMessage = data
        
        this.keysMessage = Object.keys(this.allMessage)
    
        this.valuesMessage = Object.values(this.allMessage)
      
      },

      (err: any[])=>{
        console.log("erro ao carregar os grupos de mensagens: ", err)
      }
    )

  }

  getMessage(){

    this.api.getMessage().subscribe(
      (data: any)=>{
        
        if(localStorage.getItem('Auth') == data.userSend){

          this.clearMessage.push(data)
          this.keysMessage.push(data.userSend)
          this.valuesMessage.push(data)
       
          this.usernames.push(this.chatInformation.username)
         
          const message_Box = document.querySelector(".message_Box") as HTMLElement
          const last = message_Box.lastElementChild
          if(last)
            setTimeout(() => {
              last.scrollIntoView({ behavior: 'auto' });    
            }, 0);
          
        }
       
      },

      (err: any[])=>{
        console.log("erro ao receber a mensagem ", err)
      }
      
    )
  }

  createGetMessage(){

  }

  newChat(){
    this.closedMessage = true
    this.clearMessage = []
    const index = this.keysMessage.indexOf(this.chatInformation.uid)
    if(index >=0){
      this.clearMessage = this.valuesMessage[index]
    }
   
    setTimeout(() => {
      const box_All = document.querySelector(".box_All_Message") as HTMLElement 
      box_All.style.width = "100%"
      box_All.style.height = "100%"
      const message = document.querySelectorAll(".messageChat_Item") as NodeListOf<HTMLElement>
      
      message.forEach((el)=>{

        const chat  = el.getAttribute("data-chat")
        if(chat == localStorage.getItem("Auth")){
         this.username = "Eu"
         this.usernames.push(this.username)
         el.style.alignSelf = "end"
         el.style.alignItems = "end"

         const top = el.querySelector(".topMessage") as HTMLElement
         const topSend = el.querySelector(".topSendMessage") as HTMLElement
          
         top.style.display = "none"
         topSend.style.display = "block"

         const box = el.querySelector(".messageChat") as HTMLElement
         box.style.borderRadius = "5px 0px 5px 5px"
        
         const information = el.querySelector(".message_Information") as HTMLElement
         information.style.flexDirection = "row-reverse"
        

        }
        else{
          this.usernames.push(this.chatInformation.username)
        }

      })

      const message_Box = document.querySelector(".message_Box") as HTMLElement
      const last = message_Box.lastElementChild
      if(last)
          last.scrollIntoView({ behavior: 'auto' });    
    }, 0);
 
   
    
  }
  
  sendMessage(){

    const dateString: any = new Date().toLocaleDateString()
    const dateHours: any = new Date().toLocaleTimeString()
     
    const year = `${dateString[6]}${dateString[7]}${dateString[8]}${dateString[9]}`
    const month =  `${dateString[3]}${dateString[4]}`
    const day = `${dateString[0]}${dateString[1]}`
  
     let format: string = `${year}-${month}-${day}`
     
     const dateFormat: string = `${format}T${dateHours}`
     this.chatEntity.userSend = `${localStorage.getItem('Auth')}`
     this.chatEntity.userGet = this.chatInformation.uid
     this.chatEntity.dateChat = dateFormat
     this.chatEntity.messageChat = this.message
     
     this.clearMessage.push(this.chatEntity)
     this.usernames.push("Eu")

     setTimeout(() => {   
      this.createSendMessage()

     }, 0);
    
     this.api.sendMessage(this.chatEntity)
  
    
     /*const aux  = this.clearMessage.reverse()
     aux.push(this.chatEntity)
     this.clearMessage =  aux.reverse()
     this.keysMessage.push(this.chatEntity.userGet)*/
     
     this.message = ""

  }

  createSendMessage(){
    const messageBox = document.querySelector(".message_Box") as HTMLElement

    const message = messageBox.lastElementChild as HTMLElement
    message.style.alignSelf = "end"
    message.style.alignItems = "end"

    const top = message.querySelector(".topMessage") as HTMLElement
    const topSend = message.querySelector(".topSendMessage") as HTMLElement
          
    top.style.display = "none"
    topSend.style.display = "block"

    const box = message.querySelector(".messageChat") as HTMLElement
    box.style.borderRadius = "5px 0px 5px 5px"
        
    const information = message.querySelector(".message_Information") as HTMLElement
    information.style.flexDirection = "row-reverse"

  }

  changeState(){
    this.changeService.changeChat("")
  }

}
