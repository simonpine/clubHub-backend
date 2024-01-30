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

CREATE TABLE IF NOT EXISTS clubs (
	id VARCHAR(45) NOT NULL,
    title VARCHAR(45) NOT NULL,
    description TEXT NOT NULL,
    gardes JSON NOT NULL,
    clubBanner VARCHAR(255) NOT NULL,
	members JSON DEFAULT NULL,
	chat JSON DEFAULT NULL,
	events JSON DEFAULT NULL,
    clubOwner VARCHAR(45) NOT NULL,
	clubLeader VARCHAR(45) NOT NULL,
	existGrades BOOLEAN NOT NULL,
	existChat BOOLEAN NOT NULL,
    calendarEvents JSON DEFAULT NULL, 
	surveys JSON DEFAULT NULL, 
    PRIMARY KEY (id)
);

INSERT INTO users (userName, clubs, pasword) VALUES
    ('SimonPine', '[]', 'contra');