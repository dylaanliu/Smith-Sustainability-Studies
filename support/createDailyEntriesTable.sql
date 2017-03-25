-- SQL script to initialize the daily entries table.

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create user table and fill it with values
DROP TABLE IF EXISTS dailyEntriesTable;
CREATE TABLE `dailyEntriesTable` ( entryID INTEGER NOT NULL AUTO_INCREMENT, 
                           userID INTEGER NOT NULL, 
                           entryDate DATE,
                           startTime TIME, 
                           endTime TIME, 
                           startEnergy DECIMAL, 
                           endEnergy DECIMAL, 
                           numLikes INTEGER DEFAULT 0, 
                           numShares INTEGER DEFAULT 0, 
                           numPosts INTEGER DEFAULT 0, 
                           numReminders INTEGER DEFAULT 0, 
                           conditionGroupNum INTEGER NOT NULL, 
                           phaseNum INTEGER NOT NULL,
                           studyID INTEGER NOT NULL,
                           PRIMARY KEY (entryID));
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-12-24", "09:00:00", "1234", "17:00:00", "5500",
                         "1", "2", "3", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-12-23", "09:00:00", "1234", "17:00:00", "6644",
                         "4", "5", "6", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-12-22", "09:00:00", "1234", "17:00:00", "6644",
                         "7", "8", "9", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-12-20", "09:00:00", "1234", "17:00:00", "5500",
                         "11", "12", "13", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-12-19", "09:00:00", "1234", "17:00:00", "6644",
                         "14", "15", "16", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-12-18", "09:00:00", "1234", "17:00:00", "6644",
                         "17", "18", "19", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-11-24", "09:00:00", "1234", "17:00:00", "5500",
                         "1", "2", "3", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-11-23", "09:00:00", "1234", "17:00:00", "6644",
                         "4", "5", "6", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-11-22", "09:00:00", "1234", "17:00:00", "6644",
                         "7", "8", "9", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-11-20", "09:00:00", "1234", "17:00:00", "5500",
                         "11", "12", "13", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-11-19", "09:00:00", "1234", "17:00:00", "6644",
                         "14", "15", "16", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("7", "2016-11-18", "09:00:00", "1234", "17:00:00", "6644",
                         "17", "18", "19", "2", "1", "2", "2"
                        );
                        
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("10", "2016-12-24", "09:00:00", "1234", "17:00:00", "5500",
                         "1", "2", "3", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("11", "2016-12-24", "09:00:00", "1234", "17:00:00", "6644",
                         "4", "5", "6", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("12", "2016-12-24", "09:00:00", "1234", "17:00:00", "6644",
                         "7", "8", "9", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("13", "2016-12-24", "09:00:00", "1234", "17:00:00", "5500",
                         "11", "12", "13", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("14", "2016-12-24", "09:00:00", "1234", "17:00:00", "6644",
                         "14", "15", "16", "2", "2", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("15", "2016-12-24", "09:00:00", "1234", "17:00:00", "6644",
                         "17", "18", "19", "2", "2", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("16", "2016-11-10", "09:00:00", "1234", "17:00:00", "5500",
                         "1", "2", "3", "2", "2", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("17", "2016-11-10", "09:00:00", "1234", "17:00:00", "6644",
                         "4", "5", "6", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("18", "2016-11-10", "09:00:00", "1234", "17:00:00", "6644",
                         "7", "8", "9", "2", "2", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("19", "2016-11-10", "09:00:00", "1234", "17:00:00", "5500",
                         "11", "12", "13", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("20", "2016-11-10", "09:00:00", "1234", "17:00:00", "6644",
                         "14", "15", "16", "2", "2", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("21", "2016-11-10", "09:00:00", "1234", "17:00:00", "6644",
                         "17", "18", "19", "2", "1", "2", "2"
                        );
                        
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "2016-01-30", "09:30:00", "234", "00:00:00", "1234",
                         "0", "0", "10", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "2016-01-29", "09:30:00", "224", "00:00:00", "2224",
                         "0", "10", "0", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "2016-01-28", "09:30:00", "24", "00:00:00", "924",
                         "10", "0", "0", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "2016-01-20", "09:30:00", "524", "00:00:00", "4524",
                         "0", "0", "10", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "2016-01-19", "09:30:00", "2", "00:00:00", "235",
                         "0", "10", "0", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("6", "2016-01-18", "09:30:00", "324", "00:00:00", "5000",
                         "10", "0", "0", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("8", "2016-12-31", "09:30:00", "94", "00:00:00", "5000",
                         "1", "2", "3", "4", "5", "6", "2"
                        );
/* INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID) VALUES 
                        ("", "", "", "", "", "",
                         "", "", "", "", "", "", ""
                        );
 */
                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /dailyEntriesTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

