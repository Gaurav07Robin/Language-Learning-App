-- 1. Users table (Links to Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_language TEXT,
    focus_track TEXT CHECK (focus_track IN ('coding', 'spoken')),
    current_level TEXT,
    daily_goal INT DEFAULT 15, -- minutes or points
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Curriculums
CREATE TABLE curriculums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT NOT NULL,
    level TEXT NOT NULL,
    roadmap_skeleton JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Generated Units (Global Cache)
CREATE TABLE generated_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID REFERENCES curriculums(id) ON DELETE CASCADE,
    topic_name TEXT NOT NULL,
    content_payload JSONB NOT NULL, -- { theory_bites, vocabulary_list, interactive_quiz }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(curriculum_id, topic_name)
);

-- 5. User Progress
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES generated_units(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('locked', 'unlocked', 'passed')) DEFAULT 'locked',
    score INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, unit_id)
);
