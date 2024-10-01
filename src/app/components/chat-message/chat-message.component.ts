import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChangeChatService } from '../../services/change-chat.service';
import { ApiService } from '../../services/api.service';
import { ChatEntity } from '../../chat-entity.model';
import { icon } from '@fortawesome/fontawesome-svg-core';

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
userSearch: any
teste: any[] = []
  constructor(private api: ApiService ,private changeService: ChangeChatService){}

  ngOnInit(){

    this.getAllMessage()
    
    this.requestNotificationPermission()
    this.changeService.currentChatMessage.subscribe((data)=>{
      if(data != "" && data){
        this.chatInformation = data
        const box_All = document.querySelector(".box_All_Message") as HTMLElement
      
        if(box_All){
          box_All.style.display = 'none'
        }
        
        this.newChat()
        
      }
    })
    this.getMessage()
  }

  requestNotificationPermission() {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permissão de notificação concedida');
        } else {
          console.log('Permissão de notificação negada');
        }
      });
    }
  }
  
  ngAfterViewInit(): void {
 
  }

  getAllMessage(){

    this.api.getGroupAllMessage().subscribe(
      (data: any[])=>{

        this.allMessage = data
        this.keysMessage = Object.keys(this.allMessage)
        this.valuesMessage = Object.values(this.allMessage)
    
        console.log("llaa"+this.valuesMessage.toLocaleString())
      
      },

      (err: any[])=>{
        console.log("erro ao carregar os grupos de mensagens: ", err)
      }
    )

  }

  getMessage(){
   
    this.api.getMessage().subscribe(
      (data: any)=>{
     
        if (Notification.permission === 'granted') {
          console.log("notificação permitida")

          navigator.serviceWorker.ready.then(swRegistration => {
            console.log("aquuiu")
            swRegistration.showNotification('New Message', {
              body: 'Você recebeu uma nova mensagem!',
              icon: 'https://files.tecnoblog.net/wp-content/uploads/2022/09/stable-diffusion-imagem.jpg',
            });
          });
        } else if (Notification.permission === 'default') {
          // Pede permissão caso necessário
          Notification.requestPermission();
        }

        if(localStorage.getItem('ChatOpen')){
          console.log("auth"+localStorage.getItem('Auth'))
          console.log("get"+ data.userGet)
          console.log("chat aberto"+localStorage.getItem('ChatOpen'))
          console.log("send"+data.userSend)
        }
        for(let clear of this.clearMessage){
          console.log("antes de entrar"+clear.messageChat)
        }

        if(localStorage.getItem('ChatOpen') == data.userSend){
          this.updateMessage(data, data.userSend)
          this.clearMessage.push(data)
         
          for(let clear of this.clearMessage){
            console.log("testando cleardentro"+clear.messageChat)
          }
          
            setTimeout(() => {   
              const message_Box = document.querySelector(".message_Box") as HTMLElement
              const last = message_Box.lastElementChild as HTMLElement         
              last.scrollIntoView({ behavior: 'auto' });    
              last.style.display = "flex"
            }, 0);
          
            
            if(!this.chatInformation.username){
            
              this.api.getByUser(data.userSend).subscribe(
                (data: any)=>{
                  this.userSearch = data
                  this.usernames.push(data.userUsername)
                }
              )
              return
            }
            this.usernames.push(this.chatInformation.username)
            return
        }
      
        this.updateMessage(data, data.userSend)
        
      },

      (err: any[])=>{
        console.log("erro ao receber a mensagem ", err)
      }
      
    )
  }

  notification(message: String){
    //new Notification(`${message}`, {icon: "https://files.tecnoblog.net/wp-content/uploads/2022/09/stable-diffusion-imagem.jpg"})
    
  }
  showCustomNotification() {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.displayNotification();
        }
      });
    } else if (Notification.permission === 'granted') {
      this.displayNotification();
    }
  }
  
  displayNotification() {
    const options = {
      body: 'Esta é uma notificação personalizada',
      icon: '/images/icon.png',   // ícone da notificação
      badge: '/images/badge.png', // ícone pequeno (badge)
      image: '/images/banner.png', // imagem grande
      actions: [
        { action: 'confirm', title: 'Aceitar' },
        { action: 'cancel', title: 'Cancelar' }
      ],
      vibrate: [200, 100, 200],  // Vibração
    };
  
    const notification = new Notification('Notificação de chamada!', options);
  
    notification.onclick = (event) => {
      console.log('Notificação clicada', event);
    };
  }
  
  
  updateMessage(data: any, uid: string){
    if(this.keysMessage.includes(uid)){

      const index = this.keysMessage.indexOf(uid)

      this.valuesMessage[index].push(data)
      
      return

    }
        
    this.keysMessage.push(uid)
    this.valuesMessage.push([data])

  }

  createGetMessage(){

  }
//PASSA TODO MUNDO PRA WEBSOCKET PARA SEREM ATUALIZADOS SEMPRE QUE HOUVER ATUALIZAÇÃO
  async newChat(){
    this.closedMessage = true
    this.clearMessage = []
    const index = this.keysMessage.indexOf(this.chatInformation.uid)
    if(index >=0){
      const value = this.valuesMessage[index]
      this.clearMessage = [...value]
    }

    for(let clear of this.clearMessage){
      console.log("testando clear"+clear.messageChat)
    }

   await setTimeout(() => {
      const box_All = document.querySelector(".box_All_Message") as HTMLElement 
      box_All.style.width = "100%"
      box_All.style.height = "100%"
      const message = document.querySelectorAll(".messageChat_Item") as NodeListOf<HTMLElement>
      
      message.forEach((el)=>{
        el.style.display = 'flex'
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
      if(last){
        last.scrollIntoView({ behavior: 'auto' });  
      }
    
      box_All.style.display = "flex"
    }, 0);
    
  }
  
  sendMessage(){
    if(this.message != ''){

    let chatEntity: ChatEntity = {
      userSend: '',
      userGet: '',
      messageChat: '',
      dateChat: '',
      idChat: 0
    };

    const dateString: any = new Date().toLocaleDateString()
    const dateHours: any = new Date().toLocaleTimeString()
   
    const year = `${dateString[6]}${dateString[7]}${dateString[8]}${dateString[9]}`
    const month =  `${dateString[3]}${dateString[4]}`
    const day = `${dateString[0]}${dateString[1]}`
  
     let format: string = `${year}-${month}-${day}`
     
     const dateFormat: string = `${format}T${dateHours}`
     chatEntity.userSend = `${localStorage.getItem('Auth')}`
     chatEntity.userGet = this.chatInformation.uid
     chatEntity.dateChat = dateFormat
     chatEntity.messageChat = this.message
     this.clearMessage.push(chatEntity)
     
     this.usernames.push("Eu")

     setTimeout(() => {   
      this.createSendMessage()

     }, 0);
    
     this.updateMessage(chatEntity, chatEntity.userGet)
     this.api.sendMessage(chatEntity)
  
    
     /*const aux  = this.clearMessage.reverse()
     aux.push(this.chatEntity)
     this.clearMessage =  aux.reverse()
     this.keysMessage.push(this.chatEntity.userGet)*/
     
     this.message = ""
    }
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
    message.style.display = 'flex'
  }

  changeState(){
    this.changeService.changeChat("")
  }

}
