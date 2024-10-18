
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { getAuth } from "firebase/auth";
import { user, User } from '@angular/fire/auth'; // Verifique se esta importação está correta
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router, private api: ApiService, private http: HttpClient) { }

   private url = 'https://katalk-api.onrender.com'

  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email, password).then(()=>{

      localStorage.setItem('toker', 'true')
      localStorage.setItem('login', 'logado')
      localStorage.setItem('email', email)

      const auth = getAuth()

      const uidUser = auth.currentUser
     if(uidUser){
      localStorage.setItem('Auth', uidUser.uid)
     }
     
     
      this.router.navigate(['/home'])
    }, err =>{

      alert("Login Wrong")
      this.router.navigate(['/login'])
    })
  }

  register(email: string, password: string, userName: string){

    this.fireauth.createUserWithEmailAndPassword(email, password).then((el)=>{
      
    const username = el.user

    if(username){

      username.updateProfile({
        displayName: userName
      }).then(()=>{
       
        let userAll: any[] = [] 
       
        this.api.getAllUser().subscribe(
          (data: any[])=>{
         
            userAll = data;

            if(userAll.length == 0){
              this.putNewRegister(1, email, userName)
            }
            else{
              this.putNewRegister((userAll[userAll.length - 1].userId) + 1, email, userName)
            }
          },
          (error: any[])=>{
            console.log('erro ao obter os usuários')
          }
        )
        
        this.router.navigate(['/login'])
      
      }).catch(err =>{
          alert("Error updating profile");
          console.error(err);
      })

    }
    this.router.navigate(['/login'])
      
    },
  err=>{
    alert("erro ao registrar")
    this.router.navigate(['/register'])
  })
  }

  putNewRegister(id: number, email: string, username: string){
    const auth = getAuth();
    const uidUser = auth.currentUser;

    let user;
    const url = `${this.url}/register/${id}`;
    
    if (uidUser) {
        user = {
            userId: id,  // Inclui o userId no payload
            userEmail: email,
            userUid: uidUser.uid,
            userUsername: username,
            userStatus: 0
        };
        
        this.api.putNewRegister(url, user).subscribe(
            () => {
                console.log("Dados enviados com sucesso!");
            },
            error => {
                console.error('Erro ao atualizar valor de visitas:', error);
            }
        );
    }
}

  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('Auth')
      localStorage.removeItem('toker');
      localStorage.removeItem('login')
      this.router.navigate(['/login'])

    }, err =>{
      alert(err.message)
    })
  }

  getUser(): Promise<string | null>{

    return this.fireauth.currentUser.then((user)=>{
 
      return user ? user.displayName : null
 
    })

  }
 

  getId(){

    const auth = getAuth()
    const user = auth.currentUser;

    if(user !== null){

      const uid = user.uid;

    }


  }
}
