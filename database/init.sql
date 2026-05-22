-- Script para inicializar la base de datos PostgreSQL

-- Crear base de datos
CREATE DATABASE gestion_pedidos;

-- Conectarse a la base de datos
\c gestion_pedidos;

-- Crear tabla de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO')),
    fecha DATE NOT NULL
);

-- Insertar datos de ejemplo
INSERT INTO pedidos (cliente, producto, cantidad, precio, estado, fecha) VALUES
    ('Juan Pérez', 'Laptop HP', 1, 899.99, 'COMPLETADO', '2024-01-15'),
    ('María García', 'Mouse Inalámbrico', 2, 25.50, 'EN_PROCESO', '2024-01-16'),
    ('Carlos López', 'Teclado Mecánico', 1, 89.99, 'PENDIENTE', '2024-01-17'),
    ('Ana Martínez', 'Monitor 24"', 2, 199.99, 'COMPLETADO', '2024-01-18'),
    ('Pedro Sánchez', 'Auriculares Bluetooth', 3, 45.00, 'CANCELADO', '2024-01-19');

-- Verificar datos
SELECT * FROM pedidos;
