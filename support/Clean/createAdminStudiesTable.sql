-- SQL script to initialize the Admin Studies table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create user table and fill it with values
DROP TABLE IF EXISTS adminStudiesTable;
CREATE TABLE `adminStudiesTable` (userID INTEGER NOT NULL,                            
                                  studyID INTEGER NOT NULL 
                                 );


-- LOAD DATA LOCAL INFILE  '<absolute file path...>/createAdminStudiesTable.txt' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

