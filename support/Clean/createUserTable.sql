-- SQL script to initialize the users tables. 

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create user table and fill it with values
DROP TABLE IF EXISTS userTable;
CREATE TABLE `userTable` ( userID INTEGER NOT NULL AUTO_INCREMENT, 
                           userName VARCHAR(50), 
                           encodedPW VARCHAR(256), 
                           firstName VARCHAR(50), 
                           lastName VARCHAR(50), 
                           email VARCHAR(50) DEFAULT '', 
                           privilegeLevel VARCHAR(50) DEFAULT 'user', 
                           adminID INTEGER, 
                           studyID INTEGER DEFAULT 0, 
                           currentConditionGroup INTEGER DEFAULT 0, 
                           currentPhase INTEGER DEFAULT 0, 
                           teamNum INTEGER DEFAULT 1, 
                           entriesNumPhase INTEGER NOT NULL DEFAULT 0, 
                           postsNumPhase INTEGER NOT NULL DEFAULT 0, 
                           likesNumPhase INTEGER NOT NULL DEFAULT 0, 
                           entriesNumTotal INTEGER NOT NULL DEFAULT 0, 
                           postsNumTotal INTEGER NOT NULL DEFAULT 0, 
                           likesNumTotal INTEGER NOT NULL DEFAULT 0, 
                           userRewards BIT(12) NOT NULL DEFAULT 000000000000, 
                           PRIMARY KEY (userID));

-- create super users
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup
                        ) VALUES 
                        ('Jane_Webster', 
                         '4a1fe4735e6e13c6b1bbcc452d7964035346cca1403b7032c5d3f6b28bb68c8ce08c3ff51309fc575b3001932e506b37c5a5c4d789a6741b0319b045bad144c6', 
                         'Jane', 'Webster', 'super_admin', -1, 'editThis@gmail.com', 0, 0
                         );                           
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup
                        ) VALUES 
                        ('Sandy_Staples', 
                         '7fc5991546629181b224fb90167742731a65fdd009833b72c98baf5f3e71da0853e71d4c3fb37ae2aa44bed88c6bb1c8801a90656cf4ca273500a8bc4c54c600', 
                         'Sandy', 'Staples', 'super_admin', -1, 'editThis2@gmail.com', 0, 0
                         ); 
                         
-- LOAD DATA LOCAL INFILE  '' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

