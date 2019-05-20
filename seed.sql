insert into users
(email, password)
values
('margaret@oneillfish.com','$2a$10$16GecxItlJx7gh88wHg6vOYEhdPDCsfSD0Cun1b10BNg8uKNsBFyW'),
('roneill@columbiaprop','$2a$10$16GecxItlJx7gh88wHg6vOYEhdPDCsfSD0Cun1b10BNg8uKNsBFyW'),
('maddie@oneillcrew.com','$2a$10$16GecxItlJx7gh88wHg6vOYEhdPDCsfSD0Cun1b10BNg8uKNsBFyW');


insert into user_score
( user_id, score)
values
(1,20),
(2,40);

insert into photos
(photo_url )
values
('/userphotos/dragonfly.jpg');

insert into user_photos
(user_id, photo_id)
values
(1,1),
(2,1),
(3,1)