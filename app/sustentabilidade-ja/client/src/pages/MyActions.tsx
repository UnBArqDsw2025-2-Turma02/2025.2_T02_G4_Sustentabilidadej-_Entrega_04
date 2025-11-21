import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Leaf, ArrowLeft, Plus, Calendar, Coins, TrendingUp, Filter } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function MyActions() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: actions, isLoading: actionsLoading } = trpc.actions.list.useQuery();
  const { data: stats } = trpc.actions.stats.useQuery();
  const { data: categories } = trpc.actionCategories.list.useQuery();

  if (!user) {
    return null;
  }

  // Filtrar ações por categoria se selecionada
  const filteredActions = selectedCategory
    ? actions?.filter(action => action.categoryName === selectedCategory)
    : actions;

  // Agrupar ações por mês
  const actionsByMonth = filteredActions?.reduce((acc, action) => {
    const date = new Date(action.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        actions: []
      };
    }
    acc[monthKey].actions.push(action);
    return acc;
  }, {} as Record<string, { name: string; actions: NonNullable<typeof actions> }>);

  const monthKeys = actionsByMonth ? Object.keys(actionsByMonth).sort().reverse() : [];

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
          <Link href="/actions/new">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Nova Ação
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8 max-w-6xl">
        {/* Resumo */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalActions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Ações registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tokens Ganhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats?.totalTokens || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Tokens acumulados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impacto Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {((stats?.totalImpact || 0) / 1000).toFixed(1)} kg
              </div>
              <p className="text-xs text-muted-foreground mt-1">CO₂ economizado</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtrar por Categoria</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todas
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Ações */}
        {actionsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredActions && filteredActions.length > 0 ? (
          <div className="space-y-8">
            {monthKeys.map((monthKey) => {
              const monthData = actionsByMonth![monthKey];
              if (!monthData || !monthData.actions) return null;
              const monthTotal = monthData.actions.reduce((sum, a) => sum + a.tokensEarned, 0);
              const monthImpact = monthData.actions.reduce((sum, a) => sum + a.impactValue, 0);

              return (
                <div key={monthKey}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <h2 className="text-xl font-bold">{monthData.name}</h2>
                      <Badge variant="secondary">{monthData.actions.length} ações</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <Coins className="h-4 w-4" />
                        <span>+{monthTotal} tokens</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>{(monthImpact / 1000).toFixed(1)} kg CO₂</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {monthData.actions.map((action) => (
                      <Card key={action.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline">{action.categoryName}</Badge>
                                <Badge 
                                  variant={
                                    action.status === 'approved' ? 'default' :
                                    action.status === 'pending' ? 'secondary' :
                                    'destructive'
                                  }
                                >
                                  {action.status === 'approved' ? 'Aprovada' :
                                   action.status === 'pending' ? 'Pendente' :
                                   'Rejeitada'}
                                </Badge>
                              </div>
                              
                              <h3 className="font-semibold text-lg mb-1">{action.actionTypeName}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {action.actionTypeDescription}
                              </p>

                              {action.notes && (
                                <div className="bg-muted p-3 rounded-lg mb-3">
                                  <p className="text-sm"><strong>Observações:</strong> {action.notes}</p>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(action.createdAt).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right ml-6">
                              <div className="flex items-center gap-2 justify-end mb-2">
                                <Coins className="h-5 w-5 text-primary" />
                                <span className="text-2xl font-bold text-primary">
                                  +{action.tokensEarned}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 justify-end text-sm text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span>{action.impactValue} {action.actionTypeDescription?.includes('CO2') ? 'g CO₂' : 'litros'}</span>
                              </div>
                            </div>
                          </div>

                          {action.proofUrl && (
                            <div className="mt-4 pt-4 border-t">
                              <img 
                                src={action.proofUrl} 
                                alt="Comprovante"
                                className="rounded-lg max-h-48 object-cover"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Leaf className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {selectedCategory ? `Nenhuma ação de ${selectedCategory} registrada` : 'Nenhuma ação registrada'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Comece a fazer a diferença registrando sua primeira ação sustentável!
              </p>
              <Link href="/actions/new">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Registrar Primeira Ação
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
