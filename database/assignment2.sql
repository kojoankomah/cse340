-- Inserting a new record into the account table

INSERT INTO account(account_firstname, account_lastname, account_email, account_password)
    VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');


-- Modifying the Tony Stark record to change the account type

UPDATE account 
    SET account_type = 'Admin' 
    WHERE account_id = 1;


-- Deleting the Tony Stark record

DELETE 
    FROM account WHERE account_id = 1;


-- Modifying the `GM HUMMER` record 

UPDATE inventory 
    SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
    WHERE inv_id = 10;



-- Using an inner join to select two records 

SELECT 
    i.inv_make,
    i.inv_model,
    c.classification_name
    FROM inventory i 
    INNER JOIN classification c
    ON i.classification_id = c.classification_id
    WHERE c.classification_name = 'Sport';



-- Updating all records in the inventory table

UPDATE inventory 
    SET 
        inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), 
        inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

