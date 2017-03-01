-- SQL script to initialize the inventory and users tables.
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
                           privilegeLevel VARCHAR(50) DEFAULT 'user', 
                           adminID INTEGER, 
                           studyID INTEGER DEFAULT 0, 
                           currentConditionGroup INTEGER DEFAULT 0, 
                           currentPhase INTEGER DEFAULT 0, 
                           PRIMARY KEY (userID));

-- create super users
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID) VALUES 
                        ('admin', 
                         'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', 
                         'Big', 'Duder1', 'super_admin', -1);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID) VALUES 
                        ('Jane_Webster', 
                         '4a1fe4735e6e13c6b1bbcc452d7964035346cca1403b7032c5d3f6b28bb68c8ce08c3ff51309fc575b3001932e506b37c5a5c4d789a6741b0319b045bad144c6', 
                         'Jane', 'Webster', 'super_admin', -1);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID) VALUES 
                        ('Emma_Wong', 
                         '596e907a763db377a526dd89dcdd51ca4aa1d9c9eede501e9f87e962dccf2f05553ffc38cede08273245b0e19f2c3078194ce82baea58d113be550b1ab0a3ee6', 
                         'Emma', 'Wong', 'admin', 1);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID) VALUES 
                        ('Bob_Brown', 
                         'a8b0015a2602606b344bece3e54e9e0e76546253510a4b0457968742aac0f11cbf3350fcc66000a866419b5eb2da8ddc4f2a2ab3a4cbf4d30266ac5aac7cba17', 
                         'Bob', 'Brown', 'user', 1);
                        
-- LOAD DATA LOCAL INFILE  <absolute path>/userTable.txt' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

