import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Leaf, ArrowLeft, Users, TrendingUp, Award, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Community() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.community.stats.useQuery();
  const { data: topUsers, isLoading: topUsersLoading } = trpc.community.topUsers.useQuery({ limit: 10 });

  if (!user) {
    return null;
  }

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
        {/* Stats Globais */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Estatísticas Globais</h2>
          {statsLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : stats ? (
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Total de Usuários</CardTitle>
                    <Users className="h-4 w-4 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString('pt-BR')}</div>
                  <p className="text-xs opacity-90 mt-1">Membros ativos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Ações Registradas</CardTitle>
                    <Zap className="h-4 w-4 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalActions.toLocaleString('pt-BR')}</div>
                  <p className="text-xs opacity-90 mt-1">Ações sustentáveis</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Impacto Total</CardTitle>
                    <TrendingUp className="h-4 w-4 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{((stats.totalImpact || 0) / 1000).toFixed(1)} kg</div>
                  <p className="text-xs opacity-90 mt-1">CO₂ economizado</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">Tokens em Circulação</CardTitle>
                    <Award className="h-4 w-4 opacity-90" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalTokensCirculating.toLocaleString('pt-BR')}</div>
                  <p className="text-xs opacity-90 mt-1">Tokens distribuídos</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </section>

        {/* Impacto Equivalente */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Impacto Equivalente</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🌳 Árvores Plantadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats ? Math.floor((stats.totalImpact / 1000) / 21).toLocaleString('pt-BR') : 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Equivalente em árvores que absorveriam o CO₂ economizado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚗 Carros Fora da Rua</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats ? Math.floor((stats.totalImpact / 1000) / 4600).toLocaleString('pt-BR') : 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Carros tirados de circulação por um ano
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Lâmpadas Apagadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {stats ? Math.floor((stats.totalImpact / 1000) * 200).toLocaleString('pt-BR') : 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Horas de lâmpadas LED economizadas
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ranking de Usuários */}
        <section>
          <h2 className="text-2xl font-bold mb-6">🏆 Top 10 Usuários</h2>
          {topUsersLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : topUsers && topUsers.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {topUsers.map((topUser, index) => (
                    <div 
                      key={topUser.id} 
                      className={`p-4 flex items-center gap-4 ${
                        topUser.id === user.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {topUser.name || 'Usuário Anônimo'}
                          {topUser.id === user.id && (
                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Você</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Nível {topUser.level}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-primary">{topUser.tokens} tokens</div>
                        <div className="text-sm text-muted-foreground">
                          {((topUser.totalImpact || 0) / 1000).toFixed(1)} kg CO₂
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
