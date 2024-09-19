import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangeChatService {

 private chatMessage = new BehaviorSubject<any>(null);
 public height: any;
 public width: any;

 currentChatMessage = this.chatMessage.asObservable()
 
  constructor() { }

  changeChat(chat: any){
    
    this.chatMessage.next(chat) 

  }


}
