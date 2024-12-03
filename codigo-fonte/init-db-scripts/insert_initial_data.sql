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

INSERT INTO pedidos (data_pedido, status) VALUES 
('2024-12-01 10:00:00', 'pendente'),
('2024-12-01 11:30:00', 'finalizado'),
('2024-12-01 12:45:00', 'cancelado');


INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES 
(1, 1, 2, 100.00),  -- Pedido 1, Teclado, 2 unidades a R$100.00 cada
(1, 2, 1, 50.00),   -- Pedido 1, Mouse, 1 unidade a R$50.00
(2, 3, 5, 700.00),  -- Pedido 2, Monitor, 5 unidades a R$700.00 cada
(2, 6, 3, 300.00),  -- Pedido 2, Memória RAM 8GB, 3 unidades a R$300.00 cada
(3, 7, 2, 400.00),  -- Pedido 3, SSD 512GB, 2 unidades a R$400.00
(3, 8, 4, 200.00);  -- Pedido 3, Fonte 500W, 4 unidades a R$200.00 cada
