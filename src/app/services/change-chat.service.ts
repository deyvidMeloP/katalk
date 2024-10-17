import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChangeChatService {

 private chatMessage = new BehaviorSubject<any>(null);
 private stateFriendChat = new BehaviorSubject<any>(null);
 public height: any;
 public width: any;

 currentChatMessage = this.chatMessage.asObservable()
 currentFriendList = this.stateFriendChat.asObservable()

  constructor() { }

  changeChat(chat: any){
    
    this.chatMessage.next(chat) 

  }

  changeFriendList(stateFriend: any){
    this.stateFriendChat.next(stateFriend)
    
  }


}
