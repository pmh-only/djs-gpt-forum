CREATE USER djsgpt@localhost;
CREATE SCHEMA djsgpt;

GRANT ALL on djsgpt.* to djsgpt@localhost;

CREATE TABLE djsgpt.messages (
  threadId varchar(20) not null,
  messageId varchar(20) not null,
  authorType varchar(10) not null,
  message longtext not null
);

CREATE TABLE djsgpt.askers (
  threadId varchar(20) not null,
  userId varchar(20) not null,
  isStarter boolean not null
);

alter table djsgpt.messages convert to charset utf8;
