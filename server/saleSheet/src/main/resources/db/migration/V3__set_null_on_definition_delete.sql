ALTER TABLE products DROP CONSTRAINT IF EXISTS products_definition_id_fkey;

ALTER TABLE products
    ADD CONSTRAINT products_definition_id_fkey
    FOREIGN KEY (definition_id) REFERENCES product_definitions(id) ON DELETE SET NULL;
