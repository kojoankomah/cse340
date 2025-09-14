CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email) VALUES
    ('John_doe', 'john@exmp.com'),
    ('Jane_smith', 'janesmith@exmp.com'),
    ('bob_jones', 'bobjones@exmp.com');


SELECT * FROM users;

INSERT INTO users (id, username, email)
VALUES (
    id:integer,
    'username:character varying',
    'email:character varying'
  );


CREATE TABLE post(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    content TEXT,
    user_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES "user"(id)
);


SELECT * FROM "user"

INSERT INTO post (name, content, user_id)
VALUES ('Why I love dogs in genereal', 'omg I love them so much', 1);

SELECT * FROM post;


SELECT * FROM "user" JOIN post ON 
    post.user_id = "user".id;



