-- SQL script to initialize the study table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create post table and fill it with values
DROP TABLE IF EXISTS postTable;
CREATE TABLE `postTable` ( postID INTEGER NOT NULL AUTO_INCREMENT, 
                           userID VARCHAR(50) NOT NULL, 
                           dateTimeStamp TIMESTAMP,
                           postText VARCHAR(1000),
                           image MEDIUMBLOB, 
                           conditionGroupNum INTEGER NOT NULL,
                           phaseNum INTEGER NOT NULL, 
                           studyID INTEGER NOT NULL, 
                           PRIMARY KEY (postID));

                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /createStudyTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

