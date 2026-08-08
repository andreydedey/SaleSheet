CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    oauth_provider VARCHAR(255),
    oauth_subject VARCHAR(255),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE spreadsheets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP,
    issued_at TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    reference VARCHAR(255),
    definition VARCHAR(255),
    price BIGINT,
    sold BOOLEAN NOT NULL DEFAULT FALSE,
    observation TEXT,
    observation_updated_at TIMESTAMP,
    spread_sheet_id BIGINT REFERENCES spreadsheets(id) ON DELETE CASCADE
);

INSERT INTO users (id, email, name, role, status, created_at)
VALUES (gen_random_uuid(), 'dedey.cardoso@gmail.com', 'Andrey', 'ADMIN', 'PENDING', NOW())
ON CONFLICT (email) DO NOTHING;
