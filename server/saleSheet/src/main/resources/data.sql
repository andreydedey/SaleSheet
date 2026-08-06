INSERT INTO users (id, email, name, role, status, created_at)
VALUES (gen_random_uuid(), 'dedey.cardoso@gmail.com', 'Andrey', 'ADMIN', 'PENDING', NOW())
ON CONFLICT (email) DO NOTHING;
