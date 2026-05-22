-- Script para crear las tablas en la base de datos gestion_pedidos
-- Ejecutar este script después de crear la base de datos
-- Usar: psql -U postgres -d gestion_pedidos -f database/create_tables.sql

-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO')),
    fecha DATE NOT NULL
);

-- Insertar datos de ejemplo
INSERT INTO pedidos (cliente, producto, cantidad, precio, estado, fecha) VALUES
    ('Juan Perez', 'Laptop HP', 1, 899.99, 'COMPLETADO', '2024-01-15'),
    ('Maria Garcia', 'Mouse Inalambrico', 2, 25.50, 'EN_PROCESO', '2024-01-16'),
    ('Carlos Lopez', 'Teclado Mecanico', 1, 89.99, 'PENDIENTE', '2024-01-17'),
    ('Ana Martinez', 'Monitor 24"', 2, 199.99, 'COMPLETADO', '2024-01-18'),
    ('Pedro Sanchez', 'Auriculares Bluetooth', 3, 45.00, 'CANCELADO', '2024-01-19')
ON CONFLICT DO NOTHING;

-- Verificar datos
SELECT * FROM pedidos;
