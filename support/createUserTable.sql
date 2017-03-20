-- SQL script to initialize the users tables. 

-- first, remove then create database
-- DROP DATABASE `cisc498`;
-- CREATE DATABASE `cisc498`;
-- ALTER DATABASE `cisc498` CHARACTER SET utf8 COLLATE utf8_bin;
-- use `cisc498`;

-- create user table and fill it with values
DROP TABLE IF EXISTS userTable;
CREATE TABLE `userTable` ( userID INTEGER NOT NULL AUTO_INCREMENT, 
                           userName VARCHAR(50), 
                           encodedPW VARCHAR(256), 
                           firstName VARCHAR(50), 
                           lastName VARCHAR(50), 
                           email VARCHAR(50) DEFAULT '', 
                           privilegeLevel VARCHAR(50) DEFAULT 'user', 
                           adminID INTEGER, 
                           studyID INTEGER DEFAULT 0, 
                           currentConditionGroup INTEGER DEFAULT 0, 
                           currentPhase INTEGER DEFAULT 0, 
                           teamNum INTEGER DEFAULT 1, 
                           PRIMARY KEY (userID));

-- create super users
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('admin', 
                         'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec', 
                         'Big', 'Duder1', 'super_admin', -1, 'admin@gmail.com', 0, 0);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Jane_Webster', 
                         '4a1fe4735e6e13c6b1bbcc452d7964035346cca1403b7032c5d3f6b28bb68c8ce08c3ff51309fc575b3001932e506b37c5a5c4d789a6741b0319b045bad144c6', 
                         'Jane', 'Webster', 'admin', -1, 'Jane@gmail.com', 0, 0);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Emma_Wong', 
                         '596e907a763db377a526dd89dcdd51ca4aa1d9c9eede501e9f87e962dccf2f05553ffc38cede08273245b0e19f2c3078194ce82baea58d113be550b1ab0a3ee6', 
                         'Emma', 'Wong', 'super_admin', 1, 'Emma_Wong@gmail.com', 0, 0);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Bob_Brown', 
                         'a8b0015a2602606b344bece3e54e9e0e76546253510a4b0457968742aac0f11cbf3350fcc66000a866419b5eb2da8ddc4f2a2ab3a4cbf4d30266ac5aac7cba17', 
                         'Bob', 'Brown', 'admin', 1, 'Bob_Brown@gmail.com', 0, 0);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Holy_Roller', 
                         'dfef459539f2fc9f56cca7cb77f0a7ff388715699d4ee61c529983a7a8707652caa401e8c24abf222ae3d867ddb2305017974268dcac434bad8c508ce5fa8875', 
                         'Holy', 'Roller', 'user', 1, 'Holy_Roller@gmail.com', 2, 2);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Cathy_Brown', 
                         '7f8448e5b85d122cfd58c31e52e1b5ca9dc050602b63cb982b2b84bc6619921079a4ff0f9ee15f9e3c4c3078a128255d4e945b2394b51ec725a4a33f195feb92', 
                         'Cathy', 'Brown', 'user', 1, 'Cathy_Brown@gmail.com', 2, 2);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Zipper_Brown', 
                         '8d666fa2d93745b193f4f6fdf8d01b3a93c3c8412eeda08552c2a73519257849794ce4c6eb446d0a6f66bcae9bc6ec8aa1698521a9692dd51c0afcc097d5055d', 
                         'Zipper', 'Brown', 'user', 1, 'Zipper_Brown@gmail.com', 2, 2);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Marie_Stubble', 
                         'c5024b709a66702d92a9de78d87ee6971a79134205f157951036b3418dd9112871ee6c65a53828638b8286abc42c145d30911c543e8e83be33fd0453388dd9d3', 
                         'Marie', 'Stubble', 'user', 1, 'Marie_Stubble@yahoo.com', 1, 1);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Queen_Beene', 
                         '93f729c9cff6b137c9d4db7468ed5f23d02287acec72468feb3d297ac36291f72a986931ad8b7352b84a647006bba027cab6bf41f9047c2ebb2f3864830da8cb', 
                         'Queen', 'Beene', 'user', 1, 'Queen_Beene@yahoo.com', 2, 2);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Fredie_Fender', 
                         '4bf12267b7a689674428ec225fa3543d0b5cfd093ee4457db901ed478405e7844d82806aff85a5abf952f8676a1a372d716e7f91b3b683b56a72a6e393149239', 
                         'Fredie', 'Fender', 'user', 1, 'Fredie_Fender@yahoo.com', 3, 1);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Prince_Beene', 
                         'b56aeecbe3e106e32ebe439398b7f8f96e06cf5ae207861b6e2455ba457d520e0fa5729e10ca22f2271b48b3c1f3accd735b7e784647cfb8be06dcd157c613ff', 
                         'Prince', 'Beene', 'user', 1, 'Prince_Beene@yahoo.com', 3, 1);
INSERT INTO `userTable` (userName, encodedPW, firstName, lastName, privilegeLevel, adminID, email, studyID, currentConditionGroup) VALUES 
                        ('Happy_Fender', 
                         '9a28d599533d315dc93b23ac1974ba1f8e5ab728fc73979b0e91169ecc74a56701e9e3595f77421559eb4da1bdaa965f6237fe246faca73836a05deb29818b6e', 
                         'Happy', 'Fender', 'user', 1, 'Happy_Fender@yahoo.com', 2, 2);

                         
-- LOAD DATA LOCAL INFILE  '' 
-- INTO TABLE inventory 
-- FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
-- LINES TERMINATED BY '\r\n'
-- IGNORE 1 ROWS;

