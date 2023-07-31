-- Active: 1690788194461@@127.0.0.1@3306@LTL

CREATE DATABASE LTL;


CREATE TABLE users (
    account VARCHAR(66) NOT NULL,
    user_id VARCHAR(30) NOT NULL,
    p_image VARCHAR(255) NULL,
    PRIMARY KEY (account, user_id)
);


CREATE TABLE propose (
    account VARCHAR(66) NOT NULL,
    proposal_id varchar(32) NOT NULL,
    PRIMARY KEY (account, proposal_id)
);


CREATE TABLE posts (
    account VARCHAR(66) NOT NULL,
    proposal_id varchar(32) NOT NULL,
    PRIMARY KEY (account, proposal_id)
);
