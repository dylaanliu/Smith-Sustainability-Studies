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
                           PRIMARY KEY (entryID));
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum) VALUES 
                        ("4", "2016-12-24", "09:00:00", "1234", "17:00:00", "0",
                         "0", "0", "10", "2", "1", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum) VALUES 
                        ("6", "2016-12-30", "09:30:00", "2234", "00:00:00", "0",
                         "0", "0", "10", "2", "1", "2"
                        );
INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum) VALUES 
                        ("7", "2016-12-31", "09:30:00", "2234", "00:00:00", "0",
                         "1", "2", "3", "4", "5", "6"
                        );
/* INSERT INTO `dailyEntriesTable` (userID, entryDate, startTime, startEnergy, endTime, endEnergy, numLikes, numShares, numPosts, numReminders, conditionGroupNum, phaseNum) VALUES 
                        ("", "", "", "", "", "",
                         "", "", "", "", "", ""
                        );
 */
                         
-- LOAD DATA LOCAL INFILE  'absolute path . . . /dailyEntriesTable.txt'  (USE THIS IF THE DATA IS A CSV CREATED BY A PROGRAM) 
-- INTO TABLE studyTable 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

