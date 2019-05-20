create table users (
        id serial primary key,
        email varchar(100),
        password varchar(500)   --store hashes only
);

create table user_score (
    id serial primary key,
    user_id integer references users(id),
    score integer
);
create table photos (
    id serial primary key,
    photo_url varchar(200)
);
create table user_photos (
    id serial primary key,
    user_id integer references users(id),
    photo_id integer references photos(id)

);