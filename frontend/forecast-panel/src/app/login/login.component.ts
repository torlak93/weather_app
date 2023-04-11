import { Component, OnInit, Type, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { skipWhile, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { IError } from 'src/app/core/models/error.model';
import { AuthService } from '../core/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  returnUrl: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
    ) {
    this.sub = this.authService.isAuthenticated.pipe(
      skipWhile(value => value === null),
      take(1))
      .subscribe(
        authenticated => {

          if (authenticated) {
            setTimeout(() => {
              this.navigate();
            }, 350);
          } else {
            console.log('idi na login');
            this.isStarting = false;
          }

        });
  }

  sub: Subscription;
  error = {} as IError;
  isLoading = false;
  isStarting = true;

  user;

  ngOnInit(): void {

    console.log('LOGIN COMP');

  }

  navigate() {
    this.authService.LoggedinUser.pipe(
      skipWhile(value => value === null),
      take(1))
      .subscribe(user => {
        console.log(user);
        if (user) {
          switch (user.role.toString()) {
            case 'root':
              this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
              this.router.navigateByUrl(this.returnUrl);
              break;
          }
        }
      });
  }

  attemptToLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }

    this.error.message = '';
    this.isLoading = true;

    const {
      userEmail,
      userPassword
    } = loginForm.value;

    this.authService.login(userEmail, userPassword)
      .subscribe(
        response => {
          this.isLoading = false;
          this.navigate();
        },
        err => {
          this.error = err;
          this.isLoading = false;
        }
      );

  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
