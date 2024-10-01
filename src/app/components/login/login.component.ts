import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { ChatEntity } from '../../chat-entity.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = ''
  password: string = ''
  message: string = '';
  
  messages: ChatEntity[] = [];
  chatEntity: ChatEntity = {
    userSend: '',
    userGet: '',
    messageChat: '',
    dateChat: new Date().toISOString(),
    idChat: 0
  };
  notifications: string[] = [];

  constructor(private auth: AuthService, private webSocketService: ApiService){
  
  }

  ngOnInit(): void {

    localStorage.clear();

  }

  
  sendMessage() {
    //this.webSocketService.sendMessage(this.chatEntity);
  }

  


  login(){

    if(this.email == ''){
      alert("please enter email");
      return;
    }

    if(this.password == ''){
      alert("enter password")
      return
    }

    this.auth.login(this.email, this.password)
    this.email = ''
    this.password = ''


  }
}
