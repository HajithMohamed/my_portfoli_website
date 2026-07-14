-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entryPath" TEXT,
    "exitPath" TEXT,
    "referrer" TEXT,
    "source" TEXT NOT NULL DEFAULT 'Direct',
    "device" TEXT NOT NULL DEFAULT 'desktop',
    "os" TEXT,
    "browser" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "region" TEXT,
    "city" TEXT,
    "isReturning" BOOLEAN NOT NULL DEFAULT false,
    "pageViewCount" INTEGER NOT NULL DEFAULT 0,
    "maxScrollDepth" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "scrollDepth" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_sessionKey_key" ON "VisitorSession"("sessionKey");

-- CreateIndex
CREATE INDEX "VisitorSession_startedAt_idx" ON "VisitorSession"("startedAt");

-- CreateIndex
CREATE INDEX "VisitorSession_lastSeenAt_idx" ON "VisitorSession"("lastSeenAt");

-- CreateIndex
CREATE INDEX "VisitorSession_visitorId_idx" ON "VisitorSession"("visitorId");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
