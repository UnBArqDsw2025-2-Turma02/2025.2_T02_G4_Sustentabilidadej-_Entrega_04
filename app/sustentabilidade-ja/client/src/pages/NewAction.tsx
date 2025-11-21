import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Leaf, ArrowLeft, Coins, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function NewAction() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const { data: categories } = trpc.actionCategories.list.useQuery();
  const { data: actionTypes } = trpc.actionTypes.byCategory.useQuery(
    { categoryId: selectedCategory! },
    { enabled: !!selectedCategory }
  );

  const utils = trpc.useUtils();
  const createAction = trpc.actions.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Ação registrada! Você ganhou ${data.tokensEarned} tokens! 🎉`);
      utils.actions.list.invalidate();
      utils.actions.stats.invalidate();
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error("Erro ao registrar ação: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) {
      toast.error("Selecione uma ação");
      return;
    }

    createAction.mutate({
      actionTypeId: selectedAction,
      notes: notes || undefined,
    });
  };

  const selectedActionType = actionTypes?.find(a => a.id === selectedAction);

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

      <main className="container py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>1. Selecione a Categoria</CardTitle>
                <CardDescription>Escolha o tipo de ação sustentável que você realizou</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedAction(null);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCategory === category.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold mb-1">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ação Específica */}
            {selectedCategory && (
              <Card>
                <CardHeader>
                  <CardTitle>2. Selecione a Ação</CardTitle>
                  <CardDescription>Escolha a ação específica que você realizou</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {actionTypes?.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => setSelectedAction(action.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAction === action.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold mb-1">{action.name}</div>
                            <div className="text-sm text-muted-foreground mb-2">{action.description}</div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-primary font-medium">
                                <Coins className="h-4 w-4" />
                                <span>+{action.tokensReward} tokens</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span>{action.impactValue} {action.impactUnit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observações */}
            {selectedAction && (
              <Card>
                <CardHeader>
                  <CardTitle>3. Observações (Opcional)</CardTitle>
                  <CardDescription>Adicione detalhes sobre sua ação sustentável</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Reciclei 5kg de papel do escritório"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resumo e Confirmação */}
            {selectedActionType && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Resumo da Ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ação:</span>
                      <span className="font-semibold">{selectedActionType.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tokens a ganhar:</span>
                      <span className="font-semibold text-primary">+{selectedActionType.tokensReward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impacto:</span>
                      <span className="font-semibold">{selectedActionType.impactValue} {selectedActionType.impactUnit}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link href="/dashboard" className="flex-1">
                      <Button type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={createAction.isPending}
                    >
                      {createAction.isPending ? "Registrando..." : "Confirmar Ação"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
