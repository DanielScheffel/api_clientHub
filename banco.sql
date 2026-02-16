CREATE TYPE tipo_usuario_enum AS ENUM ('admin', 'usuario');
CREATE TYPE status_usuario_enum AS ENUM ('ativo', 'inativo');

CREATE TYPE origem_cliente_enum AS ENUM ('site', 'indicacao', 'whatsapp');

CREATE TYPE status_cliente_enum AS ENUM ('novo', 'contatado', 'negociacao', 'perdido', 'fechado');

CREATE TYPE tipo_cliente_enum AS ENUM ('pf', 'pj', 'mei');


CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,

  tipo_usuario tipo_usuario_enum NOT NULL,
  status status_usuario_enum NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cliente (
  id_cliente SERIAL PRIMARY KEY,

  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  contato VARCHAR(20),
  empresa VARCHAR(150),

  tipo_cliente tipo_cliente_enum NOT NULL,

  cpf VARCHAR(11),
  cnpj VARCHAR(14),

  origem origem_cliente_enum,
  status status_cliente_enum NOT NULL,

  cidade VARCHAR(100),
  estado CHAR(2),

  observacao TEXT,

  deletado BOOLEAN NOT NULL DEFAULT FALSE,

  usuario_id INT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_cliente_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuario(id_usuario),

  -- Regra: PF usa CPF | PJ/MEI usa CNPJ
  CONSTRAINT check_documento_cliente
    CHECK (
      (tipo_cliente = 'pf' AND cpf IS NOT NULL AND cnpj IS NULL)
      OR
      (tipo_cliente IN ('pj', 'mei') AND cnpj IS NOT NULL AND cpf IS NULL)
    ),

  -- Formato básico CPF (11 números)
  CONSTRAINT check_cpf_format
    CHECK (cpf ~ '^[0-9]{11}$' OR cpf IS NULL),

  -- Formato básico CNPJ (14 números)
  CONSTRAINT check_cnpj_format
    CHECK (cnpj ~ '^[0-9]{14}$' OR cnpj IS NULL)
);


-- Deixar cfp e CNPJ únicos
CREATE UNIQUE INDEX idx_cliente_cpf
ON cliente(cpf)
WHERE cpf IS NOT NULL;

CREATE UNIQUE INDEX idx_cliente_cnpj
ON cliente(cnpj)
WHERE cnpj IS NOT NULL;


CREATE TABLE cliente_status_historico (
    id_historico SERIAL PRIMARY KEY,

    cliente_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,

    status_anterior status_cliente_enum NOT NULL,
    status_novo status_cliente_enum NOT NULL,

    data_mudanca TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_historico_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE,

    CONSTRAINT fk_historico_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id_usuario)
);
