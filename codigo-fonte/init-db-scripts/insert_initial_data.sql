-- insert_initial_data.sql

-- Inserir dados iniciais de produtos
INSERT INTO produtos (nome, preco, estoque) VALUES
    ('Teclado', 100.00, 50),
    ('Mouse', 50.00, 100),
    ('Monitor', 700.00, 20),
    ('Placa de Vídeo', 1500.00, 15),
    ('Processador', 1200.00, 10),
    ('Memória RAM 8GB', 300.00, 25),
    ('SSD 512GB', 400.00, 30),
    ('Fonte 500W', 200.00, 20),
    ('Gabinete', 250.00, 10),
    ('Cooler', 80.00, 40);

-- Inserir dados iniciais de vendedores
INSERT INTO vendedores (nome, email) VALUES
    ('Vendedor 1', 'vendedor1@gmail.com'),
    ('Vendedor 2', 'vendedor2@gmail.com');

-- Inserir dados iniciais de clientes
INSERT INTO clientes (nome, email, telefone, endereco) VALUES
    ('JJJ', 'joao@gmail.com', '1111111111', 'Rua A, 123'),
    ('Maria Souza', 'maria@gmail.com', '2222222222', 'Rua B, 456'),
    ('Carlos Lima', 'carlos@gmail.com', '3333333333', 'Rua C, 789'),
    ('Ana Clara', 'ana@gmail.com', '4444444444', 'Rua D, 101'),
    ('Pedro Costa', 'pedro@gmail.com', '5555555555', 'Rua E, 202'),
    ('Luiza Martins', 'luiza@gmail.com', '6666666666', 'Rua F, 303'),
    ('Rafael Oliveira', 'rafael@gmail.com', '7777777777', 'Rua G, 404'),
    ('Juliana Pereira', 'juliana@gmail.com', '8888888888', 'Rua H, 505'),
    ('Roberto Ferreira', 'roberto@gmail.com', '9999999999', 'Rua I, 606'),
    ('Fernanda Alves', 'fernanda@gmail.com', '1010101010', 'Rua J, 707');

-- Inserir dados na tabela vendas
INSERT INTO vendas (produto_id, vendedor_id, cliente_id, quantidade, total) VALUES
    (1, 2, 1, 3, 299.99),   -- Venda de 3 unidades do produto 1, realizada pelo vendedor 2 para o cliente 1, com total de R$ 299,99
    (2, 3, 2, 2, 129.90),   -- Venda de 2 unidades do produto 2, realizada pelo vendedor 3 para o cliente 2, com total de R$ 129,90
    (3, 1, 3, 1, 79.50),    -- Venda de 1 unidade do produto 3, realizada pelo vendedor 1 para o cliente 3, com total de R$ 79,50
    (4, 4, 4, 5, 399.00),   -- Venda de 5 unidades do produto 4, realizada pelo vendedor 4 para o cliente 4, com total de R$ 399,00
    (5, 5, 5, 10, 999.90);  -- Venda de 10 unidades do produto 5, realizada pelo vendedor 5 para o cliente 5, com total de R$ 999,90
