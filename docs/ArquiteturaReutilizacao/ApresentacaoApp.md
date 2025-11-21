<!-- Documento de Apresentação do Aplicativo SustentabilidadeJá -->
# SustentabilidadeJá – Guia de Funcionamento para Todos os Usuários

> Este documento explica de forma simples e completa como usar o aplicativo SustentabilidadeJá, seja você um visitante curioso, um novo usuário buscando engajamento sustentável ou um administrador da plataforma.

---
## 1. Visão Geral
O SustentabilidadeJá é uma plataforma que transforma ações sustentáveis em recompensas digitais. Cada atitude positiva (reciclar, economizar água, usar transporte público, reduzir energia etc.) gera Tokens que podem ser trocados por produtos, benefícios e incentivos dentro do ecossistema da aplicação.

**Objetivos principais:**
- Incentivar hábitos sustentáveis no dia a dia.
- Mensurar o impacto ambiental coletivo e individual.
- Criar um sistema de recompensas justo e transparente.
- Engajar comunidade e parceiros verdes.

---
## 2. Perfis de Usuário
| Perfil | O que pode fazer |
|--------|------------------|
| Visitante | Explorar páginas públicas, conhecer o conceito, ver alguns dados gerais. |
| Usuário Autenticado | Registrar ações, participar de desafios, acumular Tokens, trocar itens, ver seu impacto. |
| Administrador | Gerenciar tipos de ações, aprovar conteúdo, acompanhar estatísticas avançadas, moderar comunidade. |

---
## 3. Como Funciona (Fluxo Básico)
1. Acesse o site e faça login (OAuth) ou continue explorando como visitante.
2. Navegue até "Minhas Ações" ou "Nova Ação".
3. Escolha o tipo de ação sustentável (ex.: Reciclar papel, Economizar água).
4. Registre a ação (com ou sem prova, conforme exigido).
5. Receba Tokens e veja o impacto ambiental contabilizado (ex.: CO₂ evitado, litros de água poupados).
6. Acompanhe seu progresso em desafios e badges.
7. Visite o Marketplace para trocar Tokens por recompensas.

---
## 4. Principais Recursos
| Recurso | Descrição | Benefícios |
|---------|-----------|------------|
| Registro de Ações | Cadastro rápido de ações sustentáveis. | Gamificação e engajamento contínuo. |
| Tokens | Moeda virtual ganho por ação validada. | Incentivo a repetir comportamentos positivos. |
| Impacto Mensurável | Conversão da ação em métricas (CO₂, água, energia). | Consciência ambiental clara. |
| Desafios | Metas temporárias (ex.: 5 reciclagens semanais). | Motivação adicional e recompensas extras. |
| Badges | Conquistas por marcos (ex.: 100 ações). | Reconhecimento visual do progresso. |
| Marketplace | Troca de Tokens por produtos/benefícios. | Recompensa concreta ao usuário. |
| Notificações | Alertas de novas conquistas, desafios e ações aprovadas. | Feedback instantâneo. |
| Ranking / Comunidade | Visualização de top usuários por impacto. | Competição saudável e inspiração. |
| IA Assistida | Chat e recursos inteligentes (ex.: dicas sustentáveis). | Suporte para aprendizado contínuo. |

---
## 5. Começando Agora
### 5.1 Acesso
- Abra o aplicativo (URL institucional ou local dev `http://localhost:3000`).
- Clique em Entrar (OAuth). Se for seu primeiro acesso, uma conta será criada automaticamente.

### 5.2 Navegação Base
- Dashboard: visão geral de impacto e resumo de Tokens.
- Minhas Ações: histórico das ações já registradas.
- Nova Ação: formulário para registrar algo novo.
- Desafios: lista dos desafios ativos e progresso.
- Marketplace: catálogo de recompensas disponíveis.
- Comunidade: ranking e estatísticas globais.

---
## 6. Sistema de Tokens
| Aspecto | Detalhe |
|---------|---------|
| Geração | Cada ação validada concede Tokens conforme sua categoria. |
| Uso | Gasto no Marketplace para resgatar produtos ou benefícios. |
| Balanceamento | Ações mais impactantes geram mais Tokens, evitando inflacionar valores simples. |
| Segurança | Atualizações de Tokens auditadas (logs internos). |

### Boas Práticas
- Registre ações reais e com prova quando solicitado.
- Acompanhe seu saldo antes de tentar resgates.
- Use Tokens estratégicamente em desafios para maximizar ganhos futuros.

---
## 7. Desafios e Badges
**Desafios**: Metas limitadas por tempo (ex.: "Reduzir consumo de água 5 vezes na semana").

**Badges**: Concedidos por marcos (ex.: "Primeira Ação", "50 Reciclagens", "Impacto Ouro").

| Tipo | Exemplo | Benefício |
|------|---------|-----------|
| Desafio Diário | 2 ações de reciclagem hoje | Engajamento contínuo |
| Desafio Semanal | Economizar 10 litros de água | Recompensa em Tokens bônus |
| Badge Inicial | Primeira ação registrada | Motivação inicial |
| Badge Progresso | 100 ações totais | Reconhecimento e status |

---
## 8. Marketplace
### Como Usar
1. Abra a página Marketplace.
2. Escolha um item disponível (ex.: produto sustentável, desconto parceiro).
3. Confirme o resgate se tiver Tokens suficientes.
4. Receba o código ou confirmação dentro da sua conta.

### Regras
- Itens podem ter estoque limitado.
- Alguns resgates exigem verificação manual.
- Tokens gastos não são devolvidos (exceto falha de entrega). 

---
## 9. Privacidade & Segurança
- Dados mínimos armazenados (openId, nome, e-mail se fornecido).
- Sessões protegidas por JWT assinado (expiração configurada).
- Ações não aprovadas não geram Tokens definitivos.
- Mecanismos de validação e sanidade de input (Zod, verificação de formatos).

---
## 10. Acessibilidade
- Layout responsivo (mobile/desktop).
- Contraste otimizado com tema claro/escuro.
- Componentes baseados em Radix UI (foco e navegação por teclado consistentes).
- Texto alternativo previsto para imagens e ícones principais.

---
## 11. Perguntas Frequentes (FAQ)
| Pergunta | Resposta |
|----------|----------|
| Preciso pagar para usar? | Não. Uso básico gratuito. |
| Posso perder Tokens? | Apenas ao resgatar itens ou em caso de fraude comprovada. |
| Posso registrar ações antigas? | Recomendado registrar próximas ao momento real para evitar rejeição. |
| Como funcionam provas? | Upload ou referência que valide a ação (quando exigido). |
| O que acontece se o banco estiver offline? | O sistema usa dados mock para navegação, mas ações reais aguardam reconexão para persistir. |

---
## 12. Vídeo de Apresentação
Assista à demonstração completa do aplicativo (fluxo de uso, registro de ações, desafios e marketplace):

[▶️ Ver no YouTube – SustentabilidadeJá](https://youtu.be/ONSV-FCXaQs)

<div align="center">
	<!-- Espaço reservado para embed (caso a plataforma permita iframe) -->
	<!-- Exemplo: <iframe width="560" height="315" src="https://www.youtube.com/embed/ONSV-FCXaQs" title="Demonstração SustentabilidadeJá" frameborder="0" allowfullscreen></iframe> -->
</div>

---
## 13. Próximos Passos
- Expandir catálogo do Marketplace com parceiros adicionais.
- Implementar sistema avançado de reputação do usuário.
- Adicionar badges sazonais (ex.: Campanha Semana do Meio Ambiente).
- Recursos de comparação de impacto entre períodos.
- Notificações push em dispositivos móveis.

---
## 14. Contato & Suporte
| Canal | Uso |
|-------|-----|
| Issues GitHub | Reportar bugs e sugerir melhorias |
| Documentação Técnica | Consultar arquitetura e padrões |
| Comunidade | Interação e feedback rápido |

---
## 15. Resumo Rápido (Cola do Usuário)
| Ação | Onde Fazer |
|------|------------|
| Ver saldo de Tokens | Dashboard |
| Registrar nova ação | "Nova Ação" |
| Participar de desafio | Página "Desafios" |
| Resgatar recompensa | Marketplace |
| Ver histórico | "Minhas Ações" |
| Ganhar badges | Automaticamente ao atingir marcos |

---

## Histórico de Versões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 2025-11-21 | [Davi Emanuel](https://github.com/daviRolvr) e [Gustavo Gontijo Lima](https://github.com/Guga301104) | Explicação do APP |