-- SQL script to initialize the study table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create condition group phase table and fill it with values
DROP TABLE IF EXISTS conditionGroupPhaseTable;
CREATE TABLE `conditionGroupPhaseTable` ( ID INTEGER NOT NULL AUTO_INCREMENT, 
                           studyID INTEGER NOT NULL, 
                           conditionGroupNum INTEGER NOT NULL, 
                           phaseNum INTEGER NOT NULL, 

                           phaseStarted BOOLEAN NOT NULL , 
                           phaseEnded BOOLEAN NOT NULL, 
                           
                           phasePermission BIT(13) NOT NULL,
                           
                           entriesNum INTEGER NOT NULL DEFAULT 0, 
                           postsNum INTEGER NOT NULL DEFAULT 0, 
                           likesNum INTEGER NOT NULL DEFAULT 0, 
                           PRIMARY KEY (ID));


                                       
-- LOAD DATA LOCAL INFILE  'absolute path . . . /conditionGroupPhaseTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE conditionGroupPhaseTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

