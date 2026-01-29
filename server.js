const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all products
app.get('/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a sale
app.post('/sale', (req, res) => {
  const { product_id, quantity } = req.body;

  db.get("SELECT price FROM products WHERE id = ?", [product_id], (err, product) => {
    if (err || !product) return res.status(404).json({ error: "Product not found" });

    const total = product.price * quantity;

    db.run(
      "INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)",
      [product_id, quantity, total],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Sale recorded", sale_id: this.lastID, total });
      }
    );
  });
});

// ✅ Delete last sale
app.delete('/sale/last', (req, res) => {
  db.get("SELECT id FROM sales ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err || !row) return res.json({ error: "No sales to delete" });

    db.run("DELETE FROM sales WHERE id = ?", [row.id], function(err) {
      if (err) return res.json({ error: err.message });
      res.json({ message: "Last sale deleted", deleted_id: row.id });
    });
  });
});

// Get total sales
app.get('/sales/total', (req, res) => {
  db.get("SELECT SUM(total) as total_sales FROM sales", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total_sales: row.total_sales || 0 });
  });
});

app.listen(3000, () => console.log("💻 POS system running at http://localhost:3000"));
