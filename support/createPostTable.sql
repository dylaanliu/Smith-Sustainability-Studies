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

-- create studies
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("1", "2", "2017-01-20 09:23:00", "Unplug unused devices", "", "1", "2", "1"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("2", "3", "2017-01-21 09:23:00", "Turn off lights when leaving a room", "", "2", "2", "1"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("13", "13", "2017-01-22 09:24:00", "Turning off social media makes me use less energy", "", "1", "2", "1"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("4", "3", "2017-01-20 09:26:00", "Sunshine brightens people's mood", "", "3", "2", "2"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("5", "2", "2017-01-21 09:27:00", "Rainbows are pretty", "", "2", "2", "2"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "6", "2017-01-20 09:28:00", "I can't stop watching cat videos!", "", "1", "2", "4"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "10", "2017-01-20 09:23:00", "First: Smurf village. Next: the world", "", "1", "2", "6"
                        );
INSERT INTO `postTable` (postID, userID, dateTimeStamp, postText, image, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("8", "3", "2017-01-20 09:23:00", "Zombies tend to make people walk faster", "", "1", "3", "7"
                        );

                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /createStudyTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

