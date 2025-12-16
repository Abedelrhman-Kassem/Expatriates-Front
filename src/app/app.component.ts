import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CountriesService } from './core/services/coutries.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'expatriates_frontend';
  countriesService = inject(CountriesService);

  private router = inject(Router);

  isLoginPage(): boolean {
    const url = this.router.url;
    return (
      url === '/login' ||
      url === '/student-search' ||
      url.includes('/studentServices/false/')
    );
  }

  ngOnInit(): void {
    initFlowbite();
    this.countriesService.loadCountries();
  }
}
