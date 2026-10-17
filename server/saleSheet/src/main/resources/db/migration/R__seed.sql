INSERT INTO product_definitions (name)
VALUES ('Tênis'), ('Sandália'), ('Bota'), ('Bolsa'), ('Acessório')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (id, email, name, role, status, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ana.silva@dev.local',      'Ana Silva',      'SALESPERSON', 'ACTIVE',  NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'carlos.santos@dev.local',  'Carlos Santos',  'SALESPERSON', 'ACTIVE',  NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'maria.oliveira@dev.local', 'Maria Oliveira', 'SALESPERSON', 'PENDING', NOW())
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
  ana_id       UUID   := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  carlos_id    UUID   := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  tenis_id     BIGINT;
  sandalia_id  BIGINT;
  bota_id      BIGINT;
  bolsa_id     BIGINT;
  acessorio_id BIGINT;
  s1 BIGINT; s2 BIGINT; s3 BIGINT; s4 BIGINT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM spreadsheets WHERE name = 'PLN-SEED-001') THEN

    SELECT id INTO tenis_id     FROM product_definitions WHERE name = 'Tênis';
    SELECT id INTO sandalia_id  FROM product_definitions WHERE name = 'Sandália';
    SELECT id INTO bota_id      FROM product_definitions WHERE name = 'Bota';
    SELECT id INTO bolsa_id     FROM product_definitions WHERE name = 'Bolsa';
    SELECT id INTO acessorio_id FROM product_definitions WHERE name = 'Acessório';

    INSERT INTO spreadsheets (name, status, created_at, issued_at, user_id)
    VALUES ('PLN-SEED-001', 'ACTIVE', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', ana_id)
    RETURNING id INTO s1;

    INSERT INTO products (reference, definition_id, price, sold, spread_sheet_id) VALUES
      ('REF-0001', tenis_id,     18990, true,  s1),
      ('REF-0002', sandalia_id,  12990, true,  s1),
      ('REF-0003', bota_id,      24990, false, s1),
      ('REF-0004', bolsa_id,     34990, false, s1),
      ('REF-0005', acessorio_id,  8990, true,  s1);

    INSERT INTO spreadsheets (name, status, created_at, user_id)
    VALUES ('PLN-SEED-002', 'DRAFT', NOW() - INTERVAL '3 days', ana_id)
    RETURNING id INTO s2;

    INSERT INTO products (reference, definition_id, price, sold, spread_sheet_id) VALUES
      ('REF-0006', tenis_id,    19990, false, s2),
      ('REF-0007', sandalia_id, 13990, false, s2),
      ('REF-0008', bota_id,     22990, false, s2);

    INSERT INTO spreadsheets (name, status, created_at, issued_at, user_id)
    VALUES ('PLN-SEED-003', 'INACTIVE', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', carlos_id)
    RETURNING id INTO s3;

    INSERT INTO products (reference, definition_id, price, sold, spread_sheet_id) VALUES
      ('REF-0009', bolsa_id,      39990, true, s3),
      ('REF-0010', acessorio_id,   9990, true, s3);

    INSERT INTO spreadsheets (name, status, created_at, user_id)
    VALUES ('PLN-SEED-004', 'DRAFT', NOW() - INTERVAL '1 day', carlos_id)
    RETURNING id INTO s4;

    INSERT INTO products (reference, definition_id, price, sold, spread_sheet_id) VALUES
      ('REF-0011', tenis_id, 21990, false, s4),
      ('REF-0012', bota_id,  27990, false, s4);

  END IF;
END $$;
