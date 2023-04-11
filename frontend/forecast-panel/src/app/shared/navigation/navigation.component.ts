import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/data/data.service';
import { IUser } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  user: IUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.authService.LoggedinUser
    .subscribe(
      user => {
        this.user = user;
      }
    );

    let btn = document.getElementById("btn");
    let sidebar = document.querySelector(".sidebar");

    btn.onclick = () => {
      sidebar.classList.toggle("active");
      console.log("salje se?")
      this.dataService.isMenu$.next(true);
    }
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('panelLang');
    this.router.navigate(['/login']);
  }

}
