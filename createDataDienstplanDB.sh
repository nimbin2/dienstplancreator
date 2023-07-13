#!/bin/bash

createdb='DROP DATABASE datadienstplandb; CREATE DATABASE datadienstplandb;'
use='USE datadienstplandb;'
create_a='CREATE TABLE shifts (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   yearweek VARCHAR(255),
   day_id INT,
   person_id INT,
   start FLOAT,
   end FLOAT,
   breaks FLOAT
); CREATE TABLE person_overtimes_manual (
   data_id INT(10) UNSIGNED NOT NULL,
   person_id INT,
   yearweek VARCHAR(255),
   overtime FLOAT,
   PRIMARY KEY (person_id, data_id, yearweek)
); CREATE TABLE person_hours (
   data_id INT(10) UNSIGNED NOT NULL,
   person_id INT,
   yearweek VARCHAR(255),
   hours_is FLOAT,
   hours_should FLOAT,
   PRIMARY KEY (data_id, person_id, yearweek)
); CREATE TABLE roster_person_info (
   data_id int(10) UNSIGNED NOT NULL,
   id VARCHAR(255),
   yearweek VARCHAR(255),
   day_id INT,
   text VARCHAR(255),
   PRIMARY KEY (data_id, id, yearweek, day_id)
); CREATE TABLE roster_editable_cell_right (
   id VARCHAR(255),
   data_id int(10),
   yearweek VARCHAR(255),
   text VARCHAR(255),
   PRIMARY KEY (id, data_id, yearweek)
); CREATE TABLE roster_editable_row_bottom (
   id VARCHAR(255),
   data_id int(10),
   yearweek VARCHAR(255),
   text VARCHAR(255),
   PRIMARY KEY (id, data_id, yearweek)
); CREATE TABLE roster_editable_row_top (
   id VARCHAR(255),
   data_id int(10),
   yearweek VARCHAR(255),
   text VARCHAR(255),
   PRIMARY KEY (id, data_id, yearweek)
);' 
create_b='CREATE TABLE roster_changes (
   data_id int(10) UNSIGNED NOT NULL,
   yearweek VARCHAR(255),
   day_id INT,
   start FLOAT,
   end FLOAT,
   amount VARCHAR(255),
   PRIMARY KEY (data_id, yearweek, day_id)
);'
create_c='CREATE TABLE rosters (
   data_id int(10) UNSIGNED NOT NULL,
   yearweek VARCHAR(255),
   time_step FLOAT,
   break_60 FLOAT,
   break_90 FLOAT,
   days VARCHAR(255),
   PRIMARY KEY (data_id, yearweek)
); CREATE TABLE departments (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   name VARCHAR(255)
); CREATE TABLE person_changes (
   data_id int(10) UNSIGNED NOT NULL,
   person_id INT,
   yearweek VARCHAR(255),
   day_id INT,
   change_key VARCHAR(255),
   value VARCHAR(255),
   PRIMARY KEY (data_id, yearweek, day_id, person_id, change_key)
); CREATE TABLE person_betterments (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   person_id INT,
   start VARCHAR(255),
   end VARCHAR(255),
   hours FLOAT
); CREATE TABLE person_vacations (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   person_id INT,
   start VARCHAR(255),
   end VARCHAR(255)
); CREATE TABLE person_illnes (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   person_id INT,
   start VARCHAR(255),
   end VARCHAR(255)
); CREATE TABLE persons (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   activated VARCHAR(255),
   name VARCHAR(255),
   department INT,
   hours FLOAT,
   mpa VARCHAR(255)
); CREATE TABLE shift_labels (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   name VARCHAR(50),
   cut VARCHAR(50)
); CREATE TABLE settings_labels (
   id INT, 
   data_id int(10) UNSIGNED NOT NULL,
   name VARCHAR(50),
   cut VARCHAR(50)
); CREATE TABLE settings (
   data_id int(10) UNSIGNED NOT NULL,
   database_version VARCHAR(255),
   default_overtime tinyint(1),
   default_edit_cell_right tinyint(1) UNSIGNED NOT NULL,
   default_row_top tinyint(1) UNSIGNED NOT NULL,
   default_row_bottom tinyint(1) UNSIGNED NOT NULL,
   sort_days VARCHAR(255),
   sort_week VARCHAR(255),
   printmode tinyint(1) UNSIGNED NOT NULL,
   zoom_web INT,
   zoom_print_h INT,
   zoom_print_v INT
); CREATE TABLE closingtime_persons (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   closingtime_id INT NOT NULL,
   person_id INT
); CREATE TABLE closingtimes (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   data_id int(10) UNSIGNED NOT NULL,
   name VARCHAR(255),
   start VARCHAR(255),
   end VARCHAR(255),
   lawful tinyint(1) UNSIGNED
); CREATE TABLE institutions (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(255) NOT NULL
); CREATE TABLE users (
   id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) NOT NULL,
   role VARCHAR(50) NOT NULL,
   password VARCHAR(255) NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   enabled tinyint(1) UNSIGNED NOT NULL DEFAULT "1",
   data_id int(10),
   connected_person int(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
CREATE TABLE user_sessions (
   session_id varchar(255) NOT NULL,
   user_id int(10) UNSIGNED NOT NULL,
   login_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);'
mysql -u root -p -e "$createdb $use $create_a $create_b $create_c"
