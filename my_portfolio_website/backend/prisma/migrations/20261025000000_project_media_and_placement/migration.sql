-- Additive migration. Existing featured placement and all project/media rows survive.
ALTER TYPE "AssetType" ADD VALUE IF NOT EXISTS 'VIDEO';
ALTER TABLE "Project"
  ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "showOnProjectsPage" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "homepageOrder" INTEGER NOT NULL DEFAULT 0;
UPDATE "Project" SET "showOnHomepage" = "featured";
ALTER TABLE "ProjectMedia"
  ADD COLUMN "caption" TEXT,
  ADD COLUMN "posterUrl" TEXT,
  ADD COLUMN "publicId" TEXT,
  ADD COLUMN "provider" TEXT,
  ADD COLUMN "mimeType" TEXT,
  ADD COLUMN "bytes" INTEGER;
