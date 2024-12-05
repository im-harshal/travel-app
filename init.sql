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

CREATE TABLE passengers (
    ssn VARCHAR(20) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    category ENUM('adults', 'children', 'infants') NOT NULL
);

CREATE TABLE flight_bookings (
    flight_booking_id VARCHAR(20) PRIMARY KEY,
    flight_id VARCHAR(10) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(flightid)
);

CREATE TABLE tickets (
    ticket_id VARCHAR(20) PRIMARY KEY,
    flight_booking_id VARCHAR(20) NOT NULL,
    ssn VARCHAR(20) NOT NULL,
    passenger_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (flight_booking_id) REFERENCES flight_bookings(flight_booking_id),
    FOREIGN KEY (ssn) REFERENCES passengers(ssn)
);

CREATE TABLE hotel_bookings (
    hotel_booking_id VARCHAR(20) PRIMARY KEY,
    hotel_id VARCHAR(10) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_rooms INT NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

CREATE TABLE guesses (
    ssn VARCHAR(20) NOT NULL,
    hotel_booking_id VARCHAR(20) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    category ENUM('adults', 'children', 'infants') NOT NULL,
    PRIMARY KEY (ssn, hotel_booking_id),
    FOREIGN KEY (hotel_booking_id) REFERENCES hotel_bookings(hotel_booking_id)
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