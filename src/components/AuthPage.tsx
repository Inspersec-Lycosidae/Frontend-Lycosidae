import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useLoginForm, useRegisterForm } from "@/hooks/useAuth";
import { ApiNotifications } from "@/components/ApiNotifications";
import { initializeStorage } from "@/utils/storage";
import inspersecLogo from "@/assets/inspersec-logo.png";
import { useState } from "react";

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Hooks para gerenciar os formulários
  const loginForm = useLoginForm(onLogin);
  const registerForm = useRegisterForm(onLogin);

  useEffect(() => {
    initializeStorage();
  }, []);

  // Handlers removidos - agora os hooks cuidam de tudo

  return (
    <>
      <ApiNotifications />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={inspersecLogo} 
              alt="Kairo Logo" 
              className="h-16 w-auto object-contain transition-transform hover:scale-105"
              loading="eager"
            />
          </div>
          <div>
            <h1 className="text-3xl font-code font-bold tracking-tight">
              Kairo
            </h1>
            <p className="text-muted-foreground mt-2">
              Plataforma de Competições de Cibersegurança
            </p>
          </div>
        </div>

        {/* Authentication Forms */}
        <Card className="border-border bg-card transition-glow hover:glow-primary">
          <CardHeader className="space-y-1">
            <CardTitle className="font-code">Acesso à Plataforma</CardTitle>
            <CardDescription>
              Entre com sua conta ou crie uma nova para participar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="login" className="font-code">Login</TabsTrigger>
                <TabsTrigger value="register" className="font-code">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={loginForm.handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@gmail.com"
                      value={loginForm.formData.email}
                      onChange={(e) => loginForm.setFieldValue('email', e.target.value)}
                      className="focus-terminal"
                      required
                    />
                    {loginForm.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.formData.password}
                        onChange={(e) => loginForm.setFieldValue('password', e.target.value)}
                        className="focus-terminal pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {loginForm.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.errors.password}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loginForm.isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 font-code font-medium transition-glow hover:glow-primary disabled:opacity-50"
                  >
                    {loginForm.isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={registerForm.handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="hacker123"
                      value={registerForm.formData.username}
                      onChange={(e) => registerForm.setFieldValue('username', e.target.value)}
                      className="focus-terminal font-code"
                      required
                    />
                    {registerForm.errors.username && (
                      <p className="text-sm text-red-500">{registerForm.errors.username}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      3-50 caracteres, apenas letras, números, _ e -
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="seu@gmail.com"
                      value={registerForm.formData.email}
                      onChange={(e) => registerForm.setFieldValue('email', e.target.value)}
                      className="focus-terminal"
                      required
                    />
                    {registerForm.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.errors.email}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Use domínios permitidos: @gmail.com, @hotmail.com, @outlook.com
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+5511999999999"
                      value={registerForm.formData.phone_number}
                      onChange={(e) => registerForm.setFieldValue('phone_number', e.target.value)}
                      className="focus-terminal"
                    />
                    {registerForm.errors.phone_number && (
                      <p className="text-sm text-red-500">{registerForm.errors.phone_number}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Formato internacional: +5511999999999
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerForm.formData.password}
                        onChange={(e) => registerForm.setFieldValue('password', e.target.value)}
                        className="focus-terminal pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {registerForm.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.errors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Mín. 8 chars, maiúscula, minúscula, número e especial
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerForm.formData.confirmPassword}
                        onChange={(e) => registerForm.setFieldValue('confirmPassword', e.target.value)}
                        className="focus-terminal pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {registerForm.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{registerForm.errors.confirmPassword}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={registerForm.isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 font-code font-medium transition-glow hover:glow-primary disabled:opacity-50"
                  >
                    {registerForm.isSubmitting ? 'Registrando...' : 'Registrar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
};