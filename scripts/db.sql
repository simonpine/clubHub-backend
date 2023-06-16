CREATE DATABASE IF NOT EXISTS clubHubDb;

USE clubHubDb;

CREATE TABLE IF NOT EXISTS users (
    userName VARCHAR(45) NOT NULL,
    clubs JSON NOT NULL,
    pasword VARCHAR(45) NOT NULL,
    userImg VARCHAR(255) DEFAULT NULL,
    question VARCHAR(45) NOT NULL,
    answer VARCHAR(45) NOT NULL,
    PRIMARY KEY (userName)
);



INSERT INTO users (userName, clubs, pasword) VALUES
    ('SimonPine', '[]', 'contra');