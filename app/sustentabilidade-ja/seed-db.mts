import { config } from "dotenv";
config(); // Carrega as variáveis do .env

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  actionCategories, 
  actionTypes, 
  challenges, 
  products, 
  badges 
} from "./drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida no arquivo .env");
}

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // 1. Categorias de Ações
    console.log("📁 Inserindo categorias...");
    await db.insert(actionCategories).values([
      { id: 1, name: "Reciclagem", description: "Separação e reciclagem de materiais" },
      { id: 2, name: "Transporte", description: "Uso de transporte sustentável" },
      { id: 3, name: "Energia", description: "Economia e uso consciente de energia" },
      { id: 4, name: "Água", description: "Uso consciente e economia de água" },
      { id: 5, name: "Consumo", description: "Consumo consciente e sustentável" },
    ]);

    // 2. Tipos de Ações
    console.log("⚡ Inserindo tipos de ações...");
    await db.insert(actionTypes).values([
      // Reciclagem
      { categoryId: 1, name: "Reciclagem de Papel", description: "Separação e reciclagem de papel", tokensReward: 10, impactValue: 500, impactUnit: "g CO2" },
      { categoryId: 1, name: "Reciclagem de Plástico", description: "Separação e reciclagem de plástico", tokensReward: 15, impactValue: 700, impactUnit: "g CO2" },
      { categoryId: 1, name: "Reciclagem de Vidro", description: "Separação e reciclagem de vidro", tokensReward: 12, impactValue: 600, impactUnit: "g CO2" },
      { categoryId: 1, name: "Reciclagem de Metal", description: "Separação e reciclagem de metal", tokensReward: 20, impactValue: 900, impactUnit: "g CO2" },
      
      // Transporte
      { categoryId: 2, name: "Uso de Transporte Público", description: "Utilização de ônibus, metrô ou trem", tokensReward: 25, impactValue: 2000, impactUnit: "g CO2" },
      { categoryId: 2, name: "Uso de Bicicleta", description: "Deslocamento de bicicleta", tokensReward: 30, impactValue: 2500, impactUnit: "g CO2" },
      { categoryId: 2, name: "Caminhada", description: "Deslocamento a pé", tokensReward: 20, impactValue: 2000, impactUnit: "g CO2" },
      { categoryId: 2, name: "Carona Solidária", description: "Compartilhamento de veículo", tokensReward: 35, impactValue: 3000, impactUnit: "g CO2" },
      
      // Energia
      { categoryId: 3, name: "Uso de Energia Solar", description: "Utilização de energia solar", tokensReward: 50, impactValue: 5000, impactUnit: "g CO2" },
      { categoryId: 3, name: "Economia de Energia Elétrica", description: "Redução do consumo de energia", tokensReward: 15, impactValue: 1000, impactUnit: "g CO2" },
      { categoryId: 3, name: "Uso de Lâmpadas LED", description: "Substituição por lâmpadas eficientes", tokensReward: 10, impactValue: 800, impactUnit: "g CO2" },
      
      // Água
      { categoryId: 4, name: "Economia de Água no Banho", description: "Redução do tempo de banho", tokensReward: 15, impactValue: 50, impactUnit: "litros" },
      { categoryId: 4, name: "Reutilização de Água", description: "Reuso de água para outras finalidades", tokensReward: 20, impactValue: 100, impactUnit: "litros" },
      { categoryId: 4, name: "Captação de Água da Chuva", description: "Coleta e uso de água pluvial", tokensReward: 40, impactValue: 200, impactUnit: "litros" },
      
      // Consumo
      { categoryId: 5, name: "Compra de Produtos Sustentáveis", description: "Aquisição de produtos ecológicos", tokensReward: 30, impactValue: 1500, impactUnit: "g CO2" },
      { categoryId: 5, name: "Uso de Sacola Reutilizável", description: "Evitar sacolas plásticas descartáveis", tokensReward: 5, impactValue: 100, impactUnit: "g CO2" },
      { categoryId: 5, name: "Compostagem", description: "Compostagem de resíduos orgânicos", tokensReward: 25, impactValue: 1200, impactUnit: "g CO2" },
    ]);

    // 3. Desafios
    console.log("🏆 Inserindo desafios...");
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(challenges).values([
      {
        title: "Desafio Diário: 3 Ações Verdes",
        description: "Complete 3 ações sustentáveis hoje",
        type: "daily",
        targetValue: 3,
        tokensReward: 50,
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      {
        title: "Semana da Reciclagem",
        description: "Recicle pelo menos 5 itens esta semana",
        type: "weekly",
        targetValue: 5,
        tokensReward: 100,
        startDate: today,
        endDate: nextWeek,
      },
      {
        title: "Mês do Transporte Sustentável",
        description: "Use transporte sustentável 20 vezes este mês",
        type: "monthly",
        targetValue: 20,
        tokensReward: 300,
        startDate: today,
        endDate: nextMonth,
      },
    ]);

    // 4. Produtos do Marketplace
    console.log("🛒 Inserindo produtos...");
    await db.insert(products).values([
      {
        name: "Garrafa Reutilizável Eco",
        description: "Garrafa térmica de aço inoxidável 500ml",
        category: "Utensílios",
        tokensCost: 200,
        stock: 50,
      },
      {
        name: "Kit de Talheres Sustentáveis",
        description: "Kit com garfo, faca e colher de bambu",
        category: "Utensílios",
        tokensCost: 150,
        stock: 100,
      },
      {
        name: "Sacola Ecológica Reutilizável",
        description: "Sacola de algodão orgânico",
        category: "Acessórios",
        tokensCost: 100,
        stock: 200,
      },
      {
        name: "Caderno Reciclado",
        description: "Caderno feito com papel reciclado 100 folhas",
        category: "Papelaria",
        tokensCost: 120,
        stock: 80,
      },
      {
        name: "Desconto 20% Loja Parceira",
        description: "Cupom de 20% de desconto em produtos sustentáveis",
        category: "Cupons",
        tokensCost: 300,
        stock: 500,
      },
    ]);

    // 5. Badges
    console.log("🏅 Inserindo badges...");
    await db.insert(badges).values([
      {
        name: "Iniciante Verde",
        description: "Complete sua primeira ação sustentável",
        icon: "🌱",
        requirement: "Registrar 1 ação",
      },
      {
        name: "Eco Warrior",
        description: "Complete 50 ações sustentáveis",
        icon: "⚔️",
        requirement: "Registrar 50 ações",
      },
      {
        name: "Mestre da Reciclagem",
        description: "Recicle 100 itens",
        icon: "♻️",
        requirement: "100 reciclagens",
      },
      {
        name: "Ciclista Sustentável",
        description: "Use bicicleta 30 vezes",
        icon: "🚴",
        requirement: "30 viagens de bike",
      },
      {
        name: "Guardião do Planeta",
        description: "Acumule 1000 tokens",
        icon: "🌍",
        requirement: "1000 tokens",
      },
    ]);

    console.log("✅ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed();
