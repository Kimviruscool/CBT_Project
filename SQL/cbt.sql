create database if not exists CBT;
use cbt;

create table source_videos(
id int auto_increment primary key,
video_link varchar(500) not null unique,
titile varchar(100) not null,
processed_at timestamp default current_timestamp
) ENGINE=InnoDB;

create table questions(
id int auto_increment primary key,
video_id int,
category varchar(100),
question_text TEXT not null,
option_1 TEXT not null,
option_2 TEXT not null,
option_3 TEXT not null,
option_4 TEXT not null,
answer tinyint,
foreign key(video_id) references source_videos(id) on delete cascade
) ENGINE=InnoDB;

create table users(
id int auto_increment primary key,
username varchar(50) not null unique,
userpass varchar(250) not null,
create_time timestamp default Current_timestamp
)ENGINE=InnoDB;

create table exam_result(
id int auto_increment primary key,
user_id int,
score int,
passed boolean default false,
wrong_answer json,
create_time Timestamp default current_timestamp,
foreign key (user_id) references users(id) on delete cascade
)ENGINE=InnoDB;

-- test sample 
INSERT INTO source_videos (video_link, titile) VALUES 
('https://www.youtube.com/watch?v=R90p79tI-2Q', '조주기능사 필기 15분 핵심 요약'),
('https://www.youtube.com/watch?v=example2', '주류학개론: 위스키와 브랜디의 차이'),
('https://www.youtube.com/watch?v=example3', '칵테일 조주법 기법 총정리');

INSERT INTO questions (video_id, category, question_text, option_1, option_2, option_3, option_4, answer) VALUES 
(1, '주류학개론', '와인을 증류하여 만든 술로, 양조주를 증류하여 알코올 도수를 높인 것은?', '브랜디', '보드카', '진', '럼', 1),
(1, '칵테일조주법', '기주와 부재료를 믹싱 글라스에 넣어 바 스푼으로 젓는 기법은?', '쉐이킹(Shaking)', '스터(Stirring)', '빌딩(Building)', '플로팅(Floating)', 2),
(1, '주류학개론', '사탕수수를 원료로 하여 만든 증류주는?', '데킬라', '위스키', '럼', '보드카', 3);

INSERT INTO users (username, userpass) VALUES 
('kim', '1234'),
('girock', '1234'),
('cbt_master', '1234');

INSERT INTO exam_result (user_id, score, passed, wrong_answer) VALUES 
(1, 85, true, '{"10": 2, "15": 4}'),
(2, 40, false, '{"1": 2, "2": 1, "5": 3, "8": 4, "12": 1}'),
(3, 100, true, '{}');

-- select * from exam_result;

-- sample check
SELECT u.username, e.score, e.passed, e.create_time 
FROM users u 
JOIN exam_result e ON u.id = e.user_id;

-- sample check 2
SELECT q.id, v.titile AS video_title, q.category, q.question_text 
FROM questions q 
JOIN source_videos v ON q.video_id = v.id;