import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Trophy, 
  Settings, 
  LogOut, 
  Lock, 
  Globe, 
  Code, 
  HelpCircle,
  CheckCircle,
  Clock,
  Wrench,
  Target
} from "lucide-react";
import inspersecLogo from "@/assets/inspersec-logo.png";
import { CompetitionManager } from "@/components/CompetitionManager";
import { User, Challenge, Competition } from "@/types";
import { 
  initializeStorage, 
  getUser, 
  clearUser, 
  getUserCompetitions, 
  getChallengesByCompetition, 
  updateChallenge,
  getRankingByCompetition
} from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("competitions");
  const [selectedCompetition, setSelectedCompetition] = useState<string>("");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userCompetitions, setUserCompetitions] = useState<Competition[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    initializeStorage();
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      loadUserData(currentUser);
    }
  }, []);

  const loadUserData = (currentUser: User) => {
    const competitions = getUserCompetitions(currentUser);
    setUserCompetitions(competitions);
    
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0].id);
    }
  };

  useEffect(() => {
    if (selectedCompetition) {
      const competitionChallenges = getChallengesByCompetition(selectedCompetition);
      setChallenges(competitionChallenges);
    }
  }, [selectedCompetition]);

  const handleLogout = () => {
    clearUser();
    onLogout();
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    loadUserData(updatedUser);
  };

  const handleCompetitionChange = () => {
    if (user) {
      loadUserData(user);
    }
  };

  const handleChallengeClick = (challengeId: number) => {
    updateChallenge(challengeId, { solved: !challenges.find(c => c.id === challengeId)?.solved });
    if (selectedCompetition) {
      const updatedChallenges = getChallengesByCompetition(selectedCompetition);
      setChallenges(updatedChallenges);
    }
    
    toast({
      title: "Desafio atualizado!",
      description: "Status do desafio foi alterado.",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Web": return <Globe className="h-4 w-4" />;
      case "Crypto": return <Lock className="h-4 w-4" />;
      case "Rev": return <Code className="h-4 w-4" />;
      case "Pwn": return <Shield className="h-4 w-4" />;
      case "Forensics": return <HelpCircle className="h-4 w-4" />;
      case "Misc": return <Target className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Web": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Crypto": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rev": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Pwn": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Forensics": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Misc": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-primary mb-4 animate-pulse" />
          <h2 className="text-xl font-code">Carregando...</h2>
        </div>
      </div>
    );
  }

  const currentCompetition = userCompetitions.find(c => c.id === selectedCompetition);
  const ranking = selectedCompetition ? getRankingByCompetition(selectedCompetition) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={inspersecLogo} 
              alt="Inspersec CTF Logo" 
              className="h-8 w-auto object-contain transition-transform hover:scale-105"
              loading="eager"
            />
            <h1 className="text-xl font-code font-bold">Inspersec CTF</h1>
            {currentCompetition && (
              <Badge variant="outline" className="font-code">
                {currentCompetition.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground font-code">
              Olá, {user.username}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="font-code"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-secondary mb-6">
            <TabsTrigger value="competitions" className="font-code">
              <Target className="h-4 w-4 mr-2" />
              Competições
            </TabsTrigger>
            <TabsTrigger value="exercises" className="font-code" disabled={!selectedCompetition}>
              <Shield className="h-4 w-4 mr-2" />
              Exercícios
            </TabsTrigger>
            <TabsTrigger value="ranking" className="font-code" disabled={!selectedCompetition}>
              <Trophy className="h-4 w-4 mr-2" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="toolbox" className="font-code">
              <Wrench className="h-4 w-4 mr-2" />
              Toolbox
            </TabsTrigger>
            <TabsTrigger value="account" className="font-code">
              <Settings className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
          </TabsList>

          {/* Competitions Tab */}
          <TabsContent value="competitions">
            <CompetitionManager 
              user={user} 
              onUserUpdate={handleUserUpdate}
              onCompetitionChange={handleCompetitionChange}
            />
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-code font-bold">Desafios</h2>
                {currentCompetition && (
                  <p className="text-muted-foreground">{currentCompetition.name}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {userCompetitions.length > 1 && (
                  <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                    <SelectTrigger className="w-[200px] font-code">
                      <SelectValue placeholder="Selecionar competição" />
                    </SelectTrigger>
                    <SelectContent>
                      {userCompetitions.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id} className="font-code">
                          {comp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Badge variant="outline" className="font-code">
                  {challenges.filter(c => c.solved).length}/{challenges.length} Resolvidos
                </Badge>
              </div>
            </div>
            
            {challenges.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="font-code mb-2">Nenhum Desafio Disponível</CardTitle>
                  <CardDescription>
                    Selecione uma competição ou aguarde novos desafios serem adicionados.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenges.map((challenge) => (
                  <Card 
                    key={challenge.id} 
                    className={`transition-all hover:scale-105 cursor-pointer ${
                      challenge.solved ? 'status-solved glow-success' : 'status-unsolved'
                    }`}
                    onClick={() => handleChallengeClick(challenge.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(challenge.category)}
                          <CardTitle className="font-code text-lg">{challenge.name}</CardTitle>
                        </div>
                        {challenge.solved && (
                          <CheckCircle className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(challenge.category)}>
                          {challenge.category}
                        </Badge>
                        <span className="font-code text-sm text-primary font-bold">
                          {challenge.points} pts
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-code font-bold">Classificação</h2>
                {currentCompetition && (
                  <p className="text-muted-foreground">{currentCompetition.name}</p>
                )}
              </div>
              {userCompetitions.length > 1 && (
                <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                  <SelectTrigger className="w-[200px] font-code">
                    <SelectValue placeholder="Selecionar competição" />
                  </SelectTrigger>
                  <SelectContent>
                    {userCompetitions.map((comp) => (
                      <SelectItem key={comp.id} value={comp.id} className="font-code">
                        {comp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-code">Posição</th>
                        <th className="text-left p-4 font-code">Team/Usuário</th>
                        <th className="text-left p-4 font-code">Pontuação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((entry) => (
                        <tr 
                          key={entry.position}
                          className={`border-b border-border/50 ${
                            entry.team === user.username ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-code font-bold text-primary">
                                #{entry.position}
                              </span>
                              {entry.position <= 3 && (
                                <Trophy className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-code">{entry.team}</td>
                          <td className="p-4 font-code font-bold">{entry.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Toolbox Tab */}
          <TabsContent value="toolbox" className="space-y-6">
            <h2 className="text-2xl font-code font-bold">Ferramentas CTF</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-code">Conversor de Texto</CardTitle>
                  <CardDescription>Base64, Hex, Binary, URL Encode/Decode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Texto para converter..." className="font-code" />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="font-code">Base64</Button>
                    <Button variant="outline" size="sm" className="font-code">Hex</Button>
                    <Button variant="outline" size="sm" className="font-code">Binary</Button>
                    <Button variant="outline" size="sm" className="font-code">URL</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-code">Identificador de Hash</CardTitle>
                  <CardDescription>Identifica tipos de hash automaticamente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Cole o hash aqui..." className="font-code" />
                  <Button className="w-full bg-primary hover:bg-primary/90 font-code">
                    Identificar
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-code">Links Úteis</CardTitle>
                  <CardDescription>Ferramentas externas para CTF</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" className="font-code">CyberChef</Button>
                    <Button variant="outline" size="sm" className="font-code">GDB Online</Button>
                    <Button variant="outline" size="sm" className="font-code">Regex101</Button>
                    <Button variant="outline" size="sm" className="font-code">HashCat</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <h2 className="text-2xl font-code font-bold">Configurações da Conta</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-code">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome de Usuário</label>
                      <Input defaultValue={user.username} className="font-code" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue={user.email} disabled />
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 font-code">
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-code">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-code font-bold text-primary">
                        {userCompetitions.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Competições Ativas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-code font-bold text-success">
                        {challenges.filter(c => c.solved).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Desafios Resolvidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-code font-bold text-warning">
                        {challenges.reduce((acc, c) => c.solved ? acc + c.points : acc, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Pontos Totais</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};