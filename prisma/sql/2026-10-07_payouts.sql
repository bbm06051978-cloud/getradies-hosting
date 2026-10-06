-- Records when GeTradie has paid a tradie their share of a lock amount.
-- Additive and safe to run more than once.
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "payoutAmount" DOUBLE PRECISION;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "payoutPaidAt" TIMESTAMP(3);
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "payoutReference" TEXT;
