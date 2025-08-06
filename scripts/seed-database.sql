-- Insertar categorías
INSERT INTO categorias (descripcion, isActivo) VALUES
('Whey Protein', true),
('Proteína Vegetal', true),
('Caseína', true),
('Creatina', true),
('Aminoácidos', true);

-- Insertar sabores
INSERT INTO sabores (descripcion) VALUES
('Chocolate'),
('Vainilla'),
('Fresa'),
('Cookies & Cream'),
('Plátano'),
('Sin Sabor'),
('Mango'),
('Café');

-- Insertar productos
INSERT INTO productos (nombre, descripcion, precio, categoria, cantidad_stock, isActivo, isOferta, url_imagen, sabores) VALUES
('Whey Protein Isolate Premium', 'Proteína de suero aislada de máxima pureza y absorción rápida. Ideal para post-entrenamiento.', 89990, 1, 50, true, true, '/placeholder.svg?height=400&width=400&text=Whey+Isolate', ARRAY[1, 2, 3]),

('Whey Protein Concentrate', 'Proteína de suero concentrada con excelente relación calidad-precio. Perfecta para principiantes.', 59990, 1, 75, true, true, '/placeholder.svg?height=400&width=400&text=Whey+Concentrate', ARRAY[1, 2, 4]),

('Hydrolyzed Whey Protein', 'Proteína hidrolizada de absorción ultra rápida para atletas elite. Máximo rendimiento.', 119990, 1, 25, true, false, '/placeholder.svg?height=400&width=400&text=Hydrolyzed+Whey', ARRAY[6, 1]),

('Plant Protein Vegetal', 'Proteína vegetal premium de múltiples fuentes naturales. 100% vegana y sostenible.', 69990, 2, 40, true, true, '/placeholder.svg?height=400&width=400&text=Plant+Protein', ARRAY[1, 3, 7]),

('Plant Protein Chocolate', 'Deliciosa proteína vegetal con sabor a chocolate intenso. Rica en aminoácidos esenciales.', 74990, 2, 30, true, false, '/placeholder.svg?height=400&width=400&text=Plant+Chocolate', ARRAY[1]),

('Casein Protein Nocturna', 'Proteína de liberación lenta ideal para recuperación nocturna. Mantiene los músculos nutridos toda la noche.', 79990, 3, 35, true, true, '/placeholder.svg?height=400&width=400&text=Casein+Protein', ARRAY[2, 4]),

('Creatina Monohidrato', 'Creatina pura micronizada para aumentar fuerza y potencia. Respaldada por la ciencia.', 39990, 4, 100, true, false, '/placeholder.svg?height=400&width=400&text=Creatina', ARRAY[6]),

('BCAA 2:1:1', 'Aminoácidos de cadena ramificada en proporción óptima. Previene el catabolismo muscular.', 49990, 5, 60, true, true, '/placeholder.svg?height=400&width=400&text=BCAA', ARRAY[3, 7, 8]),

('Whey Protein Gold', 'Nuestra proteína más premium con enzimas digestivas. Sabor excepcional y máxima calidad.', 99990, 1, 20, true, false, '/placeholder.svg?height=400&width=400&text=Whey+Gold', ARRAY[1, 2, 4, 5]),

('Plant Protein Mango', 'Proteína vegetal con delicioso sabor tropical a mango. Rica en fibra y antioxidantes.', 72990, 2, 25, true, true, '/placeholder.svg?height=400&width=400&text=Plant+Mango', ARRAY[7]);

-- Actualizar secuencias (si es necesario)
SELECT setval('categorias_id_seq', (SELECT MAX(id) FROM categorias));
SELECT setval('sabores_id_seq', (SELECT MAX(id) FROM sabores));
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
