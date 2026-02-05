import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

/**
 * Landing Page Component
 * Displays the public landing page with features and call-to-action
 * Only visible to unauthenticated users
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  menuOpen = false;
  showSuccessMessage = false;
  contactForm: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private router: Router) {}

  /**
   * Toggle mobile menu
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.menuOpen = false;
  }

  /**
   * Navigate to features page
   */
  navigateToFeatures(): void {
    this.router.navigate(['/features']);
    this.menuOpen = false;
  }

  /**
   * Navigate to how it works page
   */
  navigateToHowItWorks(): void {
    this.router.navigate(['/how-it-works']);
    this.menuOpen = false;
  }

  /**
   * Submit contact form
   */
  submitContactForm(event: Event): void {
    event.preventDefault();
    
    // Validate form
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', this.contactForm);

    // Show success message
    this.showSuccessMessage = true;

    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  /**
   * Close success message
   */
  closeSuccessMessage(): void {
    this.showSuccessMessage = false;
  }
}
