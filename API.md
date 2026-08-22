# Ecommerce API

Run `node server.js`; all responses are JSON. Authenticate protected routes with `Authorization: Bearer <token>`. Money uses integer USD cents.

- `POST /api/auth/register` `{name,email,password}` and `POST /api/auth/login` return `{user,token}`. Passwords require 12 characters.
- `GET /api/products?q=&category=`; `GET /api/products/:id-or-slug`; `GET /api/categories`.
- `GET /api/cart`; `POST /api/cart/items` `{productId,quantity}`; `PATCH` or `DELETE /api/cart/items/:id`.
- `GET`, `POST /api/addresses`; address fields are recipient, line1, optional line2, city, state, postalCode, country.
- `POST /api/checkout` `{shippingAddressId,paymentToken}` requires an `Idempotency-Key` header. It atomically rechecks inventory, calculates totals, charges the test payment provider, reserves inventory, and clears the cart. Use `paymentToken: "decline"` to test payment failure.
- `GET /api/orders`, `GET /api/orders/:id`.
- Admin only: `POST /api/admin/categories`, `POST /api/admin/products`, and `PATCH /api/admin/products/:id`.

For a production deployment, apply [db/schema.sql](db/schema.sql) in a transactional SQL database and use a real payment provider tokenization flow; card details are deliberately never accepted or stored by this API.
