import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../core/services/auth.service';
import {Router} from '@angular/router';
import {LoginSuccess, Roles} from '../core/models/auth.model';



@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {
  isHidden : boolean = true;
  isError: boolean = false;

  formLogin : FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  @ViewChild('textSwap') textSwap!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  words: string[] = [];
  index = 0;

  constructor(private authService : AuthService, private router : Router) {
  }

  onSubmit() : void {

    this.authService.login(this.formLogin.get('email')?.value, this.formLogin.get('password')?.value).subscribe({
      next: (result) => {
        console.log( (result as LoginSuccess).data.roles );
        const groupe : Roles[] = (result as LoginSuccess).data.roles;
        const roles: number[] = groupe.map(role => role.id_role);
        if(roles.includes(1)){
          this.router.navigate(['admin']);
        } else if (roles.includes(2)){
          this.router.navigate(['professeur']);
        } else if (roles.includes(3)){
          this.router.navigate(['etudiant']);
        }
      },
      error: (err) => {
        console.error(err);
        this.isError = true;
      }
    })


  }

  // PARTIE VISUELLE

  async ngAfterViewInit() {
    await this.initTextLoop();
    this.setupPasswordToggle();
    this.setupInputValidation();
  }

  async getStat() {
    //const result = await fetch('/get-stat');
    //return await result.json();
  }

  async initTextLoop() {
    // const word= await this.getStat();
    // ${word.stat_eleves}
    this.words = [
      `12 étudiants.`,
      `4 Unités d'Enseignement.`,
      `20 Professeurs.`,
      `3 Utilisateurs.`
    ];
    this.type(this.words[this.index]);
  }

  type(word: string) {
    let i = 0;
    const placeholder = this.textSwap.nativeElement;
    placeholder.innerHTML = '';

    const writing = setInterval(() => {
      placeholder.innerHTML += word.charAt(i);
      i++;
      if (i >= word.length) {
        clearInterval(writing);
        setTimeout(() => this.erase(), 1000);
      }
    }, 75);
  }

  erase() {
    const placeholder = this.textSwap.nativeElement;
    const deleting = setInterval(() => {
      placeholder.innerHTML = placeholder.innerHTML.slice(0, -1);
      if (placeholder.innerHTML.length <= 0) {
        clearInterval(deleting);
        this.index = (this.index + 1) % this.words.length;
        this.type(this.words[this.index]);
      }
    }, 25);
  }

  setupPasswordToggle() {
    const toggle = document.getElementById('togglePassword');
    toggle?.addEventListener('click', () => {
      const input = this.passwordInput.nativeElement as HTMLInputElement;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  setupInputValidation() {
    const form = document.querySelector('.formulaire_connexion')!;
    const inputs = form.querySelectorAll('input[required]')!;
    const submitBtn = form.querySelector('.bouton_connexion') as HTMLButtonElement;

    function checkInputs() {
      let allFilled = true;
      submitBtn.style.backgroundColor = '#EF233C';
      submitBtn.style.cursor = 'pointer';

      inputs.forEach(input => {
        if ((input as HTMLInputElement).value.trim() === '') {
          allFilled = false;
          submitBtn.style.backgroundColor = '#444';
          submitBtn.style.cursor = 'not-allowed';
        }
      });

      submitBtn.disabled = !allFilled;
    }

    inputs.forEach(input => {
      input.addEventListener('input', checkInputs);
    });

    checkInputs();
  }
}
