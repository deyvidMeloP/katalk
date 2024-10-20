import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { ChatEntity } from '../chat-entity.model';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
type Offer = {type: String} & {sdp: String}

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  streamLocal: any
  public peerConnection: RTCPeerConnection | null = null;
  candidate: any[] = []
  // Configuração para o STUN server

  constructor(private api: ApiService, private http: HttpClient) {
  }

  private url =  "https://katalk-api.onrender.com";
  
  setCandidate(value: any){
    this.candidate.push(value)

  }
//troque a trava, não deve ser em answer, mas sim em adicionar os candidatos, faça enviar a offer, aceitar e sem pausa enviar a resposta e adicionar a resposta, mas ele deve esperar para adicionar a resposta, usa o cancel call pra cancelar a chamada
  startCall(mode: String) {

    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

      this.peerConnection = new RTCPeerConnection(configuration);
  
    this.peerConnection.oniceconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log("ICE Connection State:", this.peerConnection.iceConnectionState);
      }
    };
  
    this.api.getAnswerCall().subscribe(
      (answer: any) => {
        if (!answer.sdp.includes('recusada') && this.peerConnection) {
          const remoteDescription = new RTCSessionDescription(answer);
          console.log("remotedescription criado")
          this.peerConnection.setRemoteDescription(remoteDescription);
          this.candidate.forEach(el=> this.handleRemoteCandidate(el))
        } else if (this.peerConnection) {
          this.stopMediaStream();
        }
      },
      (err: any) => {
        console.log("Erro ao receber a offer", err);
      }
    );
  
    
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Enviando candidato ICE...A");
        this.api.sendCandidate(event.candidate); // Envia o candidato ICE

      } else {
        console.log("Todos os candidatos ICE foram enviados.");
      }
    };
  
    // Ao receber o stream remoto
    this.peerConnection.ontrack = (event) => {
      console.log("on track chamdao")
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
  
      // Exibir o vídeo e o áudio remotos
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
  
      const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement;
      if (remoteAudio) {
        remoteAudio.srcObject = remoteStream;
      }
    };
  
    // Caso o modo seja apenas áudio
    if (mode.includes('audio')) {
      navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        .then((stream) => {
          console.log('Apenas microfone capturado:', stream);
          this.streamLocal = stream;
          stream.getTracks().forEach((track) => {
            if (this.peerConnection) {
              this.peerConnection.addTrack(track, stream);
            }
          });
  
          console.log("Criando oferta...");
          this.createOffer();
        })
        .catch((error) => {
          console.error('Erro ao capturar microfone:', error);
        });
    }
  
    // Caso o modo seja vídeo e áudio
    else if (mode.includes('video')) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log('Câmera e microfone capturados:', stream);
          this.streamLocal = stream;
          stream.getTracks().forEach((track) => {
            if (this.peerConnection) {
              this.peerConnection.addTrack(track, stream);
            }
          });
  
          console.log("Criando oferta...");
          this.createOffer();
        })
        .catch((error) => {
          console.error('Erro ao capturar câmera e microfone:', error);
        });
    }
  }
  

stopMediaStream() {
  if (this.streamLocal) {
    this.streamLocal.getTracks().forEach((track: { stop: () => any; }) => track.stop());
    this.streamLocal = null;
  }


  const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
  if (remoteVideo) {
    const stream = remoteVideo.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    remoteVideo.srcObject = null;
  }

  if (this.peerConnection) {
    this.peerConnection.close();
    console.log("ICE Connection State cancel:", this.peerConnection.iceConnectionState);
    this.candidate = []
    this.peerConnection = null;  
  }

  const audioElement = document.getElementById('remoteAudio') as HTMLAudioElement;
  if (audioElement) {
    audioElement.srcObject = null;
  }

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
          console.log("sendCall"+ localStorage.getItem("sendCall"))

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
  
    // Enviar candidatos ICE para o peer A
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Enviando candidatos ICE de B");
        this.api.sendCandidateofB(event.candidate); // Enviar candidato ICE via WebSocket
      }
    };
  
    // Adicionando os streams remotos ao vídeo remoto
    this.peerConnection.ontrack = (event) => {
      console.log("ontrack chamado")
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
  
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
  
      const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement;
      if (remoteAudio) {
        remoteAudio.srcObject = remoteStream;
      }
    };
  
    // Processa a oferta recebida
    if (offerSdp.type === 'offer' && offerSdp.sdp) {
      const remoteDescription = new RTCSessionDescription(offerSdp);
  
      // Configura a descrição remota e cria a resposta
      await this.peerConnection.setRemoteDescription(remoteDescription);
      const answer = await this.peerConnection.createAnswer();
      
      // Define a descrição local com a resposta e a envia para o peer A
      await this.peerConnection.setLocalDescription(answer);
      console.log("remote e local criados")
      this.api.sendAnswer(answer);
      setTimeout(() => {
        this.candidate.forEach(el => this.handleRemoteCandidate(el))
      }, 10);
    } else {
      console.error("Oferta SDP inválida: ", offerSdp);
    }
  
    // Captura o stream local de vídeo e áudio
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log('Câmera e microfone capturados:', stream);
        stream.getTracks().forEach((track) => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, stream); // Adiciona a track de vídeo e áudio
          }
        });

      })
      .catch((error) => {
        console.error('Erro ao capturar a câmera e microfone:', error);
      });
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

/*handleRemoteCandidate(data: any) {
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
}*/
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

