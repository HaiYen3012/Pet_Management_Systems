CREATE TYPE "status_t" AS ENUM ('created', 'processing', 'complete', 'canceled');
CREATE TYPE "roles_t" AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE "type_t" AS ENUM ('vip', 'normal');
CREATE TYPE "time_t" AS ENUM ('breakfast', 'lunch', 'dinner');

CREATE TABLE "users" (
	"user_id" serial NOT NULL,
	"username" varchar(55) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(200) NOT NULL,
	"fullname" varchar(100) NOT NULL,
	"phone_numbers" varchar(10) NOT NULL,
	"roles" roles_t NOT NULL DEFAULT 'customer',
	"address" varchar(256),
	"city" varchar(100),
	"country" varchar(100),
	"created_at" TIMESTAMPTZ,
	"avatar" varchar(255),
	PRIMARY KEY("user_id")
);

CREATE TABLE "pets" (
	"pet_id" serial NOT NULL,
	"fullname" varchar(100) NOT NULL,
	"species" varchar(10) NOT NULL,
	"age" float NOT NULL,
	"weight" float NOT NULL,
	"sex" varchar(10) NOT NULL,
	"health" varchar(100),
	"describe" varchar(256),
	"plan_id" int,
	"medical_record_id" int,
	"user_id" int,
	"avatar" varchar(255),
	PRIMARY KEY("pet_id")
);

CREATE TABLE "storage" (
	"id" serial NOT NULL,
	"status" status_t NOT NULL DEFAULT 'created',
	"room_id" int NOT NULL,
	"date_start" timestamp NOT NULL,
	"date_end" timestamp NOT NULL,
	"note" varchar(255),
	PRIMARY KEY("id")
);

CREATE TABLE "beauty" (
	"id" serial NOT NULL,
	"status" status_t NOT NULL DEFAULT 'created',
	"date" DATE NOT NULL,
	"time_slot" int NOT NULL,
	"note" varchar(255),
	PRIMARY KEY("id")
);


CREATE TABLE "appointments" (
	"id" serial NOT NULL,
	"medical_record_id" int,
	"status" status_t NOT NULL DEFAULT 'created',
	"date" DATE NOT NULL,
	"note" varchar(255),
	"time_slot" int NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "medical_records" (
	"id" serial NOT NULL,
	"neutered" boolean NOT NULL,
	"symptoms" varchar(255) NOT NULL,
	"diagnostic" varchar(255) NOT NULL,
	"created_at" TIMESTAMPTZ,
	PRIMARY KEY("id")
);

CREATE TABLE "prescription_item" (
	"id" serial NOT NULL,
	"medical_record_id" int NOT NULL,
	"medicine" varchar(255) NOT NULL,
	"dosage" varchar(255) NOT NULL,
	"note" varchar(255) NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "room" (
	"id" serial NOT NULL,
	"type" type_t NOT NULL,
	"max_slot" int NOT NULL,
	"current_slot" int NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "time_slot" (
	"id" serial NOT NULL,
	"time" time NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "storage_orders" (
	"id" serial NOT NULL,
	"service_id" int NOT NULL,
	"user_id" int NOT NULL,
	"pet_id" int NOT NULL,
	"create_at" time NOT NULL,
	"total" float NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "beauty_orders" (
	"id" serial NOT NULL,
	"service_id" int NOT NULL,
	"user_id" int NOT NULL,
	"pet_id" int NOT NULL,
	"create_at" time NOT NULL,
	"total" float NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "appointment_orders" (
	"id" serial NOT NULL,
	"service_id" int NOT NULL,
	"user_id" int NOT NULL,
	"pet_id" int NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL,
	"total" float NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "diet_plans" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"date_start" timestamp NOT NULL,
	"date_end" timestamp NOT NULL,
	"created_at" TIMESTAMPTZ,
	PRIMARY KEY("id")
);

CREATE TABLE "food_item" (
	"id" serial NOT NULL,
	"plan_id" int NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" real NOT NULL,
	"unit" varchar(10) NOT NULL,
	"description" varchar(255),
	"time" time_t NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "reset_tokens" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"used" boolean NOT NULL,
	"expiration" TIMESTAMPTZ,
	PRIMARY KEY("id")
);

ALTER TABLE "pets"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "pets"
ADD FOREIGN KEY("plan_id") REFERENCES "diet_plans"("id")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "food_item"
ADD FOREIGN KEY("plan_id") REFERENCES "diet_plans"("id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "storage_orders"
ADD FOREIGN KEY("service_id") REFERENCES "storage"("id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "storage_orders"
ADD FOREIGN KEY("pet_id") REFERENCES "pets"("pet_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "storage_orders"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "beauty_orders"
ADD FOREIGN KEY("service_id") REFERENCES "beauty"("id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "beauty_orders"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "beauty_orders"
ADD FOREIGN KEY("pet_id") REFERENCES "pets"("pet_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("service_id") REFERENCES "appointments"("id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("pet_id") REFERENCES "pets"("pet_id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "storage"
ADD FOREIGN KEY("room_id") REFERENCES "room"("id")
ON UPDATE NO ACTION ON DELETE SET NULL;
ALTER TABLE "beauty"
ADD FOREIGN KEY("time_slot") REFERENCES "time_slot"("id")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "appointments"
ADD FOREIGN KEY("time_slot") REFERENCES "time_slot"("id")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "appointments"
ADD FOREIGN KEY("medical_record_id") REFERENCES "medical_records"("id")
ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE "prescription_item"
ADD FOREIGN KEY("medical_record_id") REFERENCES "medical_records"("id")
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE "pets"
ADD FOREIGN KEY("medical_record_id") REFERENCES "medical_records"("id")
ON UPDATE CASCADE ON DELETE SET NULL;