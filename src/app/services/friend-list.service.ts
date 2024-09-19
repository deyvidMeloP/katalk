import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,  Subject, tap } from 'rxjs';
import { FriendEntity } from '../newFriend.model';

@Injectable({
  providedIn: 'root'
})
export class FriendListService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:8080'
  private friendsKey = new BehaviorSubject<any[]>([])
  private friendsValues = new BehaviorSubject<any[]>([])

  currentKey = this.friendsKey.asObservable()
  currentValues = this.friendsValues.asObservable()

  getFriendList(): Observable<any[]>{

    const url = `${this.url}/chat/FriendList/${localStorage.getItem("Auth")}` 

    return this.http.get<any[]>(url).pipe(
   
      tap(data => console.log('Lista de amigos recebidas: ', data))
      
    )
  }

  putNewFriend(friend: any): Observable<any>{
    const url = `${this.url}/katalk/addFriend`
  
    
    return this.http.put(url, friend).pipe()

  }

  setKeyValue(key: any[], values: any[]){

    this.friendsKey.next(key)
    this.friendsValues.next(values)
  }

  



}
