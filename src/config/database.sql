-- CREAR LA TABLA USERS

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    rol VARCHAR(50) NOT NULL  CHECK (rol IN ('ADMIN', 'EDITOR', 'VIEWER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREAR TABLA TABLA ESCRITURAS

CREATE TABLE escrituras (
    id SERIAL PRIMARY KEY,
    numero_escritura VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    fecha date NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CREAR TABLA CASO RENTAS

CREATE TABLE caso_rentas (
    id SERIAL PRIMARY KEY,
    escritura_id INT NOT NULL,
    radicado VARCHAR(50) NOT NULL UNIQUE,
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (escritura_id) REFERENCES escrituras(id) ON DELETE CASCADE
);

