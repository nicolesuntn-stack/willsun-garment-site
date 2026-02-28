CREATE TABLE IF NOT EXISTS products (
  slug TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  zh_name TEXT NOT NULL,
  zh_summary TEXT NOT NULL,
  zh_overview TEXT NOT NULL,
  zh_fabric TEXT NOT NULL,
  zh_sizes TEXT NOT NULL,
  zh_colors TEXT NOT NULL,
  en_name TEXT NOT NULL,
  en_summary TEXT NOT NULL,
  en_overview TEXT NOT NULL,
  en_fabric TEXT NOT NULL,
  en_sizes TEXT NOT NULL,
  en_colors TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
