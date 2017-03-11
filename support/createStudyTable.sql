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
                           startDate TIMESTAMP, 
                           endDate TIMESTAMP, 
                           status VARCHAR(8) DEFAULT 'created',     -- can only be 'created','active','archive' 
                           PRIMARY KEY (studyID));

-- create studies
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Effect of Social Media", 
                            "Effect of social media on workplace energy consumption. More details will be here because this is a real study...",
                            "2", "3", "2016-01-12", "2017-02-28"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Effect of Sunshine and Rainbows", 
                            "Effect of exam time on workplace energy consumption in a school environment. More details will be here because this is a real study...",
                            "2", "3", "2017-01-01", "2017-12-01"
                        );

                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /createStudyTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

