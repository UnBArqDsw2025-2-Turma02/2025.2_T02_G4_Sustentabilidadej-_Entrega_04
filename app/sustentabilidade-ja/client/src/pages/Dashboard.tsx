import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Coins, Leaf, TrendingUp, Award, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = trpc.actions.stats.useQuery();
  const { data: recentActions, isLoading: actionsLoading } = trpc.actions.list.useQuery();
  const { data: activeChallenges, isLoading: challengesLoading } = trpc.challenges.active.useQuery();

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SustentabilidadeJá</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/actions">
              <Button variant="outline">Minhas Ações</Button>
            </Link>
            <Link href="/challenges">
              <Button variant="outline">Desafios</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline">Marketplace</Button>
            </Link>
            <Link href="/community">
              <Button variant="outline">Comunidade</Button>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">{stats?.totalTokens || 0} tokens</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Olá, {user.name}! 👋</h2>
          <p className="text-muted-foreground">Confira seu progresso e continue fazendo a diferença.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Tokens</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.totalTokens || 0}</div>
              <p className="text-xs text-muted-foreground">Disponíveis para resgate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ações Realizadas</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalActions || 0}</div>
              <p className="text-xs text-muted-foreground">Ações sustentáveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Impacto Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((stats?.totalImpact || 0) / 1000).toFixed(1)} kg</div>
              <p className="text-xs text-muted-foreground">CO₂ economizado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nível</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.level || 1}</div>
              <p className="text-xs text-muted-foreground">Continue evoluindo!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Action */}
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nova Ação</CardTitle>
              <CardDescription>Adicione uma ação sustentável que você realizou hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/actions/new">
                <Button className="w-full" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Registrar Ação Sustentável
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle>Desafios Ativos</CardTitle>
              <CardDescription>Participe e ganhe tokens extras</CardDescription>
            </CardHeader>
            <CardContent>
              {challengesLoading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : activeChallenges && activeChallenges.length > 0 ? (
                <div className="space-y-3">
                  {activeChallenges.slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground">+{challenge.tokensReward} tokens</p>
                      </div>
                      <Link href="/challenges">
                        <Button size="sm" variant="outline">Ver</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum desafio ativo no momento
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ações Recentes</CardTitle>
              <CardDescription>Suas últimas contribuições para o planeta</CardDescription>
            </CardHeader>
            <CardContent>
              {actionsLoading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : recentActions && recentActions.length > 0 ? (
                <div className="space-y-3">
                  {recentActions.slice(0, 5).map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{action.actionTypeName}</p>
                        <p className="text-sm text-muted-foreground">{action.categoryName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(action.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">+{action.tokensEarned} tokens</p>
                        <p className="text-xs text-muted-foreground">{action.impactValue} {action.actionTypeDescription?.includes('CO2') ? 'g CO₂' : 'litros'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Você ainda não registrou nenhuma ação</p>
                  <Link href="/actions/new">
                    <Button>Registrar Primeira Ação</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
