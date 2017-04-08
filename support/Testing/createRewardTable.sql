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

-- create rewards
INSERT INTO `rewardTable` (entriesNumTotal, badge, description) VALUES 
                        (10, '', 'Made 10 Data Inputs!');

INSERT INTO `rewardTable` (entriesNumTotal, badge, description) VALUES 
                        (20, '', 'Made 20 Data Inputs!');

INSERT INTO `rewardTable` (entriesNumTotal, badge, description) VALUES 
                        (30, '', 'Made 30 Data Inputs!');

INSERT INTO `rewardTable` (entriesNumTotal, badge, description) VALUES 
                        (40, '', 'Made more than 40 Data Inputs!');

INSERT INTO `rewardTable` (postsNumTotal, badge, description) VALUES 
                        (10, '', 'Made 10 Posts!');

INSERT INTO `rewardTable` (postsNumTotal, badge, description) VALUES 
                        (20, '', 'Made 20 Posts!');

INSERT INTO `rewardTable` (postsNumTotal, badge, description) VALUES 
                        (30, '', 'Made 30 Posts!');

INSERT INTO `rewardTable` (postsNumTotal, badge, description) VALUES 
                        (40, '', 'Made more than 40 Posts!');
INSERT INTO `rewardTable` (likesNumTotal, badge, description) VALUES 
                        (10, '', 'Liked 10 Posts!');

INSERT INTO `rewardTable` (likesNumTotal, badge, description) VALUES 
                        (20, '', 'Liked 20 Posts!');

INSERT INTO `rewardTable` (likesNumTotal, badge, description) VALUES 
                        (30, '', 'Liked 30 Posts!');

INSERT INTO `rewardTable` (likesNumTotal, badge, description) VALUES 
                        (40, '', 'Liked More than 40 Posts!');
                         
-- LOAD DATA LOCAL INFILE  '' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

