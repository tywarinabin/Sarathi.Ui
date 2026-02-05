import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Authentication API Response Structures
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: boolean;
  message: string;
  authToken: string;
  email: string;
  expiresIn: number; // Token expiry time in seconds
  tokenType: string; // "Bearer"
  timestamp: string;
}

export interface LoginErrorResponse {
  success: boolean;
  error: string;
  timestamp: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Production-level implementation with proper error handling
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}${environment.apiEndpoint}`;
  private readonly TOKEN_KEY = 'authToken';
  private readonly EMAIL_KEY = 'userEmail';
  private readonly LOGIN_TIME_KEY = 'loginTime';
  private readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';
  private readonly TOKEN_TYPE_KEY = 'tokenType';

  constructor(private http: HttpClient) {
    console.log(`🔧 API URL: ${this.API_URL}`);
    console.log(`🌍 Environment: ${environment.env}`);
  }

  /**
   * Perform login with email and password
   * @param credentials - Email and password
   * @returns Observable of login response
   */
  login(credentials: LoginRequest): Observable<LoginSuccessResponse> {
    return this.http.post<LoginResponse>(this.API_URL, credentials).pipe(
      map(response => this.handleLoginResponse(response)),
      catchError(error => this.handleLoginError(error))
    );
  }

  /**
   * Handle successful login response
   * Stores authentication data in localStorage
   */
  private handleLoginResponse(response: LoginResponse): LoginSuccessResponse {
    if (response.success && 'authToken' in response) {
      const successResponse = response as LoginSuccessResponse;

      // Store authentication data
      localStorage.setItem(this.TOKEN_KEY, successResponse.authToken);
      localStorage.setItem(this.EMAIL_KEY, successResponse.email);
      localStorage.setItem(this.LOGIN_TIME_KEY, successResponse.timestamp);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, successResponse.expiresIn.toString());
      localStorage.setItem(this.TOKEN_TYPE_KEY, successResponse.tokenType);

      console.log('✅ Login successful for:', successResponse.email);
      console.log('🔐 Token expires in:', successResponse.expiresIn, 'seconds');

      return successResponse;
    } else {
      const errorResponse = response as LoginErrorResponse;
      throw new Error(errorResponse.error || 'Login failed');
    }
  }

  /**
   * Handle login error responses
   * Provides user-friendly error messages
   */
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred during login';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
      console.error('❌ Client error:', error.error.message);
    } else {
      // Server-side error
      if (error.status === 401 || error.status === 400) {
        // Unauthorized or Bad Request
        errorMessage =
          error.error?.error || 'Invalid email or password. Please try again.';
        console.warn('⚠️ Authentication failed:', error.error);
      } else if (error.status === 0) {
        // Network error - cannot reach server
        errorMessage = 'Cannot connect to server. Please check your connection.';
        console.error('❌ Network error: Cannot reach server');
      } else if (error.status >= 500) {
        // Server error
        errorMessage = 'Server error. Please try again later.';
        console.error('❌ Server error:', error.status, error.statusText);
      } else {
        errorMessage = error.error?.error || `Login failed (${error.status})`;
        console.error('❌ Login error:', error);
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Check if user has a valid authentication token
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    const expiry = this.getTokenExpiry();

    if (!token) {
      return false;
    }

    // If expiry is set, check if not expired
    if (expiry) {
      const expirySeconds = parseInt(expiry, 10);
      const loginTimeStr = localStorage.getItem(this.LOGIN_TIME_KEY);

      if (loginTimeStr) {
        try {
          const loginTime = new Date(loginTimeStr).getTime();
          const currentTime = Date.now();
          const elapsedSeconds = (currentTime - loginTime) / 1000;

          if (elapsedSeconds > expirySeconds) {
            console.warn('⏱️ Token expired');
            this.clearAuthData();
            return false;
          }
        } catch (error) {
          console.error('Error checking token expiry:', error);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user email
   */
  getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  /**
   * Get token expiry time in seconds
   */
  getTokenExpiry(): string | null {
    return localStorage.getItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Get token type (usually "Bearer")
   */
  getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  /**
   * Get authorization header for API requests
   */
  getAuthorizationHeader(): string {
    const token = this.getToken();
    const tokenType = this.getTokenType() || 'Bearer';
    return token ? `${tokenType} ${token}` : '';
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.LOGIN_TIME_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    console.log('🗑️ Authentication data cleared');
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    console.log('🚪 User logged out');
  }
}
