-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'TEXTAREA', 'RICHTEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'DATETIME', 'EMAIL', 'URL', 'MEDIA', 'JSON', 'SELECT');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "content_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "field_type" "FieldType" NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_unique" BOOLEAN NOT NULL DEFAULT false,
    "default_value" JSONB,
    "validations" JSONB,
    "options" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content_type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "content_type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_values" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_types_name_key" ON "content_types"("name");

-- CreateIndex
CREATE INDEX "fields_content_type_id_idx" ON "fields"("content_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "fields_content_type_id_name_key" ON "fields"("content_type_id", "name");

-- CreateIndex
CREATE INDEX "contents_content_type_id_idx" ON "contents"("content_type_id");

-- CreateIndex
CREATE INDEX "contents_status_idx" ON "contents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "contents_content_type_id_slug_key" ON "contents"("content_type_id", "slug");

-- CreateIndex
CREATE INDEX "field_values_content_id_idx" ON "field_values"("content_id");

-- CreateIndex
CREATE INDEX "field_values_field_id_idx" ON "field_values"("field_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_values_content_id_field_id_key" ON "field_values"("content_id", "field_id");

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_values" ADD CONSTRAINT "field_values_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_values" ADD CONSTRAINT "field_values_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
