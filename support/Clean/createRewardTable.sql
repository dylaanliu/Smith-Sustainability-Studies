-- SQL script to initialize the users tables. 

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create reward table and fill it with values
DROP TABLE IF EXISTS rewardTable;
CREATE TABLE `rewardTable` ( rewardID INTEGER NOT NULL AUTO_INCREMENT, 
                           entriesNumPhase INTEGER NOT NULL DEFAULT 0, 
                           postsNumPhase INTEGER NOT NULL DEFAULT 0, 
                           likesNumPhase INTEGER NOT NULL DEFAULT 0, 
                           entriesNumTotal INTEGER NOT NULL DEFAULT 0, 
                           postsNumTotal INTEGER NOT NULL DEFAULT 0, 
                           likesNumTotal INTEGER NOT NULL DEFAULT 0,  
                           badge MEDIUMBLOB, 
                           description VARCHAR(50) DEFAULT '',  
                           PRIMARY KEY (rewardID));

                         
-- LOAD DATA LOCAL INFILE  '' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

