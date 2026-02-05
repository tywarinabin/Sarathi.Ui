import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Rapid retrieval and response generation powered by advanced algorithms',
      details: [
        'Sub-second query response times',
        'Optimized vector search algorithms',
        'Distributed processing architecture',
        'Real-time data synchronization'  
      ]
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Enterprise-grade security with encrypted data transmission and storage',
      details: [
        'End-to-end encryption',
        'SOC 2 Type II compliance',
        'Role-based access control',
        'Regular security audits'
      ]
    },
    {
      icon: '🧠',
      title: 'Intelligent',
      description: 'AI-powered understanding of context and user intent for better results',
      details: [
        'Advanced NLP capabilities',
        'Context-aware responses',
        'Multi-turn conversation support',
        'Intent recognition'
      ]
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Comprehensive analytics dashboard to track performance and insights',
      details: [
        'Real-time usage metrics',
        'Query performance analysis',
        'User behavior insights',
        'Custom reporting tools'
      ]
    },
    {
      icon: '🔗',
      title: 'Integration',
      description: 'Seamless integration with your existing tools and workflows',
      details: [
        'REST API support',
        'Webhook integrations',
        'Third-party connectors',
        'Custom plugin architecture'
      ]
    },
    {
      icon: '👥',
      title: 'Multi-User',
      description: 'Collaborate with your team in real-time with granular permissions',
      details: [
        'Team workspaces',
        'Granular permissions',
        'Activity tracking',
        'Shared knowledge bases'
      ]
    }
  ];

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
