import { Component, OnInit } from '@angular/core';
import { WebRTCService } from '../../services/web-rtc.service';
import { ApiService } from '../../services/api.service';


type Offer = {type: String} & {sdp: String}
type CancelCall = {status: String} & {uid: String}

@Component({
  selector: 'app-voice-call',
  templateUrl: './voice-call.component.html',
  styleUrl: './voice-call.component.css'
})
export class VoiceCallComponent implements OnInit{

constructor(private webRTCService: WebRTCService, private api: ApiService){

} 
localStream: MediaStream | null = null;
remoteStream: MediaStream | null = null;
candidateA: any
offerRTC: any;
answer: any;
userCall: any;
offer: Offer = {
  'type': '',
  'sdp': ''
}
cancelCall: CancelCall = {
  'status': '',
  'uid': ''
}

nameCall: string = ''
callReceived: boolean = false
callAccept: boolean = false

  ngOnInit(): void { 
   
   this.getOffer()
   this.getAnswerCall()
   this.getCandidate() 
   this.getCandidateofB()
  
  }

  clickCall(mode: String){
    localStorage.setItem('dateCall', this.timeNow())
    const sendUid =  localStorage.getItem('Auth')
    const getUid =  localStorage.getItem('ChatOpen')

    if(sendUid){
      localStorage.setItem('sendCall', sendUid)
    }
    if(getUid){
      localStorage.setItem('getCall', getUid)
    }

    this.callAccept = true
    this.webRTCService.startCall(mode)
    this.answerCancelCall()
 
  }

  timeNow(): string{

    const dateString: any = new Date().toLocaleDateString()
    const dateHours: any = new Date().toLocaleTimeString()
   
    const year = `${dateString[6]}${dateString[7]}${dateString[8]}${dateString[9]}`
    const month =  `${dateString[3]}${dateString[4]}`
    const day = `${dateString[0]}${dateString[1]}`
  
    let format: string = `${year}-${month}-${day}`
     
    const dateFormat: string = `${format}T${dateHours}`
    return dateFormat

  }

  
  getCandidate(){
    this.api.getCandidateofA().subscribe(
      (data: any)=>{
          console.log('Candidatos de A recebidos em B', data);
          this.candidateA = data; // Processa a oferta recebida 
          this.webRTCService.setCandidate(data)
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  
  }

  getCandidateofB(){
    this.api.getCandidateofB().subscribe(
      (data: any)=>{
          console.log('Candidatos de B recebidos em A', data);
          this.candidateA = data; // Processa a oferta recebida
          this.webRTCService.setCandidate(data)
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  
  }

  getOffer(){
    
    this.api.getOffer().subscribe(
      (offer: any)=>{
        console.log('Chamada recebida', offer);
        this.offer = {
          'type': '',
          'sdp': ''
        }
        
        this.offerRTC = {}

        const offerLocal: Offer = {
          'type': offer.type,
          'sdp': offer.sdp
        }
          
        this.offer = offerLocal
        this.offerRTC = offer

        localStorage.setItem('sendCall', this.offerRTC.call.sendUid)
        localStorage.setItem('getCall', this.offerRTC.call.getUid)
        localStorage.setItem('dateCall', this.offerRTC.call.date)
        this.answerCancelCall()
        console.log("sendCall Depois"+ localStorage.getItem("sendCall"))
        this.api.getByUser(`${localStorage.getItem('sendCall')}`).subscribe(
          (data: any)=>{
            this.userCall = data
            this.nameCall = data.userUsername
          }
        )
        this.callReceived = true
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )
  }

  AcceptAnswer(){
    this.callReceived = false
    this.callAccept = true
    console.log("ligação aceita")
    this.webRTCService.newRemote(this.offer)
  }

  refuseAnswer(){
    
    /*const answer: Offer = {
      'type': 'answer',
      'sdp': 'recusada'
    }*/

    //this.api.sendAnswer(answer)
    console.log("ligação recusada")
  }

  getAnswerCall(){
 
      this.api.getAnswerCall().subscribe(
      (data: any)=>{
          this.answer = data
          const answer: Offer = {
            'type': data.type,
            'sdp': data.sdp
          }
          if(answer.sdp.includes('recusada')){
            this.callAccept = false
          }
          console.log('ANSWER RECEBIDA NA HOME:', data);
      
      },
      (err: any)=>{
        console.log("erro ao receber a voiceCall");
      }
    )

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

  closeCall(){
    this.callAccept = false
    this.cancelCall.status = 'cancelado'
    this.cancelCall.uid = `${localStorage.getItem('sendCall')}`
    localStorage.removeItem('getCall')
    localStorage.removeItem('dateCall')
    localStorage.removeItem("sendCall")
   
    this.api.cancelCall(this.cancelCall)
    this.webRTCService.stopMediaStream()
  }

  answerCancelCall(){    
    this.api.answerCancelCall().subscribe(
      (data: any)=>{
        console.log("chamada cancelada"+ data.uid)
        this.callReceived = false
        this.callAccept = false
        localStorage.removeItem('getCall')
        localStorage.removeItem('dateCall')
        localStorage.removeItem("sendCall")
        this.webRTCService.stopMediaStream()
      },
      (err: any)=>{
        console.log("erro ao receber cancelamento de chamada"+ err)
      }
    )

    
  }
}
