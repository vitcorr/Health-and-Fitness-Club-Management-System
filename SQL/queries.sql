-- -- Damilola decided to create a new workout routine. She decides to create an arm centred workout 
INSERT INTO routines(member_id, routine_description) VALUES ((SELECT user_id from users WHERE username = 'damibisi'), 'Arm morning workout');
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Arm morning workout'), 'tricep dips', 30);
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Arm morning workout'), 'bicep dips', 30);
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Arm morning workout'), 'swimmers', 30);

SELECT
    members.member_id,
	users.username,
	routines.routine_description,
	exercises.exercise_type,
	exercises.reps
FROM users
JOIN user_types ON users.type_of_user = user_types.user_type_id
LEFT JOIN members ON users.user_id = members.member_id
LEFT JOIN routines ON members.member_id = routines.member_id
LEFT JOIN exercises ON routines.routine_id = exercises.routine_id
WHERE users.username = 'damibisi' AND routines.routine_description = 'Arm morning workout';

-- -- Her email got hacked so she had to make a new one. She decides to update her email on all her --
-- -- accounts  --------------------------------------------------------------------------------------
UPDATE users SET email = 'newdamilolaola@example.com' WHERE user_id = (SELECT user_id from users WHERE username = 'damibisi');
SELECT * FROM users WHERE user_id = (SELECT user_id from users WHERE username = 'damibisi');

-- -- A new member decides to join the fitness club. They create an account as a member.
INSERT INTO users (type_of_user, username, password_key, first_name, last_name, email, phone_num, sex, dob, home_addr) VALUES ((SELECT user_type_id from user_types WHERE user_type_name = 'member'), 'kellygetsfit', 'kellyspassword', 'Kelly', 'McQueen', 'queenkelly@example.com', '9812562749', 'female', '1983-11-19', '43B Hampton Drive, Toronto, Ontario, Canada');
INSERT INTO members(member_id) VALUES ((SELECT user_id from users WHERE username = 'kellygetsfit'));

SELECT * FROM users ORDER BY user_id DESC LIMIT 1;

-- -- She is prompted to enter her health metrics
INSERT INTO metrics(member_id, new_weight, height) VALUES ((SELECT user_id from users WHERE username = 'kellygetsfit'), 186, 150);

SELECT users.username, metrics.*
FROM metrics
JOIN members ON metrics.member_id = members.member_id
JOIN users ON members.member_id = users.user_id
WHERE users.username = 'damibisi';

-- The fitness club hired a new trainer. Admin creates a new profile for them.
INSERT INTO users (type_of_user, username, password_key, first_name, last_name, email, phone_num, sex, dob, home_addr) VALUES ((SELECT user_type_id from user_types WHERE user_type_name = 'trainer'), 'AishatA', 'aishaspassword', 'Aishat', 'Adesina', 'aoadesina@example.com', '8793789132', 'female', '1980-11-14', '124 Foxtrot Block, Fruter Street, Ottawa, Ontario, Canada');
INSERT INTO trainers(trainer_id) VALUES ((SELECT user_id from users WHERE username = 'AishatA'));

INSERT INTO certification_types (certification_name, trainer_id) VALUES ('cardio', (SELECT user_id from users WHERE username = 'AishatA'));
INSERT INTO certification_types (certification_name, trainer_id) VALUES ('yoga', (SELECT user_id from users WHERE username = 'AishatA'));
INSERT INTO certification_types (certification_name, trainer_id) VALUES ('zumba', (SELECT user_id from users WHERE username = 'AishatA'));

SELECT users.*, certification_types.certification_name
FROM users
JOIN trainers ON users.user_id = trainers.trainer_id
LEFT JOIN certification_types ON trainers.trainer_id = certification_types.trainer_id
WHERE users.username = 'aorogat';

-- -- Damilola wants a one-one yoga session. First she searches for trainers who are certified in yoga
SELECT
    trainers.trainer_id,
	users.first_name,
	users.last_name
FROM
    users
JOIN
    trainers ON users.user_id = trainers.trainer_id
LEFT JOIN
    certification_types ON certification_types.trainer_id= trainers.trainer_id
WHERE
	certification_types.certification_name = 'yoga';

-- -- Since she found a trainer, the system provides her with a list of rooms available. That is, rooms
-- -- that don't have faulty equipment
SELECT
    rooms.room_id,
    rooms.max_people
FROM
    rooms
LEFT JOIN
    equipment ON rooms.room_id = equipment.room_id AND equipment.equip_status = 'faulty'
WHERE
    equipment.room_id IS NULL;

-- -- Then a training session can be created:
INSERT INTO personal_training (member_id, trainer_id, train_date, start_time, end_time, room_id)
VALUES (
    (SELECT user_id FROM users WHERE username = 'damibisi'),
    (SELECT user_id FROM users WHERE first_name = 'Abdelghny' AND last_name = 'Orogat'),
    '2023-12-06',
    '10:00:00',
    '11:00:00',
    2
);

-- -- The trainer Abdelghny receives a notification abut the new session. Unfortunately, he has a bad
-- -- back and can't do yoga for a while. So he deletes the session.
DELETE FROM personal_training WHERE session_id = 1;

-- -- Admin decides to set up the first group training session for Aishat. First they search for a 
-- -- room that is available at that time on that date
SELECT
    r.room_id,
    r.max_people
FROM
    rooms r
LEFT JOIN group_training gt ON r.room_id = gt.room_id
    AND '2023-12-06'::DATE = gt.train_date
    AND '16:00'::TIME < gt.end_time
    AND '17:00'::TIME > gt.start_time
LEFT JOIN personal_training pt ON r.room_id = pt.room_id
    AND '2023-12-06'::DATE = pt.train_date
    AND '16:00'::TIME < pt.end_time
    AND '17:00'::TIME > pt.start_time
WHERE
    gt.room_id IS NULL
    AND pt.room_id IS NULL;

-- --Then a new group session is created
INSERT INTO group_training (trainer_id, train_date, start_time, end_time, room_id)
VALUES ((SELECT user_id FROM users WHERE first_name = 'Aishat' AND last_name = 'Adesina'), '2023-12-07', '16:00', '17:00', 1);

-- -- The trainer Aishat receives a notification about the new session. Unfortunately, she is not 
-- -- available at that time. So she changes it.
UPDATE group_training SET start_time = '17:00:00', end_time = '18:00:00' WHERE trainer_id = (SELECT user_id from users WHERE username = 'AishatA');
