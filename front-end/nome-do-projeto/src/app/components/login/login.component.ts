import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  notValid: boolean = false;

  onSubmit(usuario: string, senha: string) {
    if(usuario === 'paulo' && senha === 'lixo') {
      window.location.href = '/home';
    }
    if(usuario === '' || senha === '') {
      this.notValid = true;
    }
  }
}
