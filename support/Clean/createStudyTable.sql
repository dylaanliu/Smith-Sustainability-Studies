-- SQL script to initialize the study table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create user table and fill it with values
DROP TABLE IF EXISTS studyTable;
CREATE TABLE `studyTable` ( studyID INTEGER NOT NULL AUTO_INCREMENT, 
                           title VARCHAR(50), 
                           description VARCHAR(1000), 
                           conditionGroups INTEGER, 
                           phases INTEGER, 
                           maxConditionGroupNum INTEGER, 
                           startDate TIMESTAMP, 
                           endDate TIMESTAMP, 
                           status VARCHAR(8) DEFAULT 'created',     -- can only be 'created','active','archive' 
                           PRIMARY KEY (studyID));


                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /createStudyTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

