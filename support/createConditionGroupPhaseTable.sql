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

-- create studies
-- for study 1
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("1", "1", "1", 0, 0, b'1010101010101', "1", "2", "3");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("1", "1", "2", 0, 0, b'0101010101010', "4", "5", "6");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("1", "2", "1", 0, 0, b'1010101010101', "7", "8", "9");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("1", "2", "2", 0, 0, b'0101010101010', "10", "11", "12");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("1", "3", "1", 0, 0, b'1000000000000', "13", "14", "15");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("1", "3", "2", 0, 0, b'1000000000001', "16", "17", "18");
-- for study 2
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "1", "1", 0, 0, b'1000000000000', "20", "21", "22");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "1", "2", 0, 0, b'0100000000000', "23", "24", "25");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "1", "3", 0, 0, b'0010000000000', "26", "27", "28");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "2", "1", 0, 0, b'0001000000000', "29", "30", "31");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "2", "2", 0, 0, b'0000100000000', "32", "33", "34");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "2", "3", 0, 0, b'0000010000000', "35", "36", "37");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "3", "1", 0, 0, b'0000001000000', "38", "39", "40");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "3", "2", 0, 0, b'0000000100000', "41", "42", "43");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("2", "3", "3", 0, 0, b'0000000010000', "44", "45", "46");
-- for study 3
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "1", "1", 0, 0, b'1000000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "1", "2", 0, 0, b'0100000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "1", "3", 0, 0, b'0010000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "1", "4", 0, 0, b'1110000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "2", "1", 0, 0, b'0001000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "2", "2", 0, 0, b'0000100000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "2", "3", 0, 0, b'0000010000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "2", "4", 0, 0, b'1111110000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "3", "1", 0, 0, b'0000001000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "3", "2", 0, 0, b'0000000100000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "3", "3", 0, 0, b'0000000010000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("3", "3", "4", 0, 0, b'1111111110000', "0", "0", "0");
-- for study 4
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("4", "1", "1", 0, 0, b'0000000000001', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("4", "1", "2", 0, 0, b'0000000000010', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("4", "1", "3", 0, 0, b'0000000000100', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("4", "1", "4", 0, 0, b'0000000001000', "0", "0", "0");
-- for study 5
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("5", "1", "1", 0, 0, b'0000000010000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("5", "1", "2", 0, 0, b'0000000100000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("5", "1", "3", 0, 0, b'0000001000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("5", "1", "4", 0, 0, b'0000010000000', "0", "0", "0");
-- for study 6
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("6", "1", "1", 0, 0, b'0000100000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("6", "1", "2", 0, 0, b'0001000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("6", "1", "3", 0, 0, b'0010000000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("6", "1", "4", 0, 0, b'0100000000000', "0", "0", "0");
-- for study 7
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("7", "1", "1", 0, 0, b'0000000000011', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("7", "1", "2", 0, 0, b'0000000001100', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("7", "1", "3", 0, 0, b'0000000110000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("7", "1", "4", 0, 0, b'0000011000000', "0", "0", "0");
-- for study 8
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("8", "1", "1", 0, 0, b'1100000000011', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("8", "1", "2", 0, 0, b'0011000001100', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("8", "2", "1", 0, 0, b'0000110000011', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("8", "2", "2", 0, 0, b'0000001101100', "0", "0", "0");
-- for study 9
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("9", "1", "1", 0, 0, b'0000000000011', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("9", "1", "2", 0, 0, b'0000000001100', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("9", "1", "3", 0, 0, b'0000000110000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("9", "1", "4", 0, 0, b'0000011000000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("9", "1", "5", 0, 0, b'0000000110000', "0", "0", "0");
INSERT INTO `conditionGroupPhaseTable` (studyID, conditionGroupNum, phaseNum, phaseStarted, phaseEnded, phasePermission, entriesNum, postsNum, likesNum) VALUES 
                                       ("9", "1", "6", 0, 0, b'0000011000000', "0", "0", "0");

                                       
-- LOAD DATA LOCAL INFILE  'absolute path . . . /conditionGroupPhaseTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE conditionGroupPhaseTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

