import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangeChatService {

 private chatMessage = new BehaviorSubject<any>(null);
 private closeMenu = new BehaviorSubject<any>(null)

 public height: any;
 public width: any;

 currentChatMessage = this.chatMessage.asObservable()
 currentCloseMenu = this.closeMenu.asObservable()

  constructor() { }

  changeChat(chat: any){
    
    this.chatMessage.next(chat) 

  }

  changeCloseMenu(state: any){
    this.closeMenu.next(state)
  }



}
