import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

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
 * Chat API Request Structure
 */
export interface ChatRequest {
  Question: string;
}

/**
 * Chat API Response Structure
 */
export interface ChatResponse {
  answer: string;
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

  // API Configuration
  private readonly CHAT_API_URL = `${environment.apiUrl.replace(/\/$/, '')}/api/questions`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
   * Send message and get AI response from API
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

    // Prepare request payload
    const payload: ChatRequest = {
      Question: userMessageText
    };

    // Get authorization token
    const authHeader = this.authService.getAuthorizationHeader();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader
    });

    // Call API
    this.http.post<ChatResponse>(this.CHAT_API_URL, payload, { headers })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.addMessage({
            id: this.generateMessageId(),
            sender: 'ai',
            message: response.answer,
            timestamp: new Date()
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Chat API error:', error);
          
          let errorMessage = 'I apologize, but I encountered an error processing your request.';
          
          if (error.status === 401) {
            errorMessage = 'Your session has expired. Please log in again.';
          } else if (error.status === 0) {
            errorMessage = 'Cannot connect to the server. Please check your connection.';
          } else if (error.status >= 500) {
            errorMessage = 'The server is experiencing issues. Please try again later.';
          }

          this.addMessage({
            id: this.generateMessageId(),
            sender: 'ai',
            message: errorMessage,
            timestamp: new Date()
          });
          this.isLoading = false;
        }
      });
  }

  /**
   * Add message to chat
   */
  private addMessage(message: ChatMessage): void {
    this.messages.push(message);
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
