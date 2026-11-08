-- LedgerLine - Complete Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','holder','auditor')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  account_number VARCHAR(20) UNIQUE NOT NULL,
  balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE idempotency_keys (
  key VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  response_status INT,
  response_body JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE TABLE ledger (
  id SERIAL PRIMARY KEY,
  account_id INT REFERENCES accounts(id) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('debit','credit')),
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  balance_after NUMERIC(15,2) NOT NULL,
  reference_id VARCHAR(100),
  idempotency_key VARCHAR(255),
  initiated_by INT REFERENCES users(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('success','failed')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Prevent updates/deletes on ledger via app role (we will create restricted role later)
-- For now, ledger is append-only by application logic

-- Seed Data
INSERT INTO users (email, password_hash, role) VALUES 
('admin@ledger.com', '$2b$10$dummyhash', 'admin'),
('holder1@ledger.com', '$2b$10$dummyhash', 'holder'),
('auditor@ledger.com', '$2b$10$dummyhash', 'auditor');

INSERT INTO accounts (user_id, account_number, balance) VALUES
(2, 'ACC1001', 10000),
(2, 'ACC1002', 5000);
