CREATE TABLE user_types (
    user_type_id SERIAL PRIMARY KEY,
    user_type_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO user_types (user_type_name) VALUES
	('member'),
    ('trainer');

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	type_of_user INTEGER REFERENCES user_types(user_type_id),
	username VARCHAR(255) NOT NULL UNIQUE,
	password_key VARCHAR(255) NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	phone_num VARCHAR(15) NOT NULL,
	sex VARCHAR(32) NOT NULL,
	dob DATE NOT NULL,
	home_addr VARCHAR(255) NOT NULL
);

CREATE TABLE trainers (
	trainer_id SERIAL PRIMARY KEY
);

CREATE TABLE group_training (
	session_id SERIAL PRIMARY KEY,
	trainer_id INT NOT NULL,
	FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id),
	train_date DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	room_id INT NOT NULL
);

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    group_training_id INT,
    FOREIGN KEY (group_training_id) REFERENCES group_training(session_id)
);

CREATE TABLE administration (
	admin_id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL UNIQUE,
	password_key VARCHAR(255) NOT NULL
);

CREATE TABLE achievements (
	achievement_id SERIAL PRIMARY KEY,
	member_id INT,
	FOREIGN KEY (member_id) REFERENCES members(member_id),
	date_received DATE DEFAULT CURRENT_DATE NOT NULL,
	achievement_description VARCHAR(255) NOT NULL
);

CREATE TABLE metrics (
	metric_id SERIAL PRIMARY KEY,
	member_id INT,
	FOREIGN KEY (member_id) REFERENCES members(member_id),
	new_date DATE DEFAULT CURRENT_DATE,
	new_weight DECIMAL(5,2) NOT NULL,
	height DECIMAL(5,2),
	bmi DECIMAL(5, 2) GENERATED ALWAYS AS (new_weight / POW(height / 100, 2)) STORED
);

CREATE TABLE routines (
	routine_id SERIAL PRIMARY KEY,
	member_id INT,
	FOREIGN KEY (member_id) REFERENCES members(member_id),
	routine_description VARCHAR(255) NOT NULL
);

CREATE TABLE exercises (
	exercise_id SERIAL PRIMARY KEY,
	routine_id INT,
	FOREIGN KEY (routine_id) REFERENCES routines(routine_id),
	exercise_type VARCHAR(255),
	reps INT
);

CREATE TABLE goals (
	goal_id SERIAL PRIMARY KEY,
	member_id INT,
	FOREIGN KEY (member_id) REFERENCES members(member_id),
	date_start DATE DEFAULT CURRENT_DATE NOT NULL,
	date_end DATE,
	goal_description VARCHAR(255) NOT NULL,
	goal_status VARCHAR(36)
);

CREATE TABLE certification_types (
    certification_id SERIAL PRIMARY KEY,
    certification_name VARCHAR(50) NOT NULL,
	trainer_id INT,
	FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id)
);

CREATE TABLE personal_training (
	session_id SERIAL PRIMARY KEY,
	member_id INT NOT NULL,
	trainer_id INT NOT NULL,
	FOREIGN KEY (member_id) REFERENCES members(member_id),
	FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id),
	train_date DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	room_id INT
);

CREATE TABLE rooms (
	room_id SERIAL PRIMARY KEY,
	max_people INT
);

CREATE TABLE equipment (
	equipment_id SERIAL PRIMARY KEY,
	room_id INT NOT NULL,
	FOREIGN KEY (room_id) REFERENCES rooms(room_id),
	last_serviced DATE,
	equip_status VARCHAR(255) NOT NULL
);

--ADMIN
INSERT INTO administration (username, password_key) VALUES ('admin', 'admin');

-- MEMBER 1
-- Creating member 1
INSERT INTO users (type_of_user, username, password_key, first_name, last_name, email, phone_num, sex, dob, home_addr) VALUES (1, 'damibisi', 'damispassword', 'Damilola', 'Olabisi', 'damilolabisi@example.com', '2281027401', 'female', '2000-08-31', 'Apartment 2108, 101 Champagne Ave S, Ottawa, Ontario, Canada');
INSERT INTO members(member_id) VALUES ((SELECT user_id from users WHERE username = 'damibisi'));

-- Creating metrics
INSERT INTO metrics(member_id, new_date, new_weight, height) VALUES ((SELECT user_id from users WHERE username = 'damibisi'), '2023-07-23', 126, 170);
INSERT INTO metrics(member_id, new_date, new_weight, height) VALUES ((SELECT user_id from users WHERE username = 'damibisi'), '2023-08-26', 116, 170);
INSERT INTO metrics(member_id, new_date, new_weight, height) VALUES ((SELECT user_id from users WHERE username = 'damibisi'), '2023-09-21', 99, 170);
INSERT INTO metrics(member_id, new_date, new_weight, height) VALUES ((SELECT user_id from users WHERE username = 'damibisi'), '2023-11-24', 95.5, 170);

-- Creating routine
INSERT INTO routines(member_id, routine_description) VALUES ((SELECT user_id from users WHERE username = 'damibisi'), 'Work Those Glutes!');
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Work Those Glutes!'), 'squats', 10);
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Work Those Glutes!'), 'lunges', 10);
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Work Those Glutes!'), 'fire hydrants', 10);
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Work Those Glutes!'), 'donkey kicks', 10);
INSERT INTO exercises(routine_id, exercise_type, reps) VALUES ((SELECT routines.routine_id FROM routines JOIN users ON routines.member_id = users.user_id WHERE users.username = 'damibisi' AND routines.routine_description = 'Work Those Glutes!'), 'hip thrusts', 10);

-- TRAINER 1
-- Creating trainer 1
INSERT INTO users (type_of_user, username, password_key, first_name, last_name, email, phone_num, sex, dob, home_addr) VALUES (2, 'aorogat', 'aspassword', 'Abdelghny', 'Orogat', 'aorogat@example.com', '3008800308', 'male', '1976-05-04', 'Apartment 3008 Carleton Street, Ottawa, Ontario, Canada');
INSERT INTO trainers(trainer_id) VALUES ((SELECT user_id from users WHERE username = 'aorogat'));

-- Creating certications
INSERT INTO certification_types (certification_name, trainer_id) VALUES ('yoga', (SELECT user_id from users WHERE username = 'aorogat'));
INSERT INTO certification_types (certification_name, trainer_id) VALUES ('zumba', (SELECT user_id from users WHERE username = 'aorogat'));
INSERT INTO certification_types (certification_name, trainer_id) VALUES ('pilates', (SELECT user_id from users WHERE username = 'aorogat'));

-- -- Creating fitness goals for member 1


-- -- Creating rooms
INSERT INTO rooms (max_people) VALUES (50);
INSERT INTO equipment (room_id, last_serviced, equip_status) VALUES (1, '2023-11-10', 'perfect');
INSERT INTO equipment (room_id, last_serviced, equip_status) VALUES (1, '2023-11-10', 'faulty');
INSERT INTO equipment (room_id, last_serviced, equip_status) VALUES (1, '2023-11-10', 'perfect');

INSERT INTO rooms (max_people) VALUES (100);
INSERT INTO equipment (room_id, last_serviced, equip_status) VALUES (2, '2023-11-10', 'perfect');
INSERT INTO equipment (room_id, last_serviced, equip_status) VALUES (2, '2023-11-10', 'perfect');
INSERT INTO equipment (room_id, last_serviced, equip_status) VALUES (2, '2023-11-10', 'perfect');

