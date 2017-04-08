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
                           teamNumber INTEGER NOT NULL,
                           PRIMARY KEY (entryID));
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-04-06", "09:30:00", "2341", "05:00:00", "4234",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-04-05", "09:30:00", "2234", "05:00:00", "4534",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-04-04", "09:30:00", "2345", "05:00:00", "4764",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-04-03", "09:30:00", "2234", "05:00:00", "4239",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-04-02", "09:30:00", "2334", "05:00:00", "4274",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-04-01", "09:30:00", "2274", "05:00:00", "4634",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-31", "09:30:00", "2284", "05:00:00", "4534",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("8", "2017-03-31", "09:30:00", "2394", "00:00:00", "5000",
                         "1", "2", "3", "4", "1", "2", "1", "1"
                        );                        
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-30", "09:30:00", "2334", "05:00:00", "4234",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-29", "09:30:00", "2424", "05:00:00", "4224",
                         "0", "10", "0", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-28", "09:30:00", "2224", "05:00:00", "4924",
                         "10", "0", "0", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-27", "09:30:00", "2524", "05:00:00", "4524",
                         "0", "0", "10", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-26", "09:30:00", "2222", "05:00:00", "4235",
                         "0", "10", "0", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("6", "2017-03-25", "09:30:00", "2324", "05:00:00", "4000",
                         "10", "0", "0", "2", "2", "1", "2", "1"
                        );

INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("7", "2017-03-24", "09:00:00", "2234", "17:00:00", "5500",
                         "1", "2", "3", "2", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("11", "2017-03-24", "09:00:00", "2234", "17:00:00", "6644",
                         "4", "5", "6", "2", "1", "1", "3", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("12", "2017-03-24", "09:00:00", "2234", "17:00:00", "6644",
                         "7", "8", "9", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("13", "2017-03-24", "09:00:00", "2234", "17:00:00", "5500",
                         "11", "12", "13", "2", "2", "1", "2", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("8", "2017-03-24", "09:00:00", "2234", "17:00:00", "6744",
                         "14", "15", "16", "2", "1", "2", "1", "1"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("9", "2017-03-24", "09:00:00", "2234", "17:00:00", "6644",
                         "17", "18", "19", "2", "2", "1", "2", "1"
                        );

INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("7", "2017-03-23", "09:00:00", "2234", "17:00:00", "6644",
                         "4", "5", "6", "2", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("7", "2017-03-22", "09:00:00", "2234", "17:00:00", "6644",
                         "7", "8", "9", "2", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("7", "2017-03-20", "09:00:00", "1234", "17:00:00", "5500",
                         "11", "12", "13", "2", "2", "1", "2", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("7", "2017-03-19", "09:00:00", "2234", "17:00:00", "6644",
                         "14", "15", "16", "2", "2", "1", "2", "2"
                        );
                        






/* INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum, studyID, teamNumber) VALUES 
                        ("", "", "", "", "", "",
                         "", "", "", "", "", "", "", ""
                        );
 */
                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /dailyEntriesTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

