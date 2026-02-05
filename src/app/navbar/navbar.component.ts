import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  navigateToFeatures(): void {
    this.router.navigate(['/features']);
    this.closeMenu();
  }

  navigateToHowItWorks(): void {
    this.router.navigate(['/how-it-works']);
    this.closeMenu();
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
    this.closeMenu();
  }

  scrollToSection(sectionId: string): void {
    this.closeMenu();
    
    // If not on landing page, navigate first
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scroll(sectionId), 100);
      });
    } else {
      this.scroll(sectionId);
    }
  }

  private scroll(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}