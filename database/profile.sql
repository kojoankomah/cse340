CREATE TABLE "user"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    password TEXT,
    age INT
);


INSERT INTO "user" (email, name, age, password) 
VALUES
    (
        'troy@fake.email', 'Troy', 26, 'alsothdlfjdkjfie'
    );


INSERT INTO "user" (email, name, age, password) 
VALUES
    (
        'chris@another.example', 'Chris', 98, 'wowilovesql28;dlfj'
    );



SELECT * FROM "user" WHERE age > 27;

-- Making changes to an already existing data

UPDATE "user" SET age = 30 WHERE id = 1;

SELECT * FROM "user" WHERE id = 1;


UPDATE "user" SET email = 'troy@fake.com' WHERE id = 1;


SELECT email FROM "user" WHERE id = 1;

-- Removing information using the DELETE statement

DELETE FROM "user" WHERE id = 2;

SELECT * FROM "user";


CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    content TEXT,
    user_id INT,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES "user"(id)
); 