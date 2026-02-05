import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent {
  steps = [
    {
      number: 1,
      title: 'Upload Your Documents',
      description: 'Upload documents, PDFs, or connect your data sources to Sarathi',
      icon: '📄',
      details: 'Support for multiple file formats including PDF, DOCX, TXT, and more. Bulk upload capabilities and cloud storage integration.'
    },
    {
      number: 2,
      title: 'Automatic Indexing',
      description: 'Our AI processes and indexes your content using advanced embeddings',
      icon: '🔍',
      details: 'State-of-the-art vector embeddings create semantic representations of your documents for intelligent retrieval.'
    },
    {
      number: 3,
      title: 'Ask Questions',
      description: 'Query your knowledge base in natural language',
      icon: '💬',
      details: 'Simply ask questions as you would to a colleague. No complex query syntax required.'
    },
    {
      number: 4,
      title: 'Get Intelligent Answers',
      description: 'Receive accurate, context-aware responses powered by RAG',
      icon: '🎯',
      details: 'Responses are generated based on your actual documents, with citations and source references.'
    }
  ];

  ragWorkflow = {
    title: 'RAG Architecture',
    steps: [
      { title: 'User Query', description: 'Natural language question' },
      { title: 'Embedding', description: 'Convert query to vector' },
      { title: 'Retrieval', description: 'Find relevant documents' },
      { title: 'Context Assembly', description: 'Prepare context for LLM' },
      { title: 'Generation', description: 'Generate response' },
      { title: 'Response', description: 'Deliver answer to user' }
    ]
  };

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
