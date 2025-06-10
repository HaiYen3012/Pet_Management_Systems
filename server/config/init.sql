-- Pet Care Database Schema
-- Complete database creation script

-- Create ENUM types
CREATE TYPE "status_t" AS ENUM ('created', 'processing', 'complete', 'canceled');
CREATE TYPE "roles_t" AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE "type_t" AS ENUM ('vip', 'normal');
CREATE TYPE "time_t" AS ENUM ('breakfast', 'lunch', 'dinner');
CREATE TYPE "login_method_t" AS ENUM ('email', 'google', 'refresh_token');

-- Create tables
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

CREATE TABLE "diet_plans" (
    "plan_id" serial NOT NULL,
    "name" varchar(255) NOT NULL,
    "description" varchar(255) NOT NULL,
    "date_start" timestamp NOT NULL,
    "date_end" timestamp NOT NULL,
    "created_at" TIMESTAMPTZ,
    PRIMARY KEY("plan_id")
);

CREATE TABLE "medical_records" (
    "id" serial NOT NULL,
    "neutered" boolean NOT NULL,
    "symptoms" varchar(255) NOT NULL,
    "diagnostic" varchar(255) NOT NULL,
    "created_at" TIMESTAMPTZ,
    PRIMARY KEY("id")
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
    "user_id" int,
    "avatar" varchar(255),
    "medical_record_id" int,
    PRIMARY KEY("pet_id")
);

CREATE TABLE "room" (
    "id" serial NOT NULL,
    "type" type_t NOT NULL,
    "max_slot" int NOT NULL,
    "current_slot" int NOT NULL,
    "price" float NOT NULL DEFAULT 0.0,
    "unit" varchar(10) NOT NULL DEFAULT 'VND',
    PRIMARY KEY("id")
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

CREATE TABLE "time_slot_beauty" (
    "id" serial NOT NULL,
    "time" time NOT NULL,
    "price" float NOT NULL,
    "unit" varchar(10) NOT NULL,
    PRIMARY KEY("id")
);

CREATE TABLE "time_slot_appointment" (
    "id" serial NOT NULL,
    "time" time NOT NULL,
    "price" float NOT NULL,
    "unit" varchar(10) NOT NULL,
    PRIMARY KEY("id")
);

CREATE TABLE "beauty" (
    "id" serial NOT NULL,
    "status" status_t NOT NULL DEFAULT 'created',
    "date" timestamp NOT NULL,
    "time_slot" int NOT NULL,
    "note" varchar(255),
    PRIMARY KEY("id")
);

CREATE TABLE "appointments" (
    "id" serial NOT NULL,
    "medical_record_id" int,
    "status" status_t NOT NULL DEFAULT 'created',
    "date" timestamp NOT NULL,
    "note" varchar(255),
    "time_slot" int NOT NULL,
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

CREATE TABLE "food_item" (
    "food_id" serial NOT NULL,
    "plan_id" int NOT NULL,
    "name" varchar(255) NOT NULL,
    "amount" real NOT NULL,
    "unit" varchar(10) NOT NULL,
    "description" varchar(255),
    "time" time_t NOT NULL,
    PRIMARY KEY("food_id")
);

CREATE TABLE "storage_orders" (
    "id" serial NOT NULL,
    "service_id" int NOT NULL,
    "user_id" int NOT NULL,
    "pet_id" int NOT NULL,
    "create_at" timestamp NOT NULL DEFAULT NOW(),
    "total" float NOT NULL,
    PRIMARY KEY("id")
);

CREATE TABLE "beauty_orders" (
    "id" serial NOT NULL,
    "service_id" int NOT NULL,
    "user_id" int NOT NULL,
    "pet_id" int NOT NULL,
    "create_at" timestamp NOT NULL DEFAULT NOW(),
    "total" float NOT NULL,
    "time_slot" int,
    PRIMARY KEY("id")
);

CREATE TABLE "appointment_orders" (
    "id" serial NOT NULL,
    "service_id" int NOT NULL,
    "user_id" int NOT NULL,
    "pet_id" int NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    "total" float NOT NULL,
    "time_slot" int,
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

CREATE TABLE "log_login" (
    "id" serial NOT NULL,
    "user_id" int NOT NULL,
    "type_user" roles_t NOT NULL DEFAULT 'customer',
    "login_method" login_method_t NOT NULL,
    "ip_address" varchar(45),
    "user_agent" varchar(500),
    "login_time" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "success" boolean NOT NULL DEFAULT true,
    "error_message" varchar(255),
    PRIMARY KEY("id")
);

-- Add foreign key constraints
ALTER TABLE "pets"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "pets"
ADD FOREIGN KEY("plan_id") REFERENCES "diet_plans"("plan_id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "pets"
ADD FOREIGN KEY("medical_record_id") REFERENCES "medical_records"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "food_item"
ADD FOREIGN KEY("plan_id") REFERENCES "diet_plans"("plan_id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "storage"
ADD FOREIGN KEY("room_id") REFERENCES "room"("id")
ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE "beauty"
ADD FOREIGN KEY("time_slot") REFERENCES "time_slot_beauty"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "appointments"
ADD FOREIGN KEY("time_slot") REFERENCES "time_slot_appointment"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "appointments"
ADD FOREIGN KEY("medical_record_id") REFERENCES "medical_records"("id")
ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "prescription_item"
ADD FOREIGN KEY("medical_record_id") REFERENCES "medical_records"("id")
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

ALTER TABLE "beauty_orders"
ADD FOREIGN KEY("time_slot") REFERENCES "time_slot_beauty"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("service_id") REFERENCES "appointments"("id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("pet_id") REFERENCES "pets"("pet_id")
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "appointment_orders"
ADD FOREIGN KEY("time_slot") REFERENCES "time_slot_appointment"("id")
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "log_login"
ADD FOREIGN KEY("user_id") REFERENCES "users"("user_id")
ON UPDATE CASCADE ON DELETE CASCADE;

-- Create indexes for optimization
CREATE INDEX "idx_log_login_user_id" ON "log_login"("user_id");
CREATE INDEX "idx_log_login_time" ON "log_login"("login_time");
CREATE INDEX "idx_log_login_method" ON "log_login"("login_method");
CREATE INDEX "idx_log_login_type_user" ON "log_login"("type_user");
CREATE INDEX "idx_appointment_orders_time_slot" ON "appointment_orders"("time_slot");
CREATE INDEX "idx_beauty_orders_time_slot" ON "beauty_orders"("time_slot");

-- Insert default users
INSERT INTO "users" ("username", "email", "password", "fullname", "phone_numbers", "roles", "address", "city", "country", "created_at") VALUES
('customer', 'customer@petcare.com', '$2b$10$mCT/vjETWWeusgX6hCPTXeD6DCWaFsU.Gdr2WLaUwS7x6sBPIB95W', 'Customer User', '0123456789', 'customer', '123 Customer Street', 'Ho Chi Minh City', 'Vietnam', NOW()),
('staff', 'staff@petcare.com', '$2b$10$mCT/vjETWWeusgX6hCPTXeD6DCWaFsU.Gdr2WLaUwS7x6sBPIB95W', 'Staff User', '0987654321', 'staff', '456 Staff Avenue', 'Ho Chi Minh City', 'Vietnam', NOW()),
('admin', 'admin@petcare.com', '$2b$10$mCT/vjETWWeusgX6hCPTXeD6DCWaFsU.Gdr2WLaUwS7x6sBPIB95W', 'Admin User', '0111222333', 'admin', '789 Admin Boulevard', 'Ho Chi Minh City', 'Vietnam', NOW());

ALTER TYPE "roles_t" ADD VALUE 'doctor';

INSERT INTO "users" ("username", "email", "password", "fullname", "phone_numbers", "roles", "address", "city", "country", "created_at") VALUES
('doctor', 'doctor@petcare.com', '$2b$10$mCT/vjETWWeusgX6hCPTXeD6DCWaFsU.Gdr2WLaUwS7x6sBPIB95W', 'Doctor User', '0123456789', 'doctor', '123 Doctor Street', 'Ho Chi Minh City', 'Vietnam', NOW());
-- 1. Bảng room
INSERT INTO public.room (type, max_slot, current_slot, price, unit) VALUES
  ('vip',     4, 1,  500000.0, 'VND'),
  ('normal',  6, 3,  300000.0, 'VND');
  

-- 2. Bảng time_slot_beauty
INSERT INTO public.time_slot_beauty (time,    price,    unit) VALUES
  ('09:00:00', 200000.0, 'VND'),
  ('11:00:00', 250000.0, 'VND'),
  ('14:00:00', 300000.0, 'VND');

-- 3. Bảng time_slot_appointment
INSERT INTO public.time_slot_appointment (time,    price,    unit) VALUES
  ('08:30:00', 150000.0, 'VND'),
  ('10:30:00', 180000.0, 'VND'),
  ('13:30:00', 220000.0, 'VND');
