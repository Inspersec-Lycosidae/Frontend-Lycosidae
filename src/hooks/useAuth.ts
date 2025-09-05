/**
 * Hooks de Autenticação - Lycosidae Frontend
 * Gerenciamento de estado de autenticação com React
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  authService, 
  type User, 
  type RegisterRequest, 
  type LoginRequest,
  validateRegisterData,
  validateLoginData
} from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export interface UseAuthReturn {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Ações
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  
  // Utilitários
  checkAuthStatus: () => void;
}

export interface UseAuthFormReturn<T> {
  // Estado do formulário
  formData: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  
  // Ações
  setFormData: (data: T | ((prev: T) => T)) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  validateForm: () => boolean;
  clearErrors: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  
  // Reset
  resetForm: () => void;
}

/**
 * Hook principal de autenticação
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const checkAuthStatus = useCallback(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (loginData: LoginRequest) => {
    try {
      setIsLoading(true);
      
      // Validar dados
      const validationErrors = validateLoginData(loginData);
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        toast({
          title: 'Dados inválidos',
          description: firstError,
          variant: 'destructive'
        });
        return;
      }

      const loggedUser = await authService.login(loginData);
      setUser(loggedUser);
      
      toast({
        title: 'Login realizado!',
        description: `Bem-vindo(a), ${loggedUser.username}!`,
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro no login',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const register = useCallback(async (registerData: RegisterRequest) => {
    try {
      setIsLoading(true);
      
      // Validar dados
      const validationErrors = validateRegisterData(registerData);
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        toast({
          title: 'Dados inválidos',
          description: firstError,
          variant: 'destructive'
        });
        return;
      }

      const newUser = await authService.register(registerData);
      setUser(newUser);
      
      toast({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo(a), ${newUser.username}!`,
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: 'Erro no registro',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
        variant: 'default'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, [toast]);

  // Verificar status ao montar o componente
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Escutar eventos de login/logout
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      setUser(event.detail);
    };
    
    const handleUserLogout = () => {
      setUser(null);
    };

    window.addEventListener('userLogin', handleUserLogin as EventListener);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin as EventListener);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus
  };
}

/**
 * Hook para formulários de login
 */
export function useLoginForm(onSuccess?: () => void): UseAuthFormReturn<LoginRequest> {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const setFieldValue = useCallback((field: keyof LoginRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const validationErrors = validateLoginData(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ email: '', password: '' });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData);
      resetForm();
      onSuccess?.();
    } catch (error) {
      // Erro já é tratado no hook useAuth
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, login, onSuccess, resetForm, validateForm]);

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setFieldValue,
    validateForm,
    clearErrors,
    handleSubmit,
    resetForm
  };
}

/**
 * Hook para formulários de registro
 */
export function useRegisterForm(onSuccess?: () => void): UseAuthFormReturn<RegisterRequest & { confirmPassword: string }> {
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const setFieldValue = useCallback((field: keyof (RegisterRequest & { confirmPassword: string }), value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    // Validar dados básicos
    const { confirmPassword, ...registerData } = formData;
    const validationErrors = validateRegisterData({
      ...registerData,
      phone_number: registerData.phone_number || undefined
    });

    // Validar confirmação de senha
    if (formData.password !== confirmPassword) {
      validationErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone_number: ''
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { confirmPassword, ...registerData } = formData;
      await register({
        ...registerData,
        phone_number: registerData.phone_number || undefined
      });
      resetForm();
      onSuccess?.();
    } catch (error) {
      // Erro já é tratado no hook useAuth
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, register, onSuccess, resetForm, validateForm]);

  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setFieldValue,
    validateForm,
    clearErrors,
    handleSubmit,
    resetForm
  };
}

/**
 * Hook para verificar se a API está online
 */
export function useApiHealth() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = useCallback(async () => {
    try {
      // Usar proxy local em desenvolvimento
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiUrl}/system/health`);
      setIsOnline(response.ok);
      setLastCheck(new Date());
    } catch (error) {
      setIsOnline(false);
      setLastCheck(new Date());
    }
  }, []);

  useEffect(() => {
    checkApiHealth();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiHealth, 30000);
    
    return () => clearInterval(interval);
  }, [checkApiHealth]);

  return {
    isOnline,
    lastCheck,
    checkHealth: checkApiHealth
  };
}
