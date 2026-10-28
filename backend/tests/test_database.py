"""Run inside backend: python -m unittest discover -s /tests -v."""
import os
import subprocess
import tempfile
import unittest

from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from app.database import make_engine


class DatabaseTests(unittest.TestCase):
    def test_migrations_and_constraints(self):
        with tempfile.TemporaryDirectory() as directory:
            url = f"sqlite:///{directory}/test.db"
            env = dict(os.environ, DATABASE_URL=url)

            def migrate(*args):
                subprocess.run(["alembic", *args], env=env, check=True, capture_output=True)

            migrate("upgrade", "head")
            migrate("upgrade", "head")
            migrate("check")
            engine = make_engine(url)
            self.assertEqual(set(inspect(engine).get_table_names()), {
                "roles", "users", "products", "orders", "order_items",
                "stock_movements", "anomalies", "alembic_version",
            })
            with engine.begin() as c:
                c.execute(text("INSERT INTO roles (id, name) VALUES (1, 'staff')"))
                c.execute(text("INSERT INTO users (id, username, password_hash, role_id) VALUES (1, 'tester', 'test-only-hash', 1)"))
                c.execute(text("INSERT INTO products (id, sku, name, price_minor) VALUES (1, 'P1', 'Product', 100)"))
                c.execute(text("INSERT INTO orders (id, order_number, created_by) VALUES (1, 'O1', 1)"))
                c.execute(text("INSERT INTO order_items (order_id, product_id, quantity, unit_price_minor) VALUES (1, 1, 2, 100)"))
                c.execute(text("INSERT INTO stock_movements (product_id, quantity_delta, reason) VALUES (1, 10, 'opening'), (1, -2, 'sale')"))
                c.execute(text("INSERT INTO anomalies (rule_code, description, order_id) VALUES ('test', 'Example', 1)"))
                self.assertEqual(c.scalar(text("SELECT SUM(quantity_delta) FROM stock_movements WHERE product_id=1")), 8)

            invalid = [
                "INSERT INTO users (username, password_hash, role_id) VALUES ('other', 'hash', 999)",
                "INSERT INTO products (sku, name, price_minor) VALUES ('P1', 'Duplicate', 0)",
                "INSERT INTO products (sku, name, price_minor) VALUES ('P2', 'Negative', -1)",
                "INSERT INTO order_items (order_id, product_id, quantity, unit_price_minor) VALUES (1, 1, 0, 100)",
                "INSERT INTO stock_movements (product_id, quantity_delta, reason) VALUES (1, 0, 'invalid')",
                "INSERT INTO anomalies (rule_code, description) VALUES ('test', 'No target')",
                "DELETE FROM products WHERE id=1",
            ]
            for statement in invalid:
                with self.subTest(statement=statement):
                    with self.assertRaises(IntegrityError):
                        with engine.begin() as c:
                            c.execute(text(statement))
            engine.dispose()
            migrate("downgrade", "base")
            engine = make_engine(url)
            self.assertEqual(inspect(engine).get_table_names(), ["alembic_version"])
            engine.dispose()
            migrate("upgrade", "head")


if __name__ == "__main__":
    unittest.main()
