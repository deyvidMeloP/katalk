import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = ''
  password: string = ''
  userName: string = ''
  passwordConfirm: string = ''
  clickRegister: number = 1
  archiveImage: File | null = null;
  archiveImageStandart: string = "https://cdn-icons-png.flaticon.com/512/456/456212.png"

  constructor(private auth: AuthService){}
  ngOnInit(): void {
    localStorage.clear();
  }

  register(){

    if(this.userName == ''){
      alert("Please enter with your Username")
      return
    }

    
    if(this.archiveImage == null){
      //guarda this.archiveImageStandart
    }

    //deve buscar todos os usuarios e verificar se existe algum com esse username, se sim, retorna, se não continua e registra
   
    /*

    this.auth.register(this.email, this.password, this.userName)
    this.email = ''
    this.password = ''
    this.userName = ''
*/

  }

  nextRegister(){

    
    if(this.email == ''){
      alert("please enter with your Email");
      return;
    }

    if(this.password == '' || this.passwordConfirm == ''){
      alert("please enter with your Password")
      return
    }


    if(this.password != this.passwordConfirm){
      alert("Password different")
      return
    }

    this.clickRegister = 1
    const box = document.querySelector(".box") as HTMLElement
    box.style.backgroundColor = "#F3EBEB"

  }

  insertedImage(file: any){

    this.archiveImage = file.target.files[0]
    const image = document.querySelector(".image_All") as HTMLElement
    alert(file.target.files[0])
    if(this.archiveImage){

      const imageUrl = URL.createObjectURL(this.archiveImage)
      image.style.backgroundImage = `url(${imageUrl})`
      return 
   
    }


    image.style.backgroundImage = "url(https://cdn-icons-png.flaticon.com/512/456/456212.png)"
    //guarda  this.archiveImageStandart
    

    

  }

}
