# 🗺️ Mapa de Endpoints e DTOs (Backend -> Frontend)

Este documento mapeia todas as rotas, métodos, parâmetros, cabeçalhos de autenticação e estruturas de dados (DTOs) do backend **NestJS** para facilitar a integração com o frontend.

---

## 🔒 Autenticação e Segurança

A aplicação utiliza **JWT (JSON Web Token)** para proteção de rotas.
* A configuração é **global** (`APP_GUARD` com `JwtAuthGuard`).
* Todas as rotas requerem o cabeçalho `Authorization: Bearer <TOKEN>`, **exceto** aquelas explicitamente marcadas com `🔓 Pública`.

---

## 📌 Sumário de Módulos

1. [Autenticação (`/auth`)](#1-autenticação-auth)
2. [Empresas (`/companies`)](#2-empresas-companies)
3. [Clientes (`/customers`)](#3-clientes-customers)
4. [Marcas (`/brands`)](#4-marcas-brands)
5. [Fornecedores (`/suppliers`)](#5-fornecedores-suppliers)
6. [Produtos (`/products`)](#6-produtos-products)
7. [Receitas (`/prescriptions`)](#7-receitas-prescriptions)
8. [Pedidos (`/orders`)](#8-pedidos-orders)
9. [Geral (`/`)](#9-geral-)

---

## 1. Autenticação (`/auth`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | 🔒 Autenticado | Cadastra um novo usuário no sistema |
| `POST` | `/auth/login` | 🔓 Pública | Autentica o usuário e retorna o token JWT |
| `GET` | `/auth/me` | 🔒 Autenticado | Retorna o perfil do usuário logado |

---

### DTOs do Módulo de Autenticação

#### 📂 `CreateUserDto` (Cadastro de Usuário)
Usado no corpo da requisição de `POST /auth/register`.
```typescript
{
  email: string;      // Obrigatório. Formato de e-mail. Ex: "user@example.com"
  username: string;   // Obrigatório. Nome de usuário único. Ex: "john_doe"
  password: string;   // Obrigatório. Senha com mínimo de 6 caracteres. Ex: "strongpassword123"
}
```

#### 📂 `LoginAuthDto` (Login)
Usado no corpo da requisição de `POST /auth/login`.
```typescript
{
  email: string;      // Obrigatório. Formato de e-mail. Ex: "user@example.com"
  password: string;   // Obrigatório. Senha cadastrada. Ex: "strongpassword123"
}
```

---

## 2. Empresas (`/companies`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/companies` | 🔒 Autenticado | Cria uma nova empresa |
| `GET` | `/companies` | 🔒 Autenticado | Lista todas as empresas cadastradas |
| `GET` | `/companies/:id` | 🔒 Autenticado | Obtém detalhes de uma empresa específica pelo ID (UUID) |
| `PATCH`| `/companies/:id` | 🔒 Autenticado | Atualiza dados de uma empresa específica (UUID) |
| `DELETE`| `/companies/:id`| 🔒 Autenticado | Remove uma empresa pelo ID (UUID) |

---

### DTOs do Módulo de Empresas

#### 📂 `CreateCompanyDto`
```typescript
{
  corporateName: string;         // Obrigatório. Razão social. Ex: "Vitreo Corp S/A"
  tradeName?: string;            // Opcional. Nome fantasia. Ex: "Vitreo"
  cnpj: string;                  // Obrigatório. CNPJ apenas números (14 dígitos). Ex: "12345678000199"
  stateRegistration?: string;    // Opcional. Inscrição Estadual. Ex: "123456789"
  mobilePhone?: string;          // Opcional. Celular. Ex: "11999999999"
  landlinePhone?: string;        // Opcional. Telefone fixo. Ex: "1133333333"
  email?: string;                // Opcional. E-mail de contato da empresa. Ex: "contact@vitreo.com"
  logoUrl?: string;              // Opcional. URL do logotipo da empresa.
  street?: string;               // Opcional. Logradouro. Ex: "Av. Paulista"
  number?: string;               // Opcional. Número do endereço. Ex: "1000"
  complement?: string;           // Opcional. Complemento. Ex: "Apt 101"
  neighborhood?: string;         // Opcional. Bairro. Ex: "Bela Vista"
  city?: string;                 // Opcional. Cidade. Ex: "São Paulo"
  state?: string;                // Opcional. Unidade Federativa. Ex: "SP"
  zipCode?: string;              // Opcional. CEP apenas números (8 dígitos). Ex: "01310100"
}
```

#### 📂 `UpdateCompanyDto`
Todos os campos de `CreateCompanyDto`, porém todos se tornam **opcionais** (`PartialType`).

---

## 3. Clientes (`/customers`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/customers` | 🔒 Autenticado | Cria um novo cliente |
| `GET` | `/customers` | 🔒 Autenticado | Lista todos os clientes cadastrados |
| `GET` | `/customers/:id` | 🔒 Autenticado | Obtém detalhes de um cliente específico pelo ID (UUID) |
| `PATCH`| `/customers/:id` | 🔒 Autenticado | Atualiza dados de um cliente específico (UUID) |
| `DELETE`| `/customers/:id`| 🔒 Autenticado | Remove um cliente pelo ID (UUID) |

---

### DTOs do Módulo de Clientes

#### 📂 `CreateCustomerDto`
```typescript
{
  firstName: string;       // Obrigatório. Primeiro nome. Ex: "John"
  lastName: string;        // Obrigatório. Sobrenome. Ex: "Doe"
  email: string;           // Obrigatório. Formato de e-mail. Ex: "john.doe@example.com"
  phone: string;           // Obrigatório. Telefone principal (8 a 20 dígitos). Ex: "11999999999"
  secondaryPhone: string;  // Obrigatório. Telefone secundário. Ex: "11988888888"
  street?: string;         // Opcional. Logradouro. Ex: "Av. Paulista"
  number?: string;         // Opcional. Número. Ex: "1000"
  neighborhood?: string;   // Opcional. Bairro. Ex: "Bela Vista"
  city?: string;           // Opcional. Cidade. Ex: "São Paulo"
  state?: string;          // Opcional. Estado. Ex: "SP"
  zipCode?: string;        // Opcional. CEP (8 a 10 dígitos). Ex: "01310-100"
  birthDate: string;       // Obrigatório. Formato de data (YYYY-MM-DD). Ex: "1990-01-01"
  cpf: string;             // Obrigatório. CPF apenas números (11 dígitos). Ex: "12345678901"
  rg?: string;             // Opcional. Registro Geral (1 a 20 dígitos). Ex: "123456789"
  gender: string;          // Obrigatório. Gênero do cliente. Ex: "Male"
  naturality: string;      // Obrigatório. Naturalidade. Ex: "São Paulo - SP"
  observations: string;    // Obrigatório. Observações ou notas internas.
}
```

#### 📂 `UpdateCustomerDto`
Todos os campos de `CreateCustomerDto`, porém todos se tornam **opcionais** (`PartialType`).

---

## 4. Marcas (`/brands`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/brands` | 🔒 Autenticado | Cria uma nova marca |
| `GET` | `/brands` | 🔒 Autenticado | Lista todas as marcas |
| `GET` | `/brands/:id` | 🔒 Autenticado | Obtém detalhes de uma marca pelo ID (UUID) |
| `PATCH`| `/brands/:id` | 🔒 Autenticado | Atualiza dados de uma marca específica (UUID) |
| `DELETE`| `/brands/:id`| 🔒 Autenticado | Remove uma marca pelo ID (UUID) |

---

### DTOs do Módulo de Marcas

#### 📂 `CreateBrandDto`
```typescript
{
  name: string;        // Obrigatório. Nome da marca. Ex: "Ray-Ban"
  isActive?: boolean;  // Opcional. Indica se a marca está ativa. Padrão: true
}
```

#### 📂 `UpdateBrandDto`
Campos de `CreateBrandDto` como **opcionais** (`PartialType`).

---

## 5. Fornecedores (`/suppliers`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/suppliers` | 🔒 Autenticado | Cria um novo fornecedor |
| `GET` | `/suppliers` | 🔒 Autenticado | Lista todos os fornecedores |
| `GET` | `/suppliers/:id` | 🔒 Autenticado | Obtém detalhes de um fornecedor específico pelo ID (UUID) |
| `PATCH`| `/suppliers/:id` | 🔒 Autenticado | Atualiza dados de um fornecedor específico (UUID) |
| `DELETE`| `/suppliers/:id`| 🔒 Autenticado | Remove um fornecedor pelo ID (UUID) |

---

### DTOs do Módulo de Fornecedores

#### 📂 `CreateSupplierDto`
```typescript
{
  corporateName: string;       // Obrigatório. Razão social do fornecedor. Ex: "Vitreo Corp S/A"
  tradeName?: string;          // Opcional. Nome fantasia. Ex: "Vitreo"
  cnpj: string;                // Obrigatório. CNPJ apenas números (14 dígitos). Ex: "12345678000199"
  stateRegistration?: string;  // Opcional. Inscrição Estadual. Ex: "123456789"
  cellPhone?: string;          // Opcional. Celular do fornecedor. Ex: "11999999999"
  phone?: string;              // Opcional. Telefone fixo. Ex: "1133333333"
  email?: string;              // Opcional. E-mail de contato. Ex: "contact@vitreo.com"
  logoUrl?: string;            // Opcional. URL da logomarca.
  street?: string;             // Opcional. Logradouro. Ex: "Av. Paulista"
  number?: string;             // Opcional. Número do local. Ex: "1000"
  complement?: string;         // Opcional. Complemento. Ex: "Apt 101"
  neighborhood?: string;       // Opcional. Bairro. Ex: "Bela Vista"
  city?: string;               // Opcional. Cidade. Ex: "São Paulo"
  state?: string;              // Opcional. Estado. Ex: "SP"
  zipCode?: string;            // Opcional. CEP apenas números (8 dígitos). Ex: "01310100"
}
```

#### 📂 `UpdateSupplierDto`
Campos de `CreateSupplierDto` como **opcionais** (`PartialType`).

---

## 6. Produtos (`/products`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/products` | 🔒 Autenticado | Cria um novo produto (Armação ou Lente) |
| `GET` | `/products` | 🔒 Autenticado | Lista todos os produtos |
| `GET` | `/products/:id` | 🔒 Autenticado | Obtém detalhes de um produto pelo ID (UUID) |
| `PATCH`| `/products/:id` | 🔒 Autenticado | Atualiza dados de um produto específico (UUID) |
| `DELETE`| `/products/:id`| 🔒 Autenticado | Remove um produto pelo ID (UUID) |

---

### DTOs do Módulo de Produtos

#### 📂 `CreateProductDto`
```typescript
{
  productType: "lens" | "frame"; // Obrigatório. Tipo do produto.
  supplierId: string;            // Obrigatório. UUID do fornecedor associado.
  name: string;                  // Obrigatório. Nome do produto. Ex: "Premium Anti-Reflexive Lens"
  reference?: string;            // Opcional. Código de referência interno. Ex: "LNS-001"
  brandId?: string;              // Opcional. UUID da marca associada.
  barcode?: string;              // Opcional. Código de barras. Ex: "7891234567890"
  cost?: number;                 // Opcional. Preço de custo de compra. Ex: 50.00
  salePrice?: number;            // Opcional. Preço de venda. Ex: 120.00
  stockQuantity?: number;        // Opcional. Quantidade em estoque. Ex: 10
  isActive?: boolean;            // Opcional. Indica se está ativo. Padrão: true
  profitMargin?: number;         // Opcional. Margem de lucro percentual. (APENAS NO RESPONSE, CALCULADO NO BACKEND)

  // Campos específicos para Lente (productType: "lens")
  lensMaterial?: string;         // Opcional. Material da lente. Ex: "Polycarbonate"
  treatment?: string;            // Opcional. Tratamento da lente. Ex: "Anti-glare"
  lensType?: string;             // Opcional. Tipo de visão da lente. Ex: "Single Vision"

  // Campos específicos para Armação (productType: "frame")
  color?: string;                // Opcional. Cor da armação. Ex: "Matte Black"
  material?: string;             // Opcional. Material da armação. Ex: "Acetate"
  size?: string;                 // Opcional. Tamanho da armação. Ex: "54-18-140"
}
```

#### 📂 `UpdateProductDto`
Campos de `CreateProductDto` como **opcionais** (`PartialType`).

---

## 7. Receitas (`/prescriptions`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/prescriptions` | 🔒 Autenticado | Cria uma nova receita |
| `GET` | `/prescriptions` | 🔒 Autenticado | Lista todas as receitas |
| `GET` | `/prescriptions/:id` | 🔒 Autenticado | Obtém detalhes de uma receita pelo ID (UUID) |
| `PATCH`| `/prescriptions/:id` | 🔒 Autenticado | Atualiza dados de uma receita específica (UUID) |
| `DELETE`| `/prescriptions/:id`| 🔒 Autenticado | Remove uma receita pelo ID (UUID) |

---

### DTOs do Módulo de Receitas

#### 📂 `CreatePrescriptionDto`
```typescript
{
  customerId: string;           // Obrigatório. UUID do cliente associado.
  sphericalOd?: number;         // Opcional. Grau Esférico Olho Direito. Ex: 2.25
  cylindricalOd?: number;       // Opcional. Grau Cilíndrico Olho Direito. Ex: -1.50
  axisOd?: number;              // Opcional. Eixo Olho Direito. Ex: 180
  sphericalOe?: number;         // Opcional. Grau Esférico Olho Esquerdo. Ex: 1.75
  cylindricalOe?: number;       // Opcional. Grau Cilíndrico Olho Esquerdo. Ex: -0.75
  axisOe?: number;              // Opcional. Eixo Olho Esquerdo. Ex: 90
  addition?: number;            // Opcional. Adição para perto. Ex: 2.00
  pupillaryDistance?: number;   // Opcional. Distância Pupilar. Ex: 62.5
  dnpOd?: number;               // Opcional. DNP Olho Direito. Ex: 31.00
  dnpOe?: number;               // Opcional. DNP Olho Esquerdo. Ex: 31.50
  opticalCenterOd?: number;     // Opcional. Centro Óptico Olho Direito. Ex: 12.00
  opticalCenterOe?: number;     // Opcional. Centro Óptico Olho Esquerdo. Ex: 12.50
  greaterAngle?: number;        // Opcional. Altura/Maior Ângulo. Ex: 10.00
  bridgeFrame?: number;         // Opcional. Ponte da armação. Ex: 18.00
  verticalAngle?: number;       // Opcional. Ângulo Pantoscópico / Altura Vertical. Ex: 15.00
  doctorName?: string;          // Opcional. Nome do médico oftalmologista. Ex: "Dr. Smith"
  doctorCrm?: string;           // Opcional. CRM do médico. Ex: "123456-SP"
  prescriptionDate?: string;    // Opcional. Data da receita (YYYY-MM-DD). Ex: "2026-05-30"
}
```

#### 📂 `UpdatePrescriptionDto`
Campos de `CreatePrescriptionDto` como **opcionais** (`PartialType`).

---

## 8. Pedidos (`/orders`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | 🔒 Autenticado | Cria um novo pedido |
| `GET` | `/orders` | 🔒 Autenticado | Lista todos os pedidos |
| `GET` | `/orders/:id` | 🔒 Autenticado | Obtém detalhes de um pedido pelo ID (UUID) |
| `PATCH`| `/orders/:id` | 🔒 Autenticado | Atualiza dados de um pedido específico (UUID) |
| `DELETE`| `/orders/:id`| 🔒 Autenticado | Remove um pedido pelo ID (UUID) |

---

### DTOs do Módulo de Pedidos

#### 📂 `CreateOrderItemDto`
Sub-objeto usado em `CreateOrderDto`.
```typescript
{
  productId: string;  // Obrigatório. UUID do produto associado.
  quantity: number;   // Obrigatório. Quantidade do produto. Ex: 2
  unitPrice: number;  // Obrigatório. Preço unitário. Ex: 150.00
}
```

#### 📂 `CreatePaymentDto`
Sub-objeto usado em `CreateOrderDto`.
```typescript
{
  paymentMethod: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BANK_SLIP"; // Obrigatório.
  amountPaid: number;          // Obrigatório. Valor pago na transação. Ex: 100.00
  installments?: number;       // Opcional. Parcelas. Padrão: 1. Ex: 3
}
```

#### 📂 `CreateOrderDto`
```typescript
{
  customerId: string;               // Obrigatório. UUID do cliente associado.
  prescriptionId?: string;          // Opcional. UUID da receita de óculos associada.
  serviceOrder?: number;            // Opcional. Número da Ordem de Serviço (OS). Ex: 10045
  orderDate: string;                // Obrigatório. Data e hora do pedido (ISO String). Ex: "2026-05-30T15:30:00Z"
  deliveryForecastDate?: string;    // Opcional. Previsão de entrega (data/string). Ex: "2026-06-05"
  deliveryDate?: string;            // Opcional. Data efetiva de entrega (data/string). Ex: "2026-06-04"
  frameValue?: number;              // Opcional. Valor das armações. Ex: 150.00
  lensValue?: number;               // Opcional. Valor das lentes. Ex: 300.00
  discount?: number;                // Opcional. Desconto concedido. Padrão: 0. Ex: 50.00
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"; // Obrigatório. Status do pedido.
  observations?: string;            // Opcional. Observações do pedido.
  items: CreateOrderItemDto[];      // Obrigatório. Lista de itens do pedido.
  payments?: CreatePaymentDto[];    // Opcional. Lista de pagamentos do pedido.
}
```

#### 📂 `UpdateOrderDto`
Campos de `CreateOrderDto` como **opcionais** (`PartialType`).

---

## 9. Geral (`/`)

### Tabela de Rotas
| Método | Rota | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | 🔓 Pública | Rota de teste/Healthcheck (Hello World) |
