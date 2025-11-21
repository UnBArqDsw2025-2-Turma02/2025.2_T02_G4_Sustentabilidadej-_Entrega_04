import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Leaf, ArrowLeft, Trophy, Calendar, Target, Coins } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Challenges() {
  const { user } = useAuth();
  const { data: activeChallenges, isLoading: challengesLoading } = trpc.challenges.active.useQuery();
  const { data: userChallenges, isLoading: userChallengesLoading } = trpc.challenges.userChallenges.useQuery();

  const utils = trpc.useUtils();
  const joinChallenge = trpc.challenges.join.useMutation({
    onSuccess: () => {
      toast.success("Você entrou no desafio! Boa sorte! 🎯");
      utils.challenges.userChallenges.invalidate();
      utils.notifications.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!user) {
    return null;
  }

  const userChallengeIds = new Set(userChallenges?.map(uc => uc.challengeId) || []);

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-purple-500';
      case 'monthly': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getChallengeTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'special': return 'Especial';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SustentabilidadeJá</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-6xl">
        {/* Meus Desafios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meus Desafios Ativos</h2>
          {userChallengesLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : userChallenges && userChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {userChallenges.map((uc) => {
                const progress = (uc.targetValue && uc.targetValue > 0) ? (uc.currentProgress / uc.targetValue) * 100 : 0;
                return (
                  <Card key={uc.id} className="border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getChallengeTypeColor(uc.challengeType || 'daily')}>
                          {getChallengeTypeLabel(uc.challengeType || 'daily')}
                        </Badge>
                        {uc.isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Concluído ✓
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{uc.challengeTitle}</CardTitle>
                      <CardDescription>{uc.challengeDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{uc.currentProgress} / {uc.targetValue}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-primary">+{uc.tokensReward} tokens</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Até {uc.endDate ? new Date(uc.endDate).toLocaleDateString('pt-BR') : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Você ainda não está participando de nenhum desafio</p>
                <p className="text-sm text-muted-foreground">Participe dos desafios abaixo para ganhar tokens extras!</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Desafios Disponíveis */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Desafios Disponíveis</h2>
          {challengesLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : activeChallenges && activeChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((challenge) => {
                const isParticipating = userChallengeIds.has(challenge.id);
                return (
                  <Card key={challenge.id} className={isParticipating ? 'opacity-50' : ''}>
                    <CardHeader>
                      <Badge className={getChallengeTypeColor(challenge.type)}>
                        {getChallengeTypeLabel(challenge.type)}
                      </Badge>
                      <CardTitle className="mt-2">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>Meta: {challenge.targetValue} ações</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Até {new Date(challenge.endDate).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Coins className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-primary">+{challenge.tokensReward} tokens</span>
                        </div>

                        <Button
                          className="w-full"
                          disabled={isParticipating || joinChallenge.isPending}
                          onClick={() => joinChallenge.mutate({ challengeId: challenge.id })}
                        >
                          {isParticipating ? 'Já está participando' : 'Participar do Desafio'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum desafio disponível no momento</p>
                <p className="text-sm text-muted-foreground mt-2">Novos desafios em breve!</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
