-- SQL script to initialize the Admin Studies table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create user table and fill it with values
DROP TABLE IF EXISTS adminStudiesTable;
CREATE TABLE `adminStudiesTable` (userID INTEGER NOT NULL,                            
                                  studyID INTEGER NOT NULL,
                                  PRIMARY KEY (userID, studyID)
                                 );


-- create admin study relation
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '1');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('3', '1');                        
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '2');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('3', '2');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('2', '2');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '3');  
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('2', '3');                                                                       
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '4');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('3', '4');                        
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '5');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('2', '5');                        
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '6');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('2', '6');   
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('3', '6');                                               
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '7');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('3', '7');                        
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '8');
INSERT INTO `adminStudiesTable` (userID, studyID) VALUES 
                        ('1', '9');  

-- LOAD DATA LOCAL INFILE  '<absolute file path...>/createAdminStudiesTable.txt' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

