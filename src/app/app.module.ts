import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StompService, RxStompService } from '@stomp/ng2-stompjs';
import { VoiceCallComponent } from './components/voice-call/voice-call.component';
import { GroupMessageComponent } from './components/group-message/group-message.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FriendAllComponent } from './components/friend-all/friend-all.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        RegisterComponent,
        VoiceCallComponent,
        GroupMessageComponent,
        ChatMessageComponent,
        FriendAllComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        FormsModule,
        FontAwesomeModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })], providers: [
        provideFirebaseApp(() => initializeApp({ "projectId": "apiprofile-b5cc1", "appId": "1:902576521277:web:069ac6091974eaa2cb6a54", "storageBucket": "apiprofile-b5cc1.appspot.com", "apiKey": "AIzaSyCFNE-S1g_gxUFPdgjRcPtxOrhr5M9tllQ", "authDomain": "apiprofile-b5cc1.firebaseapp.com", "messagingSenderId": "902576521277", "measurementId": "G-76QP9T6CS9" })),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        RxStompService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
