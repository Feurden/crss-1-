const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER,
      total REAL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  db.all("SELECT COUNT(*) as count FROM products", (err, rows) => {
    if (rows[0].count === 0) {
      const sample = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)");
      sample.run("Coffee", 50);
      sample.run("Bread", 25);
      sample.run("Milk", 30);
      sample.finalize();
      console.log("✅ Sample products added!");
    }
  });
});

module.exports = db;
