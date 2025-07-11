import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  notValid = false;

  constructor() {}
  login() {
    window.location.href = 'http://localhost:5000/api/spotify/login';
  }

  onSubmit(usuario: string, senha: string) {
    if(usuario === 'paulo' && senha === 'dev') {
      window.location.href = '/home';
    }
    if(usuario === '' || senha === '') {
      this.notValid = true;
    }
  }
}
