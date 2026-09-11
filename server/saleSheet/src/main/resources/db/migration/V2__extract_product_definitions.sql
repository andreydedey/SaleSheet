CREATE TABLE product_definitions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO product_definitions (name)
SELECT DISTINCT definition FROM products WHERE definition IS NOT NULL;

ALTER TABLE products ADD COLUMN definition_id BIGINT REFERENCES product_definitions(id);

UPDATE products p
SET definition_id = pd.id
FROM product_definitions pd
WHERE p.definition = pd.name;

ALTER TABLE products DROP COLUMN definition;
