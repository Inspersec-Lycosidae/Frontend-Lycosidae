/**
 * Sistema de Notificações para API - Lycosidae Frontend
 * Trata automaticamente rate limiting, erros de API e feedback do usuário
 */

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Wifi, WifiOff, Clock } from 'lucide-react';
import type { ApiError, RateLimitInfo } from '@/lib/api';

interface ApiErrorDetail {
  error: ApiError;
  response: Response;
  data?: any;
}

interface RateLimitDetail {
  remaining: number;
  limit: number;
}

export function ApiNotifications() {
  const { toast } = useToast();

  useEffect(() => {
    // Handler para erros de API
    const handleApiError = (event: CustomEvent<ApiErrorDetail>) => {
      const { error, response, data } = event.detail;
      
      // Não mostrar notificação para erros já tratados pelos hooks
      if (error.status === 400 || error.status === 409) {
        return;
      }

      let title = 'Erro na API';
      let description = error.message;
      let icon = AlertTriangle;

      switch (error.status) {
        case 401:
          title = 'Não autorizado';
          description = 'Você precisa fazer login novamente.';
          break;
          
        case 403:
          title = 'Acesso negado';
          description = 'Você não tem permissão para esta ação.';
          break;
          
        case 404:
          title = 'Não encontrado';
          description = 'O recurso solicitado não foi encontrado.';
          break;
          
        case 429:
          title = 'Limite de requisições';
          description = `Muitas requisições. ${error.rateLimitInfo ? `Tente novamente em ${error.rateLimitInfo.retry_after}s` : 'Aguarde um momento'}.`;
          icon = Clock;
          break;
          
        case 500:
          title = 'Erro do servidor';
          description = 'Problema interno do servidor. Tente novamente mais tarde.';
          break;
          
        case 503:
          title = 'Serviço indisponível';
          description = 'O servidor está temporariamente indisponível.';
          icon = WifiOff;
          break;
          
        default:
          if (!navigator.onLine) {
            title = 'Sem conexão';
            description = 'Verifique sua conexão com a internet.';
            icon = WifiOff;
          }
      }

      toast({
        title,
        description,
        variant: 'destructive',
        duration: error.status === 429 ? 8000 : 5000, // Rate limit fica mais tempo
      });
    };

    // Handler para avisos de rate limiting
    const handleRateLimitWarning = (event: CustomEvent<RateLimitDetail>) => {
      const { remaining, limit } = event.detail;
      
      if (remaining <= 2) {
        toast({
          title: 'Limite de requisições',
          description: `Apenas ${remaining}/${limit} requisições restantes. Use com moderação.`,
          variant: 'destructive',
          duration: 6000,
        });
      } else if (remaining <= 5) {
        toast({
          title: 'Atenção',
          description: `${remaining}/${limit} requisições restantes.`,
          variant: 'default',
          duration: 4000,
        });
      }
    };

    // Handler para status de conexão
    const handleOnline = () => {
      toast({
        title: 'Conexão restaurada',
        description: 'Você está online novamente.',
        variant: 'default',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      toast({
        title: 'Sem conexão',
        description: 'Você está offline. Algumas funcionalidades podem não funcionar.',
        variant: 'destructive',
        duration: 0, // Não remove automaticamente
      });
    };

    // Registrar event listeners
    window.addEventListener('apiError', handleApiError as EventListener);
    window.addEventListener('rateLimitWarning', handleRateLimitWarning as EventListener);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('apiError', handleApiError as EventListener);
      window.removeEventListener('rateLimitWarning', handleRateLimitWarning as EventListener);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Este componente não renderiza nada visualmente
  return null;
}

/**
 * Hook para mostrar notificações específicas do sistema
 */
export function useSystemNotifications() {
  const { toast } = useToast();

  const showApiHealthWarning = (isOnline: boolean) => {
    if (!isOnline) {
      toast({
        title: 'API indisponível',
        description: 'Não foi possível conectar com o servidor. Verifique se o backend está rodando.',
        variant: 'destructive',
        duration: 8000,
      });
    }
  };

  const showRateLimitExceeded = (retryAfter: number) => {
    toast({
      title: 'Limite excedido',
      description: `Muitas requisições. Aguarde ${retryAfter}s antes de tentar novamente.`,
      variant: 'destructive',
      duration: retryAfter * 1000,
    });
  };

  const showMaintenanceMode = () => {
    toast({
      title: 'Manutenção',
      description: 'O sistema está em manutenção. Tente novamente mais tarde.',
      variant: 'destructive',
      duration: 0, // Não remove automaticamente
    });
  };

  const showUpdateAvailable = () => {
    toast({
      title: 'Atualização disponível',
      description: 'Uma nova versão está disponível. Recarregue a página.',
      variant: 'default',
      duration: 10000,
      action: {
        altText: 'Recarregar',
        onClick: () => window.location.reload()
      }
    });
  };

  return {
    showApiHealthWarning,
    showRateLimitExceeded,
    showMaintenanceMode,
    showUpdateAvailable
  };
}

/**
 * Componente para mostrar status da API na UI
 */
export function ApiStatusIndicator() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        const response = await fetch(`${apiUrl}/system/health`);
        setIsOnline(response.ok);
        setLastCheck(new Date());
      } catch {
        setIsOnline(false);
        setLastCheck(new Date());
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check a cada 30s

    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return null; // Ainda verificando
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span>API Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span>API Offline</span>
        </>
      )}
      {lastCheck && (
        <span className="text-xs">
          Último check: {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

// Re-export dos hooks para facilitar importação
export { useToast } from '@/hooks/use-toast';
