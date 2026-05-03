CREATE TABLE IF NOT EXISTS users (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(100) UNIQUE NOT NULL,
  password         VARCHAR(255) NOT NULL,
  season           VARCHAR(20),
  age              INT,
  gender           VARCHAR(30),
  preferred_style  VARCHAR(50),
  body_type        VARCHAR(50),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clothing_items (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(150) NOT NULL,
  type        VARCHAR(50),
  color       VARCHAR(20),
  season      VARCHAR(50),
  formality   VARCHAR(50),
  fabric      VARCHAR(50),
  status      VARCHAR(20) DEFAULT 'clean',
  image_data  TEXT,
  wear_count  INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_outfits (
  id        SERIAL PRIMARY KEY,
  user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name      VARCHAR(100),
  item_ids  JSONB,
  score     INT,
  emojis    VARCHAR(50),
  saved_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
