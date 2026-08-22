-- Reference schema for a production SQL deployment. The local development API
-- uses the same entities in a small JSON-backed store so it can run with no
-- services or dependencies.
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer', created_at TEXT NOT NULL);
CREATE TABLE categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);
CREATE TABLE products (id TEXT PRIMARY KEY, category_id TEXT REFERENCES categories(id), name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT NOT NULL, price_cents INTEGER NOT NULL CHECK (price_cents >= 0), active BOOLEAN NOT NULL DEFAULT true, created_at TEXT NOT NULL);
CREATE TABLE inventory (product_id TEXT PRIMARY KEY REFERENCES products(id), quantity INTEGER NOT NULL CHECK (quantity >= 0), updated_at TEXT NOT NULL);
CREATE TABLE addresses (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), recipient TEXT NOT NULL, line1 TEXT NOT NULL, line2 TEXT, city TEXT NOT NULL, state TEXT NOT NULL, postal_code TEXT NOT NULL, country TEXT NOT NULL);
CREATE TABLE carts (id TEXT PRIMARY KEY, user_id TEXT UNIQUE NOT NULL REFERENCES users(id), updated_at TEXT NOT NULL);
CREATE TABLE cart_items (id TEXT PRIMARY KEY, cart_id TEXT NOT NULL REFERENCES carts(id), product_id TEXT NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL CHECK (quantity > 0), UNIQUE(cart_id, product_id));
CREATE TABLE orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), address_snapshot JSON NOT NULL, subtotal_cents INTEGER NOT NULL, shipping_cents INTEGER NOT NULL, total_cents INTEGER NOT NULL, status TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE order_items (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), product_id TEXT NOT NULL, product_name TEXT NOT NULL, unit_price_cents INTEGER NOT NULL, quantity INTEGER NOT NULL CHECK (quantity > 0));
CREATE TABLE payments (id TEXT PRIMARY KEY, order_id TEXT UNIQUE NOT NULL REFERENCES orders(id), provider TEXT NOT NULL, provider_reference TEXT NOT NULL, amount_cents INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL);
