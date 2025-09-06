import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service';
import {ModalService} from '../../../services/modal-service';
import {Login} from '../../../interfaces/auth';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  form: FormGroup

  constructor(private readonly authService: AuthService, private fb: FormBuilder, private readonly modalService: ModalService) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  login() {
    try {
      const login: Login = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
      }
      this.authService.login(login)
    }
    catch (e){

    }

  }
}
