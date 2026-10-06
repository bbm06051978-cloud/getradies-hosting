-- Job timing: save what the homeowner asks for when posting a job.
-- Additive only. Safe to run more than once. Nothing existing is altered or removed.

ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "urgency" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "budget" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "preferredAt" TIMESTAMP(3);
