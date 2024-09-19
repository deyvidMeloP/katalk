import { Component, OnInit } from '@angular/core';
import { WebRTCService } from '../../services/web-rtc.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-voice-call',
  templateUrl: './voice-call.component.html',
  styleUrl: './voice-call.component.css'
})
export class VoiceCallComponent implements OnInit{

constructor(private webRTCService: WebRTCService, private api: ApiService){

} localStream: MediaStream | null = null;
remoteStream: MediaStream | null = null;
candidateA: any
offer: any;
answer: any

  ngOnInit(): void {
   this.getOffer()
   this.getAnswerCall()
   this.getCandidate() 
   this.getCandidateofB()
  }

  clickCall(){
    this.webRTCService.startCall()
    this.webRTCService.createOffer()
  }

  
  getCandidate(){
    this.api.getCandidateofA().subscribe(
      (data: any)=>{
        if(localStorage.getItem('Auth') == 'UtrgzQdujMTqg1l7RooU499Rd5i2'){
          console.log('Candidatos de A recebidos em B', data);
          this.candidateA = data; // Processa a oferta recebida 
          this.webRTCService.handleRemoteCandidate(data)
          console.log(data)
        }
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  
  }

  getCandidateofB(){
    this.api.getCandidateofB().subscribe(
      (data: any)=>{
        if(localStorage.getItem('Auth') == 'tbV8BWE6oHYm1R2B5CdzPqVzpBm1'){
          console.log('Candidatos de B recebidos em A', data);
          this.candidateA = data; // Processa a oferta recebida
          this.webRTCService.handleRemoteCandidate(data)
          console.log(data)
        }
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  
  }

  getOffer(){
    
    if(localStorage.getItem('Auth') == 'UtrgzQdujMTqg1l7RooU499Rd5i2'){
    this.api.getOffer().subscribe(
      (offer: any)=>{
       
          console.log('OFFER  recebido em UTRGZ', offer);
          this.offer = offer; // Processa a oferta recebida 
          this.webRTCService.newRemote(offer)
             
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  }
  }

  getAnswerCall(){
    if(localStorage.getItem('Auth') == 'tbV8BWE6oHYm1R2B5CdzPqVzpBm1'){
 
      this.api.getAnswerCall().subscribe(
      (data: any)=>{
          this.answer = data
          this.webRTCService.remoteCall(data)
          console.log('ANSWER RECEBIDA NA HOME:', data);
      
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
    }

 /* async startCall() {
    if(localStorage.getItem('Auth') == 'tbV8BWE6oHYm1R2B5CdzPqVzpBm1'){
      const local = await this.webRTCService.initCall();

    if(local){
      this.localStream = local
    }
    const offer = await this.webRTCService.createOffer();

    this.api.sendInviteCall(offer)
    // Enviar a oferta para outro peer via servidor de sinalização (não implementado aqui)
    console.log('Oferta criada:', offer);
    }
    
  }*/

  //captura o invite de chamada
/*  getVoiceCall(){
  
    if(localStorage.getItem('Auth') == 'UtrgzQdujMTqg1l7RooU499Rd5i2'){
    this.api.getvoiceCall().subscribe(
      (data: any)=>{
       
          console.log('Offer received:', data);
          this.answerCall(data); // Processa a oferta recebida 
             
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  }
  }*/

 /* async answerCall(offer: any) {

    if(localStorage.getItem('Auth') == 'UtrgzQdujMTqg1l7RooU499Rd5i2'){

      // Verifica se o peerConnection foi inicializado, caso contrário, inicializa
    if (!this.webRTCService.peerConnection) {
      this.webRTCService.createPeerConnection(); // Crie uma função para inicializar o peerConnection
  }

  // Faz o parsing da oferta recebida
  const parsedOffer = typeof offer === 'string' ? JSON.parse(offer) : offer;
  
  // Processa a oferta e gera uma resposta
  const answer = await this.webRTCService.handleOffer(parsedOffer);
  
  // Envia a resposta de volta para o Peer A
  this.api.sendAnswer(answer);
  console.log('Resposta enviada:', answer);

    }
    
}*/

  //recebe o retorno da resposta (SIM, ACEITAR LIGAÇÃO)
  
 /* 
  }
           
  }

   async handleAnswer(answer: RTCSessionDescriptionInit) {
    console.log('lidando com a resposta da resposta')
    await this.webRTCService.handleAnswer(answer);
  }*/

  }
}
