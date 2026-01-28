-- Add appointment notification types to enum
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'appointment_confirmed';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'appointment_cancelled';