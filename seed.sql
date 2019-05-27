insert into users
(email, password)
values
('margaret@oneillfish.com','$2a$10$16GecxItlJx7gh88wHg6vOYEhdPDCsfSD0Cun1b10BNg8uKNsBFyW'),
('roneill@columbiaprop','$2a$10$16GecxItlJx7gh88wHg6vOYEhdPDCsfSD0Cun1b10BNg8uKNsBFyW'),
('maddie@oneillcrew.com','$2a$10$16GecxItlJx7gh88wHg6vOYEhdPDCsfSD0Cun1b10BNg8uKNsBFyW');


insert into user_score
( user_id, score)
values
(1,1),
(2,0);


insert into photos
(user_id, photo_url)
values
(1,'photos/bug.jpg'),
(2,'photos/bug.jpg'),
(3,'photos/bug.jpg')