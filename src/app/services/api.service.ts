import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,  Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { getAuth } from "firebase/auth";
import { RxStompService, StompConfig } from '@stomp/ng2-stompjs';
import { RxStompConfig } from '@stomp/rx-stomp';
import * as Stomp from 'stompjs';
import { ChatEntity } from '../chat-entity.model';
import { rtcEntity } from '../webRTC.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private stompClient: Stomp.Client | undefined;

  private stompConfig: RxStompConfig = {
    brokerURL: 'ws://localhost:8080/chat-websocket',
    connectHeaders: {},
    debug: (msg: string) => {
      console.log(new Date(), msg);
    },
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 2000
  };
  
   
  constructor(private http: HttpClient, private stompService: RxStompService) {
    
    this.stompService.configure(this.stompConfig);
    this.stompService.activate();

  }

  sendMessage(chatEntity: ChatEntity) {
    this.stompService.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify(chatEntity),
    });
  }

  sendInviteCall(offer: any) {

    const webRTCMessage = {
      type: 'offer', // Indica que é uma oferta
      data: JSON.stringify(offer) // Serializa o objeto offer
    };

    this.stompService.publish({
    destination: '/app/sendInviteCall', // O destino definido no backend
    body: JSON.stringify(webRTCMessage), // Converte o objeto WebRTCMessage para JSON
  });

  }

  getMessage(): Observable<ChatEntity> {
    return this.stompService.watch('/topic/notifications').pipe(
      map(message => {
        const body = JSON.parse(message.body);
 
        console.log('Notification receivedaakakaka:', body); // Verificando o que foi recebido
        return body as ChatEntity;
      })
    );
  }

  getvoiceCall(): Observable<any> {
    return this.stompService.watch('/topic/voiceCall').pipe(
      map(message => {
        const body = JSON.parse(message.body);
 
        console.log('invite CALL received:', body); // Verificando o que foi recebido
        return body as any;
      })
    );
  }

  sendCandidateofB(event: any){
    console.log("CANDIDATOS DE B ENVIADOS PARA A")
    const webRTCMessage = {
      type: 'ice-candidate',
      candidate: {
        candidate: event.candidate,
        sdpMid: event.sdpMid,
        sdpMLineIndex: event.sdpMLineIndex
      }
    };
    this.stompService.publish({
      destination: '/app/sendCandidate',
      body: JSON.stringify(webRTCMessage),
    });
    
}

  sendCandidate(event: any){
    const webRTCMessage = {
      type: 'ice-candidate',
      candidate: {
        candidate: event.candidate,
        sdpMid: event.sdpMid,
        sdpMLineIndex: event.sdpMLineIndex
      }
    };
    this.stompService.publish({
      destination: '/app/sendCandidate',
      body: JSON.stringify(webRTCMessage),
    });
    

/*
console.log('candidatos')
    this.stompService.publish({
      destination: '/app/sendCandidate', // Rota que o outro peer está escutando
      body: JSON.stringify({
        type: 'ice-candidate',
        candidate: event.candidate
      })
    });*/
  
  }

  sendOffer(offer: any){
      const webRTCMessage = {
        type: 'offer', // Indica que é uma oferta
        sdp: offer.sdp // Envia o campo sdp sem serializar
      };
    
      this.stompService.publish({
        destination: '/app/sendOffer', // O destino definido no backend
        body: JSON.stringify(webRTCMessage) // Converte o objeto WebRTCMessage para JSON
      });
    
    

    /*this.stompService.publish({
      destination: '/app/sendOffer', // Rota que o outro peer está escutando
      body: JSON.stringify({
        type: 'offer',
        candidate: offer
      })
    });*/
  
  }

  sendAnswer(answer: any) {

    const webRTCMessage = {
      type: 'answer', // Indica que é uma oferta
      sdp: answer.sdp // Serializa o objeto offer
    };

    this.stompService.publish({
    destination: '/app/sendAnswer', // O destino definido no backend
    body: JSON.stringify(webRTCMessage), // Converte o objeto WebRTCMessage para JSON
  });

    /*this.stompService.publish({
      destination: '/app/sendAnswer', // Rota que o outro peer está escutando
      body: JSON.stringify({
        type: 'answer',
        sdp: answer
      })
    });*/
  }
  
  getAnswerCall(): Observable<any> {
    return this.stompService.watch('/topic/answerCall').pipe(
      map(message => {
        const body = JSON.parse(message.body);
        console.log('ANSWER RECEBIDA:', body); // Verificando o que foi recebido
        return body as any;
      })
    );
  }

  getCandidateofA(): Observable<any> {
    return this.stompService.watch('/topic/getCandidate').pipe(
      map(message => {
        const body = JSON.parse(message.body);
        console.log('CANDIDATO RECEBIDO DE A:', body); // Verificando o que foi recebido
        return body as any;
      })
    );
  }

  getCandidateofB(): Observable<any> {
    return this.stompService.watch('/topic/getCandidate').pipe(
      map(message => {
        const body = JSON.parse(message.body);
        console.log('CANDIDATO RECEBIDO de B:', body); // Verificando o que foi recebido
        return body as any;
      })
    );
  }
  

  getOffer(): Observable<any> {
    return this.stompService.watch('/topic/getOffer').pipe(
      map(message => {
        const body = JSON.parse(message.body);
 
        console.log('OFFER RECEBIDA:', body); // Verificando o que foi recebido
        return body as any;
      })
    );
  }

/*  getMessages(): Observable<ChatEntity> {
  
    return this.stompService.watch('/topic/messages').pipe(
      map(message => {
        console.log('Received message body:', message.body); // Log para verificar o conteúdo recebido
        const body = JSON.parse(message.body);
        console.log('Parsed message body:', body); // Log para verificar o corpo da mensagem após o parse
        return body as ChatEntity; // Converta o corpo para ChatEntity
      })
    );
  }*/
  


  private url = 'http://localhost:8080'


  getAllUser(): Observable<any[]>{
    const url = `${this.url}/chat/getAllUser`;

    return this.http.get<any[]>(url).pipe();

  }

  getUserSort(): Observable<any[]>{
    const url = `${this.url}/chat/UserSort`;
    return this.http.get<any[]>(url).pipe()

  }

  putNewRegister(url: any, user: any): Observable<any> {
    return this.http.put(url, user).pipe(
        tap(() => console.log('Dados enviados')),
    );
}

sendWebRTCMessage(type: string, data: any) {
  this.stompService.publish({
    destination: '/app/voiceCall',
    body: JSON.stringify({ type, data }),
  });
}


getAllMessage():  Observable<any[]>{

  const url = `${this.url}/chat/getChat/${localStorage.getItem('Auth')}`
  
  return this.http.get<any[]>(url).pipe(
    tap(data => console.log('Dados de chat recebidos:', data))
  )
}

getGroupMessage(): Observable<any[]>{
  
  const url = `${this.url}/chat/groupMessage/${localStorage.getItem('Auth')}`
  return this.http.get<any[]>(url).pipe(
    tap(data => console.log('Dados de GroupMessage recebidos:', data))
  )
}

getGroupAllMessage():Observable<any[]>{

 const url = `${this.url}/chat/groupAllMessage/${localStorage.getItem('Auth')}`

 return this.http.get<any[]>(url).pipe(
  tap(data => console.log('Dados de GroupAllMessage recebidos:', data))
 )
}

getByUser(uid: string):Observable<any>{
  const url = `chat/GetUser/${uid}`

  return this.http.get(url)


}



}
