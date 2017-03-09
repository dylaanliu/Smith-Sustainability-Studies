-- SQL script to initialize the study table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create study table and fill it with values
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
                            "my description text",
                            "3", "2", "2016-01-12", "2017-02-28"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Effect of Sunshine and Rainbows", 
                            "description text2",
                            "3", "3", "2017-01-01", "2017-12-01"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Effect of Bacon", 
                            "description text3",
                            "3", "4", "2016-12-24", "2017-01-24"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Dangers of Cute Cat Videos", 
                            "Studies the detrimental effects of cute cat videos on the study habits of college students.",
                            "1", "4", "2016-12-24", "2017-01-24"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Pigs can Fly", 
                            "Determines if the flagellating frequency of a pig affects its ability to fly",
                            "1", "4", "2016-12-24", "2017-01-24"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("TWD and Smurf collecting", 
                            "Measures the tendency of kids who collect Smurfs relative to their grown up need for Total World Domination",
                            "1", "4", "2016-12-24", "2017-01-24"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Walking and Health", 
                            "Examines if increase hours of watching the Walking Dead leads to a more healthy life style.",
                            "1", "4", "2016-12-24", "2017-01-24"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Goldfish Farming", 
                            "Examines if farmed goldfish are better sushi then goldfish caught in the wild.",
                            "2", "2", "2016-12-24", "2017-01-24"
                        );
INSERT INTO `studyTable` (title, description, conditionGroups, phases, startDate, endDate) VALUES 
                        ("Academy Award Movies", 
                            "Explores if movies which make money win more Academy Awards.",
                            "1", "6", "2016-12-24", "2017-01-24"
                        );
                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /createStudyTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

