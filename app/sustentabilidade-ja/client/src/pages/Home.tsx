import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Trophy, ShoppingBag, Users, TrendingUp, Award, Recycle, Bus, Zap, Droplet, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { loading } = useAuth();
  const [, setLocation] = useLocation();

  const handleEntrar = () => {
    console.log("Navegando para dashboard..."); // Para debug
    setLocation("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">SustentabilidadeJá</h1>
          </div>
          <Button onClick={handleEntrar}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Leaf className="h-4 w-4" />
            <span>Transforme ações em impacto real</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Ganhe Recompensas por um
            <span className="text-primary"> Mundo Sustentável</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Registre suas ações sustentáveis, ganhe tokens e troque por produtos ecológicos. 
            Junte-se a uma comunidade comprometida com o futuro do planeta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={handleEntrar}>
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#como-funciona">Saiba Mais</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Ações Registradas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5k+</div>
              <div className="text-sm text-muted-foreground">Usuários Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50t</div>
              <div className="text-sm text-muted-foreground">CO₂ Economizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simples, rápido e eficaz. Comece a fazer a diferença hoje mesmo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Registre Ações</CardTitle>
                <CardDescription>
                  Registre suas ações sustentáveis diárias como reciclagem, uso de transporte público e economia de energia.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Ganhe Tokens</CardTitle>
                <CardDescription>
                  Receba tokens como recompensa por cada ação sustentável. Quanto mais você faz, mais você ganha!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Troque Recompensas</CardTitle>
                <CardDescription>
                  Use seus tokens para resgatar produtos sustentáveis, descontos exclusivos e muito mais.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Ações Sustentáveis */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Ações Diversificadas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Múltiplas formas de contribuir para um planeta mais sustentável
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Reciclagem</h3>
                <p className="text-sm text-muted-foreground">Papel, plástico, vidro e metal</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Transporte</h3>
                <p className="text-sm text-muted-foreground">Público, bicicleta, caminhada</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Energia</h3>
                <p className="text-sm text-muted-foreground">Economia e fontes renováveis</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Droplet className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Água</h3>
                <p className="text-sm text-muted-foreground">Uso consciente e reutilização</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <ShoppingCart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Consumo</h3>
                <p className="text-sm text-muted-foreground">Consciente e sustentável</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos da Plataforma</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para sua jornada sustentável
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Trophy className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Sistema de Recompensas</CardTitle>
                <CardDescription>
                  Ganhe tokens por cada ação sustentável registrada e acompanhe seu progresso.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Desafios e Missões</CardTitle>
                <CardDescription>
                  Participe de desafios diários, semanais e mensais para ganhar tokens extras.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Marketplace Verde</CardTitle>
                <CardDescription>
                  Troque seus tokens por produtos sustentáveis e descontos exclusivos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Impacto Mensurado</CardTitle>
                <CardDescription>
                  Visualize o impacto positivo de suas ações no meio ambiente em tempo real.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Impacto Comunitário</CardTitle>
                <CardDescription>
                  Veja o impacto coletivo da comunidade e participe de metas globais.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Parcerias Ecológicas</CardTitle>
                <CardDescription>
                  Rede crescente de parceiros comprometidos com a sustentabilidade.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para Fazer a Diferença?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a milhares de pessoas que já estão transformando o mundo através de ações sustentáveis.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" onClick={handleEntrar}>
            Comece Gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-white">SustentabilidadeJá</span>
              </div>
              <p className="text-sm">
                Transformando ações sustentáveis em recompensas reais.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ações</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Desafios</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Comunidade</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Impacto</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ranking</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Parcerias</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 SustentabilidadeJá. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
