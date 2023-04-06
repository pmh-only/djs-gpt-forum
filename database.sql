CREATE USER djsgpt@localhost;
CREATE SCHEMA djsgpt;

GRANT ALL on djsgpt.* to djsgpt@localhost;

CREATE TABLE djsgpt.messages (
  threadId bigint not null,
  messageId bigint not null,
  authorType varchar(10) not null,
  message longtext not null
);

CREATE TABLE djsgpt.askers (
  threadId bigint not null,
  userId bigint not null,
  isStarter boolean not null
);

alter table djsgpt.messages convert to charset utf8;
