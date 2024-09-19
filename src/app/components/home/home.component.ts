import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { getLocaleTimeFormat } from '@angular/common';
import { ChatEntity } from '../../chat-entity.model';
import { RxStompService } from '@stomp/ng2-stompjs';
import { getAuth } from 'firebase/auth';
import { WebRTCService } from '../../services/web-rtc.service';
import { ChangeChatService } from '../../services/change-chat.service';

type GroupMessage ={idChat: number} & {messageChat: string} & { userSend: string } & { userGet: string } & {dateChat: any};
type UserMessage = {userId: number} & {userUid: string} & {userEmail: string} & {userUsername: string} & {userStatus: number}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  chatState: boolean = true




  user: any = '';
  userAll: any[] = [];
  textSearch: string = '';
  wordSearch: any[] = [];
  myUser: any[] = []
  results: any[] = [];
  allMessage: any[] = [];
  uidGet: string = ''
  lastReceivedMsg: any
  addNewChatResult: any[] = []
  testando: number = 0
  lastUser: any
  stateChat: number = 0

  chatEntity: ChatEntity = {
    userSend: '',
    userGet: '',
    messageChat: '',
    dateChat: '',
    idChat: 0
  };

  stateAddChat: number = 0
  
  // Definindo o array como uma propriedade da classe
  groupMessage: GroupMessage[] = [];

  chatMessage: GroupMessage[] = []

  userMessage: UserMessage[] = []

  localStream: MediaStream | null = null;
  remoteStream: MediaStream | null = null;

  constructor(private authService: AuthService, private router: Router, private api: ApiService, private renderer: Renderer2, 
  private stompService: RxStompService, private webRTCService: WebRTCService, private chatService: ChangeChatService
  ){
    const state = localStorage.getItem('login')
    if(state != 'logado'){
      this.router.navigate(['/login'])
    }    
  }

  ngOnInit(){

    //ordena o vetor por data
    this.api.getAllUser().subscribe(
      (data: any[])=>{
        this.myUser = data
        this.userAll = data.filter((el)=>{

          return el.userEmail != localStorage.getItem('email')

        })
        this.getAllMessage()
      },
      (error: any) => {
        console.log("erro ao acessar os dados dos usuários")
      }
    )

  this.stompService.activate();
 
 
  this.getOtherMessage()
 // this.getVoiceCall()
  //this.getAnswerCall()

  this.chatService.currentChatMessage.subscribe((state)=>{
/*    
    const groupMessage = document.querySelector(".groupMessage") as HTMLElement
    const chatMessage = document.querySelector(".chatMessage") as HTMLElement

    if(state){      

      chatMessage.style.display = "block"
      groupMessage.style.display = "none"
      
    }

    if(state == ""){
       chatMessage.style.display = "none"
      groupMessage.style.display = "block"
    }
      */
  })


  }


 /* async startCall() {
   
    const local = await this.webRTCService.initCall();

    if(local){
      this.localStream = local
    }
    const offer = await this.webRTCService.createOffer();

    this.api.sendInviteCall(offer)
    // Enviar a oferta para outro peer via servidor de sinalização (não implementado aqui)
    console.log('Oferta criada:', offer);
  }*/

  /*getVoiceCall(){
    this.api.getvoiceCall().subscribe(
      (data: any)=>{

      

          console.log('Offer received:', data);
          this.answerCall(data); // Processa a oferta recebida

        

      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  }*/

    // Responde à oferta
    /*async answerCall(offer: RTCSessionDescriptionInit) {
      const answer = await this.webRTCService.handleOffer(offer);
      // Enviar a resposta de volta para o peer que enviou a oferta
      this.api.sendAnswer(answer); 
      console.log('Resposta enviada:', answer);
  
    }*/

  /*getAnswerCall(){
    this.api.getAnswerCall().subscribe(
      (data: any)=>{
      
          console.log('ANSWER received IN home:', data);
          this.handleAnswer(data); // Processa a oferta recebida
        
       
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  }
  

  // Lidar com a resposta recebida do peer
  async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.webRTCService.handleAnswer(answer);
  }*/
  getAllMessage(){

    this.api.getAllMessage().subscribe(
      (data: any[])=>{

        this.allMessage = data
        this.chatMessage = data
        this.lastReceivedMsg = data

        for(let msg of this.allMessage){
          
          const results = this.groupMessage.some((el)=>{
            
            return (el.userSend == msg.userSend && el.userGet == msg.userGet) || (el.userGet == msg.userSend && el.userSend == msg.userGet)
            
          })

          if(!results){

            for(let el of this.userAll){

              if(el.userUid == msg.userSend || el.userUid == msg.userGet){
            //pode usar um find()
                this.userMessage.push(el)
                this.addNewChatResult.push(el)
                const lala = document.querySelector(".all_Message") as HTMLElement
                //lala.style.display = 'flex'
                break
            
              }
            
            }

          
            this.groupMessage.push(msg)
            
          }

        }        
    
      },
      (error: any) => {
        console.log("erro ao acessar os dados dos usuários")
      }
    )


  }

  getOtherMessage(){
 /*   this.api.getNotifications().subscribe(
      (data: any)=>{
        const auth = getAuth();
        const uidUser = auth.currentUser;
   
        if(uidUser?.uid == data.userGet){

          this.allMessage.push(data)
        
          const lastUser =  this.userAll.filter((el)=>{
          
            return el.userUid == data.userSend
         
          })

          this.lastUser = lastUser[0]
                 
          if(!this.verifyChat()){
            this.addBoxChat()
          }
        }
        
      },

      (error: any) => {
        console.log("erro ao receber a mensagem")
      }
    )*/
  }


  getTextMessage(){
    const chatBox = document.querySelector(".chat_box") as HTMLElement

    const messageGet = this.renderer.createElement('div')
        const messageText = this.renderer.createElement('div')

        this.renderer.addClass(messageText, 'text_Message')
        this.renderer.appendChild(messageText, this.renderer.createText(this.lastReceivedMsg.messageChat))
        this.renderer.appendChild(messageGet, messageText)

        this.renderer.addClass(messageGet, 'messageGet')

        chatBox.appendChild(messageGet)

  }

  logout(){
    this.authService.logout()
  }

  userSearch(word: any): void{

    const text = this.textSearch.toLocaleLowerCase()
    this.wordSearch.includes(text)
    const items = document.querySelector(".items_Search") as HTMLElement
    const item = document.querySelectorAll(".item_Search") as NodeListOf <HTMLElement>
    items.style.display = 'flex'
  
    item.forEach((el)=>{
      items.removeChild(el)
    })

    if(text == ''){

      this.results = []
      return
    }
  
    this.results = this.userAll.filter((el)=>{
      const username = el.userUsername.toLocaleLowerCase()

      return username.includes(text)
    })
      

    if(this.results.length>0){
  
      console.log(this.results[0].userUsername)
        
        for(let user of this.results){
       
          const h1 = this.renderer.createElement('h1')
          const item = this.renderer.createElement('div')

          this.renderer.appendChild(h1, this.renderer.createText(user.userUsername))
          item.appendChild(h1)
      
          this.renderer.addClass(item, 'item_Search')

        
          this.renderer.listen(item, 'click', ()=>{
      
            this.textSearch = ''
            items.style.display = 'none'

          let state = this.groupMessage.some((el)=>{

              return el.userSend == user.userUid || el.userGet == user.userUid
         
          })

          let state2 = this.addNewChatResult.some((el)=>{
            
            return el.userUid == user.userUid
          
          })
         
          if(!state && !state2){
            this.stateAddChat += 1
            this.lastUser = user
            this.addBoxChat()     

          }
    
          })
          
          items.appendChild(item)
       
        }
       

    }

  }


  verifyChat(): boolean{
    
    return this.addNewChatResult.some((el)=>{
    
    return el.userUid == this.lastUser.userUid
  
  })

    

  }

  addBoxChat(){
    this.addNewChatResult.push(this.lastUser)
    if(this.addNewChatResult.length > 0 && this.stateChat == 0){

      const allMessage =  document.querySelectorAll(".all_Message") as NodeListOf<HTMLElement>

      allMessage[0].style.display = "flex"

      const divNew = this.renderer.createElement('div')
      const img = this.renderer.createElement('img')
      const h1New = this.renderer.createElement('h1')

      this.renderer.appendChild(h1New, this.renderer.createText(this.lastUser.userUsername))
      this.renderer.setAttribute(img, 'src', "https://i.pinimg.com/236x/03/ac/c0/03acc030c6700dfd274d1ef20e70609b.jpg")
      
      this.renderer.addClass(img, 'image_User')

      this.renderer.addClass(divNew, 'box_Message')

      this.renderer.appendChild(divNew, img)
      this.renderer.appendChild(divNew, h1New)

      this.renderer.listen(divNew, 'click', ()=>{
        
        this.clickChat(localStorage.getItem('Auth'), this.lastUser.userUid)

      })
      allMessage[0].appendChild(divNew)
      this.allMessage[0].style.display = "flex"
      
    }
      
      
  }

  clickChat(userSend: any, userGet: any){

    const messageChat = document.querySelector(".message_Chat") as HTMLElement
    const messageSend = document.querySelectorAll(".messageSend") as NodeListOf<HTMLElement>
    const messageGet = document.querySelectorAll(".messageGet") as NodeListOf<HTMLElement>

    messageSend.forEach((el)=>{

      messageChat.removeChild(el)
      
    })

    messageGet.forEach((el)=>{

      messageChat.removeChild(el)
      
    })

    if(userGet == localStorage.getItem('Auth')){
      this.uidGet = userSend

      const send = userSend
      userSend = localStorage.getItem('Auth')
      userGet = send
   
    }

    else{
      this.uidGet = userGet    
    }
 

    //refaça essa lógica, está muito ruim
    

    const message: any[] = []

    this.chatMessage.forEach((el)=>{

      if(el.userSend == userSend && el.userGet == userGet){

        const messageSend = this.renderer.createElement('div')
        const messageText = this.renderer.createElement('div')

        this.renderer.addClass(messageText, 'text_Message')
        this.renderer.appendChild(messageText, this.renderer.createText(el.messageChat))
        this.renderer.appendChild(messageSend, messageText)

        this.renderer.addClass(messageSend, 'messageSend')

        messageChat.appendChild(messageSend)
        
      }

      else if(el.userGet ==  userSend && el.userSend == userGet){

        const messageGet = this.renderer.createElement('div')
        const messageText = this.renderer.createElement('div')
        this.renderer.addClass(messageText, 'text_Message')
        this.renderer.appendChild(messageText, this.renderer.createText(el.messageChat))
        this.renderer.appendChild(messageGet, messageText)

        this.renderer.addClass(messageGet, 'messageGet')

        messageChat.appendChild(messageGet)

      }
    })


    const allMessage = document.querySelector(".all_Message") as HTMLElement
    const teste = document.querySelector(".send_Message") as HTMLElement
   
    messageChat.style.display = 'flex'
    allMessage.style.display = 'none'
    this.stateChat = 1
    teste.style.display = 'flex'
  }

  gotMessage(TextMessage: any){
   
    const chatBox = document.querySelector(".chat_box") as HTMLElement

    const messageGet = this.renderer.createElement('div')
    const messageText = this.renderer.createElement('div')
  
    this.renderer.addClass(messageText, 'text_Message')
    this.renderer.appendChild(messageText, this.renderer.createText(TextMessage))
    this.renderer.appendChild(messageGet, messageText)
  
    this.renderer.addClass(messageGet, 'messageGet')
  
    chatBox.appendChild(messageGet)

    
  }

  sendMessage(){

  const chatBox = document.querySelector(".chat_box") as HTMLElement

  const messageSend = this.renderer.createElement('div')
  const messageText = this.renderer.createElement('div')

  this.renderer.addClass(messageText, 'text_Message')
  this.renderer.appendChild(messageText, this.renderer.createText(this.chatEntity.messageChat))
  this.renderer.appendChild(messageSend, messageText)

  this.renderer.addClass(messageSend, 'messageSend')

  chatBox.appendChild(messageSend)


  const dateString: any = new Date().toLocaleDateString()
  const dateHours: any = new Date().toLocaleTimeString()
   
  const year = `${dateString[6]}${dateString[7]}${dateString[8]}${dateString[9]}`
  const month =  `${dateString[3]}${dateString[4]}`
  const day = `${dateString[0]}${dateString[1]}`

   let format: string = `${year}-${month}-${day}`
   
   const dateFormat: string = `${format}T${dateHours}`
   this.chatEntity.userSend = `${localStorage.getItem('Auth')}`
   this.chatEntity.userGet = this.uidGet
   this.chatEntity.dateChat = dateFormat

  this.api.sendMessage(this.chatEntity)

   //20/08/2024

/*
    const date = `${year}-${month}-${day} ${hour}-${minute}-${second}`*/
   
    
  }

  backButton(){
    //ele está adicionando o chat, mensagem por mensagem dentro do chat box, retire isso e coloque dentro de uma div menor
    this.stateChat = 0
    const allMessage = document.querySelector(".all_Message") as HTMLElement
    const submitBar = document.querySelector(".send_Message") as HTMLElement
    const messageChat = document.querySelector(".message_Chat") as HTMLElement
    const messageSend = document.querySelectorAll(".messageSend") as NodeListOf<HTMLElement>
    const messageGet = document.querySelectorAll(".messageGet") as NodeListOf<HTMLElement>

    if(this.allMessage.length == 0 && this.stateAddChat == 0){

      const messageEmpty = document.querySelector(".messageEmpty") as HTMLElement
      messageEmpty.style.display = 'flex'
    }

    else{
    allMessage.style.display = 'flex'
    }

    messageSend.forEach((el)=>{

      messageChat.removeChild(el)
      
    })

    messageGet.forEach((el)=>{

      messageChat.removeChild(el)
      
    })
   
    messageChat.style.display = "none"
    this.stateChat = 1
    submitBar.style.display = 'none'

  }

}

