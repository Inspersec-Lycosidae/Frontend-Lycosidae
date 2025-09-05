/**
 * Cliente API para Backend-Lycosidae
 * Base URL: http://localhost:8000
 * Documentação: docs_backend/API_DOCUMENTATION.md
 */

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset_time: number;
  retry_after: number;
}

export interface ApiError extends Error {
  status?: number;
  response?: Response;
  rateLimitInfo?: RateLimitInfo;
  data?: any;
}

class LycosidaeApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8082';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
  }

  /**
   * Faz uma requisição para a API com tratamento completo de erros
   */
  async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Debug logs
    console.log('🌐 API Request:', {
      method: config.method || 'GET',
      url,
      headers: { ...config.headers },
      body: config.body,
      bodyType: typeof config.body
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Verificar headers de rate limiting
      this.checkRateLimit(response);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Para endpoints que não retornam JSON (como alguns DELETEs)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Requisição cancelada por timeout');
      }
      throw error;
    }
  }

  /**
   * Verifica headers de rate limiting e avisa o usuário
   */
  private checkRateLimit(response: Response): void {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const limit = response.headers.get('X-RateLimit-Limit');
    
    if (remaining && parseInt(remaining) < 5) {
      console.warn(`⚠️ Rate Limit: ${remaining}/${limit} requisições restantes`);
      
      // Emit custom event para mostrar notificação na UI
      window.dispatchEvent(new CustomEvent('rateLimitWarning', {
        detail: { remaining: parseInt(remaining), limit: parseInt(limit) }
      }));
    }
  }

  /**
   * Trata respostas de erro da API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData: any = null;

    try {
      errorData = await response.json();
      
      // Tratar erros de validação específicos
      if (response.status === 422 && errorData.details?.validation_errors) {
        const validationErrors = errorData.details.validation_errors;
        errorMessage = `Erro de validação: ${validationErrors.join(', ')}`;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Se não conseguir fazer parse do JSON, usa a mensagem padrão
    }

    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    error.response = response;
    error.data = errorData;

    // Tratamento específico para rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const rateLimitInfo: RateLimitInfo = {
        limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
        remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
        reset_time: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
        retry_after: parseInt(retryAfter || '60')
      };
      
      error.rateLimitInfo = rateLimitInfo;
      error.message = `Rate limit excedido. Tente novamente em ${rateLimitInfo.retry_after}s`;
    }

    // Emit evento para tratamento global de erros
    window.dispatchEvent(new CustomEvent('apiError', {
      detail: { error, response, data: errorData }
    }));

    throw error;
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * Verifica se a API está funcionando
   */
  async healthCheck(): Promise<{
    status: string;
    message: string;
    service: string;
    timestamp: string;
    version: string;
    database_status: string;
  }> {
    return this.get('/system/health');
  }

  /**
   * Obtém informações de rate limiting
   */
  async getRateLimitInfo(): Promise<RateLimitInfo> {
    return this.get('/system/rate-limit/info');
  }

  /**
   * Verifica se a API está online
   */
  async ping(): Promise<{ message: string }> {
    return this.get('/');
  }
}

// Instância singleton do cliente API
export const apiClient = new LycosidaeApiClient();

// Tipos exportados para facilitar o uso em outros módulos
