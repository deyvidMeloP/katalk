import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { ChatEntity } from '../../chat-entity.model';
import { Router } from '@angular/router';

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

  constructor(private auth: AuthService, private webSocketService: ApiService, private router: Router){

   if(localStorage.getItem('Auth')){
      this.router.navigate(['home']).then(() => {
        // Lógica adicional após a navegação, se necessário
      });
    }
  
  }

  ngOnInit(): void {

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
