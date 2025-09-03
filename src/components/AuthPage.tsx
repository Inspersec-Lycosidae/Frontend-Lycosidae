import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { User } from "@/types";
import { saveUser, initializeStorage } from "@/utils/storage";
import inspersecLogo from "@/assets/inspersec-logo.png";

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    initializeStorage();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login - criar usuário temporário para demo
    const user: User = {
      id: Date.now().toString(),
      username: loginData.email.split('@')[0] || 'user',
      email: loginData.email,
      competitions: []
    };
    saveUser(user);
    onLogin();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Senhas não coincidem!");
      return;
    }
    
    const user: User = {
      id: Date.now().toString(),
      username: registerData.username,
      email: registerData.email,
      competitions: []
    };
    saveUser(user);
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={inspersecLogo} 
              alt="Inspersec CTF Logo" 
              className="h-16 w-auto object-contain transition-transform hover:scale-105"
              loading="eager"
            />
          </div>
          <div>
            <h1 className="text-3xl font-code font-bold tracking-tight">
              Inspersec CTF
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
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email ou Usuário</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="focus-terminal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="focus-terminal"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 font-code font-medium transition-glow hover:glow-primary"
                  >
                    Entrar
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="hacker123"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      className="focus-terminal font-code"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="focus-terminal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Senha</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="focus-terminal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="focus-terminal"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 font-code font-medium transition-glow hover:glow-primary"
                  >
                    Registrar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};