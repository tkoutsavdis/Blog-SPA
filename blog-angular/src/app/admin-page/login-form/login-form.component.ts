import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  loginForm:FormGroup;

  constructor(private router:Router,private fb: FormBuilder,private authService:AuthService){
    this.loginForm = this.fb.group({
      'username': new FormControl('',Validators.required),
      'password': new FormControl('',Validators.required)
    });
  }

  login() {
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    this.authService.login(username,password).subscribe({
      
      next: (res)=>{
        this.router.navigate(['/admin-page/home'])
      },
      error: (err) => {
        alert(`Λάθος Όνομα χρήστη ή συνθηματικό`);
      }
    });
  }


  get username(){
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }
}