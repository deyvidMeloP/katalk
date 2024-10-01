import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { ChatEntity } from '../chat-entity.model';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  public peerConnection: RTCPeerConnection | null = null;
  // Configuração para o STUN server

  constructor(private api: ApiService) {}

  
  startCall() {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
  
    this.peerConnection = new RTCPeerConnection(configuration);
    
    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log("ICE Connection State:", this.peerConnection.iceConnectionState);
      }
    };
  
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Enviando candidato ICE...");
        this.api.sendCandidate(event.candidate); // Envia o candidato ICE
      } else {
        console.log("Todos os candidatos ICE foram enviados.");
      }
    };
  
    this.peerConnection.ontrack = (event) => {
      const remoteStream = new MediaStream();
      remoteStream.addTrack(event.track);
      const audioElement = document.getElementById('remoteAudio') as HTMLAudioElement;
      if (audioElement) {
        audioElement.srcObject = remoteStream;
      }
    };
  
    // Captura a mídia do usuário (áudio e vídeo)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log('Câmera e microfone capturados:', stream);
        stream.getTracks().forEach((track) => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, stream);
          }
        });
  
        // Exibe o vídeo local (para o usuário ver a si mesmo)
        const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = stream;
        }
  
        // Chama o createOffer agora que a conexão e a mídia estão configuradas
        console.log("Criando oferta...");
        this.createOffer(); // A chamada aqui está correta
      })
      .catch((error) => {
        console.error('Erro ao capturar a câmera e microfone:', error);
      });
  }
  
  createOffer() {
    if (this.peerConnection) {
      this.peerConnection.createOffer()
        .then((offer) => {
          console.log("Oferta criada:", offer);
          return this.peerConnection!.setLocalDescription(offer);
        })
        .then(() => {
          console.log("Descrição local definida.");
          // Enviar a oferta para o outro peer
          this.api.sendOffer(this.peerConnection!.localDescription);
        })
        .catch((error) => {
          console.error('Erro ao criar oferta:', error);
        });
    } else {
      console.error("peerConnection não está inicializada.");
    }
  }
  

async newRemote(offerSdp: any) {
  if (!this.peerConnection) {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    this.peerConnection = new RTCPeerConnection(configuration);
  }

  this.peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Candidatos ICE de B");
      // Enviar o candidato ICE para o peer A via WebSocket
      this.api.sendCandidateofB(event.candidate);
    }
  };
  

  if (offerSdp.type === 'offer' && offerSdp.sdp) {
    const remoteDescription = new RTCSessionDescription(offerSdp);

    this.peerConnection.setRemoteDescription(remoteDescription)
   
        const answer = await this.peerConnection.createAnswer()
    
        this.peerConnection.setLocalDescription(answer);
        this.api.sendAnswer(answer);
     
  } else {
    console.error("Oferta SDP inválida: ", offerSdp);
  }

  
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    console.log('Câmera e microfone capturados:', stream);
    stream.getTracks().forEach((track) => {
      if(this.peerConnection)
      this.peerConnection.addTrack(track, stream); // Adiciona a track de vídeo e áudio
    });

    // Exibe o vídeo local (para o usuário ver a si mesmo)
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  })
  .catch((error) => {
    console.error('Erro ao capturar a câmera e microfone:', error);
  });
  
    // Adicionar o fluxo de mídia local (áudio) ao PeerConnection
   /* navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
      if(this.peerConnection){

        console.log('Track adicionada:', track);
      this.peerConnection.addTrack(track, stream);
      
      }
      });
    });*/

}


remoteCall(answer: any){
  if(this.peerConnection)
  this.peerConnection.setRemoteDescription(answer)
  .then(() => {
    console.log('Answer aplicada no lado A como descrição remota');
  });
}

handleRemoteCandidate(data: any) {
 // Supondo que você receba o corpo do WebRTCMessage como string
  if (this.peerConnection && data.candidate) {
    const rtcCandidate = new RTCIceCandidate({
      candidate: data.candidate.candidate,
      sdpMid: data.candidate.sdpMid,
      sdpMLineIndex: data.candidate.sdpMLineIndex
    });

    this.peerConnection.addIceCandidate(rtcCandidate)
      .then(() => {
        console.log('Candidato ICE remoto adicionado com sucesso');
      })
      .catch((error) => {
        console.error('Erro ao adicionar candidato ICE:', error);
      });
  } else {
    console.log("Candidato ICE inválido ou conexão peer não estabelecida.");
  }
}



    // Conecte-se ao servidor de sinalização
    /*
    this.signalingSubject = webSocket('ws://localhost:8081');

    // Escute mensagens do servidor de sinalização
    this.signalingSubject.subscribe(message => {
      if (message.type === 'offer') {
        this.handleOffer(message.offer);
      } else if (message.type === 'answer') {
        this.handleAnswer(message.answer);
      } else if (message.type === 'ice-candidate') {
        this.addIceCandidate(message.candidate);
      }
    });
 

  async initCall() {
    try {
      console.log("initcall etapa 1")
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.peerConnection = new RTCPeerConnection(this.configuration);

      // Adiciona o stream local à conexão peer-to-peer
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
      console.log("initcall etapa 2")
      this.peerConnection.ontrack = (event) => {
        console.log('Recebendo stream remoto', event.streams[0]);
        const audioElement = document.createElement('audio');
        audioElement.srcObject = event.streams[0];
        audioElement.play();
      };

      this.peerConnection.onicecandidate = (event) => {
        console.log("initcall etapa 3 candidatos")
        if (event.candidate) {
          console.log('Novo candidato ICE', event.candidate);
          this.signalingSubject.next({
            type: 'ice-candidate',
            candidate: event.candidate
          });
        }
      };

      return this.localStream;
    } catch (error) {
      return console.error('Erro ao acessar o microfone:', error);
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection) {
        try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("Candidato ICE adicionado com sucesso");
        } catch (error) {
            console.error("Erro ao adicionar candidato ICE:", error);
        }
    }
}

/*async createOffer() {
  if (this.peerConnection) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.signalingSubject.next({
      type: 'offer',
      offer: offer
    });
    console.log('createoffer')
    return offer;
  }
  return console.log("Erro ao criar oferta");
}*/
/*
async createOffer() {
  if(this.peerConnection){

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.signalingSubject.next({
        type: 'offer',
        sdp: offer.sdp, // SDP enviada corretamente
        candidate: offer.type
    });
    console.log('Offer sent:', offer);
    return offer
    
  }
  return console.log('erro ao criar a offer')
 
  
}


async handleOffer(offer: any) {
  console.log("Received offer:", offer);

  if (this.peerConnection) {
      try {
          const sessionDescription = new RTCSessionDescription({
              sdp: offer.sdp, // Usando o SDP diretamente
              type: offer.type
          });

          await this.peerConnection.setRemoteDescription(sessionDescription);

          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          return answer;
      } catch (error) {
          console.error("Erro ao processar a oferta:", error);
      }
  } else {
      return console.error("Erro: PeerConnection não foi estabelecida.");
  }
}







  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }


  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);
    this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Novo candidato ICE', event.candidate);
            this.signalingSubject.next({
                type: 'ice-candidate',
                candidate: event.candidate
            });
        }
    };

    this.peerConnection.ontrack = (event) => {
        console.log('Recebendo stream remoto', event.streams[0]);
        const audioElement = document.createElement('audio');
        audioElement.srcObject = event.streams[0];
        audioElement.play();
        };
        
  */
  }

