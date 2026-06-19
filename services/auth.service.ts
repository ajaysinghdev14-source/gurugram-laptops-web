import { apiClient } from '../lib/api-client';

// We mirror the exact DTO types from the backend!
export interface RegisterDto {
  fullName: string;
  email: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      fullName: string | null;
      email: string;
    };
  };
}

// Matches the exact JSON shape the backend sends on register/login
interface BackendAuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: string;
      status: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

interface BackendRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    fullName?: string | null;
    name?: string | null;
    email: string;
  };
}

interface BackendMeResponse {
  success: boolean;
  message: string;
  userId: string;
  fullName?: string | null;
  email?: string;
  role?: string;
  status?: string;
}

export class AuthService {
  public static async register(data: RegisterDto): Promise<AuthResponse> {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };
    const response = await apiClient.post<BackendRegisterResponse>('/auth/register', payload);
    const user = response.data.data; // Backend sends user directly in data
    return {
      success: response.data.success,
      message: response.data.message,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName || user.name,
          email: user.email,
        }
      }
    };
  }

  public static async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>('/auth/login', data);
    const user = response.data.data.user;
    return {
      success: response.data.success,
      message: response.data.message,
      data: {
        user: {
          id: user.id,
          fullName: user.name,
          email: user.email,
        }
      }
    };
  }

  public static async getMe(): Promise<{ userId: string; fullName: string; email: string; role: 'USER' | 'ADMIN'; status: 'ACTIVE' | 'BANNED' }> {
    const response = await apiClient.get<BackendMeResponse>('/auth/me');
    const data = response.data; // Backend returns flat object for /me
    return {
      userId: data.userId,
      fullName: data.fullName || '',
      email: data.email || '',
      role: data.role as 'USER' | 'ADMIN',
      status: data.status as 'ACTIVE' | 'BANNED',
    };
  }

  public static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  public static async refreshToken(): Promise<void> {
    await apiClient.post('/auth/refresh-token');
  }

  public static async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  }

  public static async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  public static async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  }
}
