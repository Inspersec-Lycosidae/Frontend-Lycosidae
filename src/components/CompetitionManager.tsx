import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trophy, Calendar, Users, X } from "lucide-react";
import { Competition, User } from "@/types";
import { getCompetitionByCode, addUserToCompetition, removeUserFromCompetition, getUserCompetitions } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

interface CompetitionManagerProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onCompetitionChange: () => void;
}

export const CompetitionManager = ({ user, onUserUpdate, onCompetitionChange }: CompetitionManagerProps) => {
  const [competitionCode, setCompetitionCode] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const userCompetitions = getUserCompetitions(user);

  const handleAddCompetition = () => {
    if (!competitionCode.trim()) {
      toast({
        title: "Código inválido",
        description: "Por favor, insira um código de competição válido.",
        variant: "destructive"
      });
      return;
    }

    const competition = getCompetitionByCode(competitionCode);
    if (!competition) {
      toast({
        title: "Competição não encontrada",
        description: "Código de competição inválido ou competição não existe.",
        variant: "destructive"
      });
      return;
    }

    if (user.competitions.includes(competition.id)) {
      toast({
        title: "Já participando",
        description: "Você já está participando desta competição.",
        variant: "destructive"
      });
      return;
    }

    const updatedUser = addUserToCompetition(user, competition.id);
    onUserUpdate(updatedUser);
    onCompetitionChange();
    setCompetitionCode("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sucesso!",
      description: `Você entrou na competição "${competition.name}".`,
    });
  };

  const handleRemoveCompetition = (competitionId: string) => {
    const updatedUser = removeUserFromCompetition(user, competitionId);
    onUserUpdate(updatedUser);
    onCompetitionChange();
    
    toast({
      title: "Removido",
      description: "Você saiu da competição.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-code font-bold">Minhas Competições</h2>
          <p className="text-muted-foreground">
            Gerencie suas competições ativas - {userCompetitions.length} participando
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-code">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Competição
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-code">Entrar em Nova Competição</DialogTitle>
              <DialogDescription>
                Digite o código da competição para participar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="CÓDIGO-DA-COMPETIÇÃO"
                value={competitionCode}
                onChange={(e) => setCompetitionCode(e.target.value.toUpperCase())}
                className="text-center font-code text-lg focus-terminal"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCompetition()}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddCompetition}
                  className="flex-1 bg-primary hover:bg-primary/90 font-code"
                  disabled={!competitionCode.trim()}
                >
                  Entrar na Competição
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="font-code"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {userCompetitions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="font-code mb-2">Nenhuma Competição</CardTitle>
            <CardDescription className="mb-4">
              Você ainda não está participando de nenhuma competição. 
              <br />
              Adicione uma competição para começar!
            </CardDescription>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 font-code"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Competição
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userCompetitions.map((competition) => (
            <Card key={competition.id} className="transition-all hover:scale-105 hover:glow-primary">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-code text-lg mb-1">
                      {competition.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="font-code text-xs">
                        {competition.code}
                      </Badge>
                      {competition.isActive && (
                        <Badge className="bg-success text-success-foreground text-xs">
                          Ativa
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCompetition(competition.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardDescription className="text-sm">
                  {competition.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span className="font-code text-xs">
                      {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3" />
                    <span className="font-code text-xs">Participando</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};