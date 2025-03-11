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
    pdf VARCHAR(50),
    FOREIGN KEY (escritura_id) REFERENCES escrituras(id) ON DELETE CASCADE
);

-- CREAR TABLA FACTURAS
CREATE TABLE facturas (
    id SERIAL PRIMARY KEY,
    rentasyregistro_id INT NOT NULL,
    numero_factura VARCHAR(20) UNIQUE NOT NULL,
    valor INT NOT NULL,
    estado VARCHAR(12) CHECK (estado IN ('cancelado', 'sin cancelar')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rentasyregistro_id) REFERENCES rentasyregistro(id) ON DELETE CASCADE
);


-- CREAR TABLA RENTAS Y REGISTRO
CREATE TABLE rentasyregistro (
    id SERIAL PRIMARY KEY,
    escritura_id INT NOT NULL,
    valor_rentas INT NOT NULL,
    metodo_pago_rentas VARCHAR(10) NOT NULL CHECK (metodo_pago_rentas IN ('pse', 'efectivo')),
    valor_registro INT NOT NULL,
    metodo_pago_registro VARCHAR(10) NOT NULL CHECK (metodo_pago_registro IN ('pse', 'efectivo')),
    fecha DATE NOT NULL,
    total_facturas_canceladas INT DEFAULT 0 NOT NULL,
    total_facturas_sin_cancelar INT DEFAULT 0 NOT NULL,
    total_ryr INT DEFAULT 0 NOT NULL,
    devoluciones INT DEFAULT 0 NOT NULL,
    excedentes INT DEFAULT 0 NOT NULL,
    observaciones TEXT,
    total_rentasyregistro INT DEFAULT 0 NOT NULL,
    FOREIGN KEY (escritura_id) REFERENCES escrituras(id) ON DELETE CASCADE
);


--- triger facturas
CREATE OR REPLACE FUNCTION update_facturas_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar los totales en rentasyregistro según el estado de las facturas
    UPDATE rentasyregistro
    SET 
        total_facturas_canceladas = (
            SELECT COALESCE(SUM(valor), 0)
            FROM facturas
            WHERE rentasyregistro_id = (
                CASE 
                    WHEN TG_OP = 'DELETE' THEN OLD.rentasyregistro_id
                    ELSE NEW.rentasyregistro_id
                END
            )
            AND estado = 'cancelado'
        ),
        total_facturas_sin_cancelar = (
            SELECT COALESCE(SUM(valor), 0)
            FROM facturas
            WHERE rentasyregistro_id = (
                CASE 
                    WHEN TG_OP = 'DELETE' THEN OLD.rentasyregistro_id
                    ELSE NEW.rentasyregistro_id
                END
            )
            AND estado = 'sin cancelar'
        )
    WHERE id = (
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.rentasyregistro_id
            ELSE NEW.rentasyregistro_id
        END
    );

    RETURN NULL; -- Para AFTER triggers, no necesitamos devolver nada
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_update_facturas_totals
AFTER INSERT OR UPDATE OF valor, estado OR DELETE ON facturas
FOR EACH ROW
EXECUTE FUNCTION update_facturas_totals();


-- triger ryr y total rentas y registro
CREATE OR REPLACE FUNCTION calculate_totals_rentasyregistro()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular total_ryr
    IF NEW.metodo_pago_registro = 'pse' THEN
        NEW.total_ryr = NEW.valor_rentas + NEW.valor_registro;
    ELSE
        NEW.total_ryr = NEW.valor_rentas; -- Solo valor_rentas cuando no es 'pse'
    END IF;

    -- Calcular total_rentasyregistro
    NEW.total_rentasyregistro = NEW.total_facturas_canceladas 
                              - NEW.valor_rentas 
                              - NEW.valor_registro 
                              - NEW.devoluciones 
                              + NEW.excedentes;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trigger_calculate_totals_rentasyregistro
BEFORE INSERT OR UPDATE OF valor_rentas, valor_registro, metodo_pago_registro, devoluciones, excedentes, total_facturas_canceladas
ON rentasyregistro
FOR EACH ROW
EXECUTE FUNCTION calculate_totals_rentasyregistro();