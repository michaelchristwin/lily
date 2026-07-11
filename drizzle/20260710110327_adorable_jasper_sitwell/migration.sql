CREATE TYPE "role" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TYPE "status" AS ENUM('active', 'suspended', 'deleted');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL UNIQUE,
	"emailVerified" timestamp,
	"passwordHash" text NOT NULL,
	"firstName" text,
	"lastName" text,
	"phone" text,
	"phoneVerified" timestamp,
	"role" "role" DEFAULT 'customer'::"role" NOT NULL,
	"status" "status" DEFAULT 'active'::"status" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastLoginAt" timestamp DEFAULT now()
);
