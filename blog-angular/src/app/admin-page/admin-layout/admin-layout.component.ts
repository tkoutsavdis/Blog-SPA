import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit{

  isSmallScreen: boolean = false;
  @ViewChild('drawer') drawer!: MatSidenav;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService:AuthService,
    private router:Router) {

    }

  ngOnInit(): void {
    console.log('AdminLayoutComponent initialized with URL:', this.router.url);
    this.breakpointObserver
      .observe('(max-width: 992px)')
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
      });
  }

  navigate(path:string){
    this.router.navigateByUrl(path).then(()=>{
      if (this.isSmallScreen) {
        this.drawer.close();
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin-page']).then(()=>{
        if (this.isSmallScreen) {
          this.drawer.close();
        }
      }); 
    });
  }
  
}