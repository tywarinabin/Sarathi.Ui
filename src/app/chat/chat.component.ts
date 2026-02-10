import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Chat Message Structure
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
}

/**
 * Chat Component
 * Interactive chat interface with Sarathi AI
 * Professional UI with icons and animations
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userMessage = '';
  isLoading = false;
  private destroy$ = new Subject<void>();
  private messageId = 0;

  // AI Configuration
  aiName = 'Sarathi';
  aiGreeting = 'Hello! I\'m Sarathi, your RAG-based intelligence assistant. How can I help you today?';

  constructor() {}

  ngOnInit(): void {
    // Add initial greeting from AI
    this.addMessage({
      id: this.generateMessageId(),
      sender: 'ai',
      message: this.aiGreeting,
      timestamp: new Date()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Send message and get AI response
   */
  sendMessage(): void {
    if (!this.userMessage.trim()) {
      return;
    }

    // Add user message
    this.addMessage({
      id: this.generateMessageId(),
      sender: 'user',
      message: this.userMessage,
      timestamp: new Date()
    });

    const userMessageText = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;

    // Simulate AI response delay
    setTimeout(() => {
      this.addMessage({
        id: this.generateMessageId(),
        sender: 'ai',
        message: this.generateAIResponse(userMessageText),
        timestamp: new Date()
      });
      this.isLoading = false;
    }, 800 + Math.random() * 400);
  }

  /**
   * Add message to chat
   */
  private addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }

  /**
   * Generate AI response (demo - replace with actual API call)
   */
    private generateAIResponse(userMessage: string): string {
      const responses: { [key: string]: string[] } = {
        hello: [
          'Hello! I\'m Sarathi, your intelligent assistant. What would you like to know?',
          'Hi there! I\'m here to help. Feel free to ask me anything!'
        ],
        rag: [
          'RAG (Retrieval-Augmented Generation) combines information retrieval with generative AI to provide accurate, contextually relevant responses. It\'s perfect for knowledge-based systems.',
          'RAG systems retrieve relevant documents and use them to generate responses. This ensures answers are grounded in your data and accurate.'
        ],
        sarathi: [
          'I\'m Sarathi, a RAG-based intelligence platform. I can help you retrieve information, answer questions, and generate insights from your knowledge base.',
          'Sarathi is designed to understand context and provide intelligent responses. Feel free to ask me anything!'
        ],
        help: [
          'I can help you with:\n• Information retrieval\n• Document analysis\n• Question answering\n• Knowledge base queries\n• And much more!\n\nWhat would you like assistance with?',
          'I\'m here to assist! You can ask me questions, and I\'ll provide you with relevant information from my knowledge base.'
        ],
        features: [
          'Some of my key features:\n✓ Fast document retrieval\n✓ Context-aware responses\n✓ Multi-language support\n✓ Real-time processing\n✓ High accuracy',
          'I offer:\n• Lightning-fast searches\n• Intelligent understanding\n• Secure processing\n• Integration capabilities\n• Detailed analytics'
        ],
        chini: [
          'Mahima also known as "Chini" is a sweet and wonderful girl - cute, smart, and deeply passionate about learning. She loves to read books and expand her knowledge. She\'s also very religious and has a lovely, caring nature that brightens everyone\'s day! 📚✨',
          'Ah, Mahima! A beautiful soul who combines intelligence with grace. She\'s always immersed in books and studies, while maintaining her religious values and spreading kindness wherever she goes. Truly inspiring! 🌟📖'
        ]
      };

      const lowerMessage = userMessage.toLowerCase().trim();
      let responseList: string[] = [];

      // Check for exact match first
      if (responses[lowerMessage]) {
        responseList = responses[lowerMessage];
      }
      // Match keywords if no exact match
      else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        responseList = responses['hello'];
      } else if (lowerMessage.includes('rag')) {
        responseList = responses['rag'];
      } else if (lowerMessage.includes('sarathi')) {
        responseList = responses['sarathi'];
      } else if (lowerMessage.includes('help')) {
        responseList = responses['help'];
      } else if (lowerMessage.includes('feature')) {
        responseList = responses['features'];
      } else if (lowerMessage.includes('chini')) {
        responseList = responses['chini'];
      } else {
        responseList = [
          'That\'s an interesting question! Based on my RAG capabilities, I can provide insights on a wide range of topics. Could you provide more details?',
          'I understand your query. Let me analyze this from my knowledge base. Could you elaborate a bit more?',
          'Great question! I\'m processing your request. What specific aspect would you like to explore?'
        ];
      }

      return responseList[Math.floor(Math.random() * responseList.length)];
    }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg-${++this.messageId}-${Date.now()}`;
  }

  /**
   * Scroll to bottom of chat
   */
  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.warn('Could not scroll to bottom:', err);
    }
  }

  /**
   * Handle Enter key
   */
  handleKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
