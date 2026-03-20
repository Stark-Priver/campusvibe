-- StudentRecord Table
CREATE TABLE IF NOT EXISTS student_records (
    id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    course VARCHAR(64) NOT NULL,
    year INT NOT NULL,
    is_eligible BOOLEAN NOT NULL,
    synced_at TIMESTAMP
);

-- AttendanceLog Table
CREATE TABLE IF NOT EXISTS attendance_logs (
    id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    session_type VARCHAR(16) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    is_synced BOOLEAN NOT NULL
);

-- SyncQueueItem Table (for logging only, not required in Supabase for sync logic)
-- CREATE TABLE IF NOT EXISTS sync_queue_items (
--     id BIGSERIAL PRIMARY KEY,
--     record_type VARCHAR(32) NOT NULL,
--     record_id BIGINT NOT NULL,
--     action VARCHAR(16) NOT NULL,
--     created_at TIMESTAMP NOT NULL
-- );
