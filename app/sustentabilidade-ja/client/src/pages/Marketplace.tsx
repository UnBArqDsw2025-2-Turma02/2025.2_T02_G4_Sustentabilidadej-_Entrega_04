import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Leaf, ArrowLeft, ShoppingBag, Coins, Package } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Marketplace() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: stats } = trpc.actions.stats.useQuery();
  const { data: redemptions } = trpc.products.myRedemptions.useQuery();

  const utils = trpc.useUtils();
  const redeemProduct = trpc.products.redeem.useMutation({
    onSuccess: (data) => {
      toast.success(`Produto resgatado com sucesso! Código: ${data.redemptionCode}`);
      setShowRedeemDialog(false);
      setSelectedProduct(null);
      utils.products.list.invalidate();
      utils.products.myRedemptions.invalidate();
      utils.actions.stats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!user) {
    return null;
  }

  const product = products?.find(p => p.id === selectedProduct);
  const userTokens = stats?.totalTokens || 0;

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
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">{userTokens} tokens</span>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-6xl">
        {/* Meus Resgates */}
        {redemptions && redemptions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Meus Resgates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redemptions.slice(0, 3).map((redemption) => (
                <Card key={redemption.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={
                        redemption.status === 'completed' ? 'default' :
                        redemption.status === 'processing' ? 'secondary' :
                        'outline'
                      }>
                        {redemption.status === 'completed' ? 'Concluído' :
                         redemption.status === 'processing' ? 'Processando' :
                         redemption.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{redemption.productName}</CardTitle>
                    <CardDescription>
                      Código: {redemption.redemptionCode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Resgatado em {new Date(redemption.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-sm font-medium text-primary mt-2">
                      {redemption.tokensSpent} tokens gastos
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Produtos Disponíveis */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Produtos Disponíveis</h2>
          {productsLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : products && products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const canAfford = userTokens >= product.tokensCost;
                const hasStock = product.stock > 0;
                
                return (
                  <Card key={product.id} className={!hasStock ? 'opacity-50' : ''}>
                    <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{product.category}</Badge>
                        {!hasStock && <Badge variant="destructive">Sem estoque</Badge>}
                      </div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {product.partnerName && (
                          <div className="text-sm text-muted-foreground">
                            Parceiro: {product.partnerName}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-primary" />
                            <span className="font-bold text-lg text-primary">{product.tokensCost}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.stock} disponíveis
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          disabled={!canAfford || !hasStock || redeemProduct.isPending}
                          onClick={() => {
                            setSelectedProduct(product.id);
                            setShowRedeemDialog(true);
                          }}
                        >
                          {!hasStock ? 'Sem estoque' : 
                           !canAfford ? 'Tokens insuficientes' : 
                           'Resgatar'}
                        </Button>

                        {!canAfford && hasStock && (
                          <p className="text-xs text-center text-muted-foreground">
                            Faltam {product.tokensCost - userTokens} tokens
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto disponível no momento</p>
                <p className="text-sm text-muted-foreground mt-2">Novos produtos em breve!</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Redeem Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Resgate</DialogTitle>
            <DialogDescription>
              Você está prestes a resgatar este produto. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {product && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produto:</span>
                <span className="font-semibold">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custo:</span>
                <span className="font-semibold text-primary">{product.tokensCost} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo atual:</span>
                <span className="font-semibold">{userTokens} tokens</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Saldo após resgate:</span>
                <span className="font-semibold">{userTokens - product.tokensCost} tokens</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => product && redeemProduct.mutate({ productId: product.id })}
              disabled={redeemProduct.isPending}
            >
              {redeemProduct.isPending ? "Resgatando..." : "Confirmar Resgate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
