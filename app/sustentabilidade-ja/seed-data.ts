import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  actionCategories, 
  actionTypes, 
  challenges, 
  products, 
  badges 
} from "./drizzle/schema";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

// Seed action categories
const categoriesData = [
  { name: "Reciclagem", description: "Ações relacionadas à reciclagem de materiais", icon: "recycle", color: "#10b981" },
  { name: "Transporte", description: "Uso de transporte sustentável", icon: "bus", color: "#3b82f6" },
  { name: "Energia", description: "Economia de energia elétrica", icon: "zap", color: "#f59e0b" },
  { name: "Água", description: "Economia e uso consciente de água", icon: "droplet", color: "#06b6d4" },
  { name: "Consumo", description: "Consumo consciente e sustentável", icon: "shopping-bag", color: "#8b5cf6" },
];

console.log("Inserindo categorias...");
for (const cat of categoriesData) {
  await db.insert(actionCategories).values(cat).onDuplicateKeyUpdate({ set: { name: cat.name } });
}

// Seed action types
const actionTypesData = [
  { categoryId: 1, name: "Reciclar papel", description: "Separar e reciclar papel usado", tokensReward: 10, impactValue: 500, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 1, name: "Reciclar plástico", description: "Separar e reciclar plástico", tokensReward: 15, impactValue: 800, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 1, name: "Reciclar vidro", description: "Separar e reciclar vidro", tokensReward: 12, impactValue: 600, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 1, name: "Reciclar metal", description: "Separar e reciclar metal/alumínio", tokensReward: 20, impactValue: 1000, impactUnit: "g CO2", requiresProof: false, isActive: true },
  
  { categoryId: 2, name: "Usar transporte público", description: "Utilizar ônibus, metrô ou trem", tokensReward: 25, impactValue: 2000, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 2, name: "Ir de bicicleta", description: "Usar bicicleta como meio de transporte", tokensReward: 30, impactValue: 3000, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 2, name: "Caminhar", description: "Ir a pé para destinos próximos", tokensReward: 20, impactValue: 1500, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 2, name: "Carona solidária", description: "Compartilhar carro com outras pessoas", tokensReward: 15, impactValue: 1000, impactUnit: "g CO2", requiresProof: false, isActive: true },
  
  { categoryId: 3, name: "Apagar luzes", description: "Desligar luzes ao sair do ambiente", tokensReward: 5, impactValue: 300, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 3, name: "Desligar aparelhos", description: "Desligar aparelhos da tomada", tokensReward: 10, impactValue: 500, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 3, name: "Usar energia solar", description: "Utilizar energia solar em casa", tokensReward: 50, impactValue: 5000, impactUnit: "g CO2", requiresProof: false, isActive: true },
  
  { categoryId: 4, name: "Banho curto", description: "Tomar banho de até 5 minutos", tokensReward: 15, impactValue: 50, impactUnit: "litros", requiresProof: false, isActive: true },
  { categoryId: 4, name: "Reutilizar água", description: "Reutilizar água da chuva ou lavagem", tokensReward: 20, impactValue: 100, impactUnit: "litros", requiresProof: false, isActive: true },
  { categoryId: 4, name: "Fechar torneira", description: "Fechar torneira ao escovar dentes", tokensReward: 10, impactValue: 30, impactUnit: "litros", requiresProof: false, isActive: true },
  
  { categoryId: 5, name: "Comprar produtos locais", description: "Consumir produtos da região", tokensReward: 25, impactValue: 1500, impactUnit: "g CO2", requiresProof: false, isActive: true },
  { categoryId: 5, name: "Usar sacola reutilizável", description: "Usar sacola própria nas compras", tokensReward: 10, impactValue: 200, impactUnit: "g plástico", requiresProof: false, isActive: true },
  { categoryId: 5, name: "Evitar descartáveis", description: "Não usar copos/talheres descartáveis", tokensReward: 15, impactValue: 300, impactUnit: "g plástico", requiresProof: false, isActive: true },
];

console.log("Inserindo tipos de ações...");
for (const action of actionTypesData) {
  await db.insert(actionTypes).values(action).onDuplicateKeyUpdate({ set: { name: action.name } });
}

// Seed challenges
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date(now);
nextMonth.setMonth(nextMonth.getMonth() + 1);

const challengesData = [
  { 
    title: "Desafio Diário: 3 Ações Verdes", 
    description: "Complete 3 ações sustentáveis hoje", 
    type: "daily" as const, 
    targetValue: 3, 
    tokensReward: 50,
    startDate: now,
    endDate: tomorrow,
    isActive: true
  },
  { 
    title: "Semana da Reciclagem", 
    description: "Recicle pelo menos 5 vezes esta semana", 
    type: "weekly" as const, 
    targetValue: 5, 
    tokensReward: 100,
    startDate: now,
    endDate: nextWeek,
    isActive: true
  },
  { 
    title: "Mês do Transporte Sustentável", 
    description: "Use transporte sustentável 15 vezes este mês", 
    type: "monthly" as const, 
    targetValue: 15, 
    tokensReward: 300,
    startDate: now,
    endDate: nextMonth,
    isActive: true
  },
];

console.log("Inserindo desafios...");
for (const challenge of challengesData) {
  await db.insert(challenges).values(challenge);
}

// Seed products
const productsData = [
  { 
    name: "Garrafa Reutilizável Eco", 
    description: "Garrafa de aço inoxidável 500ml", 
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    tokensCost: 200, 
    category: "Acessórios", 
    stock: 50,
    isActive: true,
    partnerName: "EcoStore"
  },
  { 
    name: "Kit Talheres Reutilizáveis", 
    description: "Kit com garfo, faca, colher e canudo de bambu", 
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
    tokensCost: 150, 
    category: "Utensílios", 
    stock: 100,
    isActive: true,
    partnerName: "EcoStore"
  },
  { 
    name: "Sacola Ecológica Premium", 
    description: "Sacola de algodão orgânico reutilizável", 
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    tokensCost: 100, 
    category: "Acessórios", 
    stock: 200,
    isActive: true,
    partnerName: "GreenBag Co."
  },
  { 
    name: "Desconto 20% - Loja Parceira", 
    description: "Cupom de 20% de desconto em produtos sustentáveis", 
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
    tokensCost: 300, 
    category: "Cupons", 
    stock: 500,
    isActive: true,
    partnerName: "Rede Verde"
  },
  { 
    name: "Muda de Árvore Nativa", 
    description: "Muda de árvore nativa para plantio", 
    imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400",
    tokensCost: 250, 
    category: "Plantas", 
    stock: 75,
    isActive: true,
    partnerName: "Viveiro Sustentável"
  },
];

console.log("Inserindo produtos...");
for (const product of productsData) {
  await db.insert(products).values(product);
}

// Seed badges
const badgesData = [
  { name: "Iniciante Verde", description: "Complete sua primeira ação sustentável", icon: "seedling", requirement: "1 ação" },
  { name: "Eco Warrior", description: "Complete 50 ações sustentáveis", icon: "shield", requirement: "50 ações" },
  { name: "Reciclador Master", description: "Recicle 20 vezes", icon: "recycle", requirement: "20 reciclagens" },
  { name: "Ciclista Urbano", description: "Use bicicleta 15 vezes", icon: "bike", requirement: "15 viagens de bike" },
  { name: "Guardião da Água", description: "Economize 500 litros de água", icon: "droplet", requirement: "500L economizados" },
];

console.log("Inserindo badges...");
for (const badge of badgesData) {
  await db.insert(badges).values(badge).onDuplicateKeyUpdate({ set: { name: badge.name } });
}

console.log("✅ Seed concluído com sucesso!");
await connection.end();
