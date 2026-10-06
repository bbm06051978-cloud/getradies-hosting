-- Dispute process: additive changes only. Safe to run more than once.
-- Nothing existing is altered or removed.

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "scheduleSetAt" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "markedDoneAt" TIMESTAMP(3);

ALTER TABLE "TradieProfile" ADD COLUMN IF NOT EXISTS "noShowCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "refundedAmount" DOUBLE PRECISION DEFAULT 0;

CREATE TABLE IF NOT EXISTS "Dispute" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "raisedById" TEXT NOT NULL,
    "raisedByRole" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "previousBookingStatus" TEXT NOT NULL,
    "previousJobStatus" TEXT NOT NULL,
    "responseDueAt" TIMESTAMP(3) NOT NULL,
    "responseType" TEXT,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "outcome" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "tradieAmount" DOUBLE PRECISION,
    "resolutionNote" TEXT,
    "resolvedBy" TEXT,
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Dispute_bookingId_idx" ON "Dispute"("bookingId");
CREATE INDEX IF NOT EXISTS "Dispute_status_idx" ON "Dispute"("status");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Dispute_bookingId_fkey') THEN
        ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_bookingId_fkey"
            FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Keep the new table closed to Supabase's public API. The app connects as the owner and is unaffected.
ALTER TABLE "Dispute" ENABLE ROW LEVEL SECURITY;
