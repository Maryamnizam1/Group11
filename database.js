const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    throw err;
  }
else {
  // Create tables
  console.log('Connected to the SQLite database.');


  db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT,
    email TEXT,
    password TEXT,
    salt TEXT,
    created_at TEXT
)`
  );
// -- Searches table (for search history)
db.run(`CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    query TEXT NOT NULL,
    result_data TEXT,
    search_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
)`);

// -- Foods table (main food information)
db.run(`CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    calories REAL NOT NULL,
    serving_size TEXT NOT NULL,
    api_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)`);

// -- Food nutrients table
db.run(`CREATE TABLE IF NOT EXISTS food_nutrients (
    id INTEGER PRIMARY KEY,
    food_id INTEGER NOT NULL,
    protein REAL,
    carbohydrates REAL,
    fat REAL,
    fiber REAL,
    sugar REAL,
    FOREIGN KEY (food_id) REFERENCES foods (id)
        ON DELETE CASCADE
)`);

// -- Favorites table (user's favorite foods)
db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods (id)
        ON DELETE CASCADE
    );
`)}
});

module.exports = db;
