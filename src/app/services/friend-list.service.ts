import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,  Subject, tap } from 'rxjs';
import { FriendEntity } from '../newFriend.model';
import { map } from 'rxjs/operators';
import { RxStompService, StompConfig } from '@stomp/ng2-stompjs';
import { RxStompConfig } from '@stomp/rx-stomp';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class FriendListService {

  constructor(private http: HttpClient, private stompService: RxStompService) { 
    this.stompService.configure(this.stompConfig);
    this.stompService.activate();

  }

  private url = 'https://katalk-api.onrender.com'
  private friendsKey = new BehaviorSubject<any[]>([])
  private friendsValues = new BehaviorSubject<any[]>([])
  private stompConfig: RxStompConfig = {
    brokerURL: 'wss://katalk-api.onrender.com/chat-websocket',
    connectHeaders: {},
    debug: (msg: string) => {
   
    },
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 2000
  };
  

  currentKey = this.friendsKey.asObservable()
  currentValues = this.friendsValues.asObservable()

  getFriendList(): Observable<any[]>{

    const url = `${this.url}/chat/FriendList/${localStorage.getItem("Auth")}` 

    return this.http.get<any[]>(url).pipe(
   
      tap(data => console.log('Lista de amigos recebidas: ', data))
      
    )
  }

  changeRequest(friend: FriendEntity): Observable<any>{

    const url = `${this.url}/katalk/changeRequest`
    return this.http.put(url, friend).pipe()
    
  }

  /*friendSortList(): Observable <any[]>{
    
    const url = `${this.url}/katalk/FriendSortList/${localStorage.getItem("Auth")}` 

    return this.http.get<any[]>(url).pipe(
   
      tap(data => console.log('Lista Ordenada de amigos recebidas: ', data))
      
    )
    

  }*/

  putNewFriend(friend: any): Observable<any>{
    const url = `${this.url}/katalk/addFriend`
  
    
    return this.http.put(url, friend).pipe()

  }

  setKeyValue(values: any[]){

    this.friendsValues.next(values)
    
  }


  invitedFriend():Observable<FriendEntity>{

    const url = `${this.url}/topic/friendInvite/${localStorage.getItem('Auth')}`  

    return this.stompService.watch(url).pipe(
      map(message =>{
        const body = JSON.parse(message.body)
    
        return body as FriendEntity;
    
      })
    )

  }
  



}
