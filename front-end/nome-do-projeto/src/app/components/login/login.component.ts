import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  notValid = false;

  constructor(private auth: AuthService) {}
  login() {
    this.auth.login();
  }

  onSubmit(usuario: string, senha: string) {
    if(usuario === 'paulo' && senha === 'lixo') {
      window.location.href = '/home';
    }
    if(usuario === '' || senha === '') {
      this.notValid = true;
    }
  }
}
