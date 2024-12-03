-- init.sql
CREATE TABLE users (
    phone VARCHAR(12) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flights (
    flightid VARCHAR(10) PRIMARY KEY,
    origin VARCHAR(50),
    destination VARCHAR(50),
    departuredate DATE,
    arrivaldate DATE,
    departuretime TIME,
    arrivaltime TIME,
    availableseats INT,
    price DECIMAL(10, 2)
);

CREATE TABLE hotels (
    hotel_id VARCHAR(10) PRIMARY KEY,
    hotel_name VARCHAR(100),
    city VARCHAR(50),
    price_per_night DECIMAL(10, 2)
);

-- Create admin user (password: admin123)
INSERT INTO users (phone, password, firstname, lastname, dob, email, gender)
VALUES (
    '222-222-2222',
    '$2y$10$qPXte7VuWsDJofPnFIdVre5GXDnpKixwD6THoyTebBT.R2X2p2h0i',
    'Admin',
    'User',
    '2000-01-01',
    'admin@example.com',
    'male'
);