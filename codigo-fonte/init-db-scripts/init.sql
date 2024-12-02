CREATE DATABASE IF NOT EXISTS loja_computadores;

USE loja_computadores;

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela vendedores
CREATE TABLE IF NOT EXISTS vendedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255),  -- Novo campo endereco
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Criação da tabela clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255),  -- Novo campo endereco
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Criação da tabela vendas
CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    vendedor_id INT NOT NULL,
    cliente_id INT NOT NULL,
    quantidade INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
