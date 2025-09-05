/**
 * Serviços de Autenticação - Backend-Lycosidae
 * Baseado na documentação: docs_backend/API_DOCUMENTATION.md
 */

import { apiClient, type ApiError } from '@/lib/api';

// Tipos baseados na documentação da API
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Por enquanto a API só tem register, mas vamos preparar para login futuro
export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  token?: string; // Para quando implementarem JWT
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
}

/**
 * Validações baseadas na documentação da API
 */
export const ValidationRules = {
  username: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Username deve ter 3-50 caracteres, apenas letras, números, _ e -'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email deve ter formato válido com domínio permitido (ex: @gmail.com, @hotmail.com, @outlook.com)'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial'
  },
  phone: {
    pattern: /^\+\d{10,15}$/,
    message: 'Telefone deve estar no formato internacional (+5511999999999)'
  }
} as const;

/**
 * Valida os dados de registro
 */
export function validateRegisterData(data: RegisterRequest): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validar username
  if (!data.username) {
    errors.username = 'Username é obrigatório';
  } else if (data.username.length < ValidationRules.username.minLength || 
             data.username.length > ValidationRules.username.maxLength) {
    errors.username = `Username deve ter entre ${ValidationRules.username.minLength} e ${ValidationRules.username.maxLength} caracteres`;
  } else if (!ValidationRules.username.pattern.test(data.username)) {
    errors.username = ValidationRules.username.message;
  }

  // Validar email
  if (!data.email) {
    errors.email = 'Email é obrigatório';
  } else if (!ValidationRules.email.pattern.test(data.email)) {
    errors.email = ValidationRules.email.message;
  }

  // Validar senha
  if (!data.password) {
    errors.password = 'Senha é obrigatória';
  } else if (data.password.length < ValidationRules.password.minLength) {
    errors.password = `Senha deve ter no mínimo ${ValidationRules.password.minLength} caracteres`;
  } else if (!ValidationRules.password.pattern.test(data.password)) {
    errors.password = ValidationRules.password.message;
  }

  // Validar telefone (opcional)
  if (data.phone_number && !ValidationRules.phone.pattern.test(data.phone_number)) {
    errors.phone_number = ValidationRules.phone.message;
  }

  return errors;
}

/**
 * Valida os dados de login
 */
export function validateLoginData(data: LoginRequest): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email é obrigatório';
  }

  if (!data.password) {
    errors.password = 'Senha é obrigatória';
  }

  return errors;
}

class AuthService {
  /**
   * Registra um novo usuário
   * Rate Limit: 5 requests/minuto
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Limpar dados - remover phone_number se estiver vazio
      const requestData: any = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };

      // Só adicionar phone_number se tiver valor
      if (userData.phone_number && userData.phone_number.trim()) {
        requestData.phone_number = userData.phone_number.trim();
      }

      console.log('🔐 Registrando usuário:', { 
        username: userData.username, 
        email: userData.email,
        hasPhone: !!userData.phone_number 
      });
      console.log('📤 Dados enviados para API:', requestData);

      const response = await apiClient.post<RegisterResponse>('/route/register', requestData);

      console.log('✅ Usuário registrado com sucesso:', response);
      
      // Salvar usuário no localStorage para manter sessão
      this.saveUserSession(response);

      return response;
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      throw this.handleAuthError(error as ApiError, 'registro');
    }
  }

  /**
   * Login do usuário (simulado até a API implementar)
   * TODO: Substituir por endpoint real quando disponível
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Fazendo login:', { email: loginData.email });

      // Por enquanto, simular login já que a API só tem register
      // Futuramente será: await apiClient.post<LoginResponse>('/route/login', loginData);
      
      // Simular resposta baseada no email
      const mockUser: LoginResponse = {
        id: Date.now().toString(),
        username: loginData.email.split('@')[0] || 'user',
        email: loginData.email,
        // token será adicionado quando a API implementar JWT
      };

      console.log('✅ Login simulado com sucesso:', mockUser);
      
      this.saveUserSession(mockUser);
      return mockUser;

    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw this.handleAuthError(error as ApiError, 'login');
    }
  }

  /**
   * Logout do usuário
   */
  logout(): void {
    console.log('🚪 Fazendo logout');
    localStorage.removeItem('lycosidae_user');
    localStorage.removeItem('lycosidae_token');
    
    // Emit evento para componentes reagirem
    window.dispatchEvent(new CustomEvent('userLogout'));
  }

  /**
   * Verifica se o usuário está logado
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user;
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem('lycosidae_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  }

  /**
   * Salva a sessão do usuário
   */
  private saveUserSession(user: RegisterResponse | LoginResponse): void {
    localStorage.setItem('lycosidae_user', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number
    }));

    // Se tiver token (futuro)
    if ('token' in user && user.token) {
      localStorage.setItem('lycosidae_token', user.token);
    }

    // Emit evento para componentes reagirem
    window.dispatchEvent(new CustomEvent('userLogin', { detail: user }));
  }

  /**
   * Trata erros específicos de autenticação
   */
  private handleAuthError(error: ApiError, operation: string): Error {
    if (error.status === 400) {
      return new Error(`Dados inválidos para ${operation}. Verifique os campos.`);
    }
    
    if (error.status === 409) {
      return new Error('Email ou username já está em uso.');
    }
    
    if (error.status === 422) {
      // Erro de validação - usar a mensagem detalhada da API
      if (error.data?.details?.validation_errors) {
        const validationErrors = error.data.details.validation_errors;
        const friendlyErrors = validationErrors.map((err: string) => {
          if (err.includes('Email domain not allowed')) {
            return 'Domínio de email não permitido. Use um email com domínio válido (ex: @gmail.com, @hotmail.com)';
          }
          if (err.includes('username')) {
            return 'Username inválido. Use apenas letras, números, _ e - (3-50 caracteres)';
          }
          if (err.includes('password')) {
            return 'Senha deve ter no mínimo 8 caracteres com maiúscula, minúscula, número e símbolo';
          }
          if (err.includes('email')) {
            return 'Email deve ter formato válido';
          }
          return err;
        });
        return new Error(friendlyErrors.join('. '));
      }
      return new Error('Dados de registro inválidos. Verifique os campos.');
    }
    
    if (error.status === 429) {
      const retryAfter = error.rateLimitInfo?.retry_after || 60;
      return new Error(`Muitas tentativas de ${operation}. Tente novamente em ${retryAfter}s.`);
    }
    
    if (error.status === 500 || error.status === 502) {
      // Verificar se é erro de serviço externo (interpreter)
      if (error.data?.code === 'EXTERNAL_SERVICE_ERROR' || 
          error.message.includes('Interpreter communication error')) {
        return new Error('Sistema temporariamente indisponível. O serviço "interpreter" não está rodando. Contate o administrador.');
      }
      return new Error('Erro interno do servidor. Tente novamente mais tarde.');
    }

    return new Error(error.message || `Erro no ${operation}`);
  }
}

// Instância singleton do serviço de autenticação
export const authService = new AuthService();

// Re-export dos tipos para facilitar importação
export type { User, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse };
