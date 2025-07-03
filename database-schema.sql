-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create yearbook_profiles table
CREATE TABLE IF NOT EXISTS yearbook_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    wallet_address VARCHAR(100),
    favorite_crypto VARCHAR(50),
    crypto_quote TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    page_number INTEGER DEFAULT 1,
    position_on_page INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yearbook_badges table
CREATE TABLE IF NOT EXISTS yearbook_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yearbook_user_badges table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS yearbook_user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES yearbook_badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Create yearbook_whiteboard_drawings table
CREATE TABLE IF NOT EXISTS yearbook_whiteboard_drawings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    drawing_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yearbook_pages table
CREATE TABLE IF NOT EXISTS yearbook_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_number INTEGER UNIQUE NOT NULL,
    title VARCHAR(200),
    theme VARCHAR(100),
    background_color VARCHAR(20),
    layout_type VARCHAR(50) DEFAULT 'grid',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE yearbook_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearbook_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearbook_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearbook_whiteboard_drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearbook_pages ENABLE ROW LEVEL SECURITY;

-- Policies for yearbook_profiles
CREATE POLICY "Public profiles are viewable by everyone" ON yearbook_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON yearbook_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON yearbook_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON yearbook_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for yearbook_badges
CREATE POLICY "Badges are viewable by everyone" ON yearbook_badges
    FOR SELECT USING (true);

-- Policies for yearbook_user_badges
CREATE POLICY "User badges are viewable by everyone" ON yearbook_user_badges
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own badges" ON yearbook_user_badges
    FOR ALL USING (auth.uid() = user_id);

-- Policies for yearbook_whiteboard_drawings
CREATE POLICY "Drawings are viewable by everyone" ON yearbook_whiteboard_drawings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own drawings" ON yearbook_whiteboard_drawings
    FOR ALL USING (auth.uid() = user_id);

-- Policies for yearbook_pages
CREATE POLICY "Published pages are viewable by everyone" ON yearbook_pages
    FOR SELECT USING (is_published = true);

-- Functions

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO yearbook_profiles (user_id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_yearbook_profiles_updated_at
    BEFORE UPDATE ON yearbook_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yearbook_whiteboard_drawings_updated_at
    BEFORE UPDATE ON yearbook_whiteboard_drawings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yearbook_pages_updated_at
    BEFORE UPDATE ON yearbook_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample badges
INSERT INTO yearbook_badges (name, description, icon, rarity) VALUES
('Diamond Hands', 'Held through major market downturns', '💎', 'epic'),
('Whale', 'Holds significant amounts of cryptocurrency', '🐳', 'legendary'),
('DeFi Farmer', 'Active in decentralized finance protocols', '🌾', 'rare'),
('NFT Collector', 'Owns multiple NFTs', '🖼️', 'common'),
('Meme Lord', 'Creates quality crypto memes', '😂', 'common'),
('Early Adopter', 'Got into crypto before it was cool', '🚀', 'epic'),
('HODL Master', 'Never sold, only bought more', '💪', 'rare'),
('Degen Trader', 'Lives for the thrill of high-risk trades', '🎲', 'epic'),
('Community Builder', 'Helps grow the crypto community', '🏠', 'rare'),
('Technical Analyst', 'Reads charts like a pro', '📈', 'common')
ON CONFLICT DO NOTHING;

-- Sample yearbook pages
INSERT INTO yearbook_pages (page_number, title, theme, background_color, layout_type) VALUES
(1, 'The OG Adopters', 'classic', '#faf7f0', 'grid'),
(2, 'DeFi Degenerates', 'modern', '#f0f9f0', 'grid'),
(3, 'NFT Enthusiasts', 'artistic', '#f5f0ff', 'grid'),
(4, 'Meme Team', 'fun', '#fff0f5', 'grid'),
(5, 'The HODL Squad', 'vintage', '#f0fff0', 'grid')
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_yearbook_profiles_user_id ON yearbook_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_yearbook_profiles_page_number ON yearbook_profiles(page_number);
CREATE INDEX IF NOT EXISTS idx_yearbook_profiles_username ON yearbook_profiles(username);
CREATE INDEX IF NOT EXISTS idx_yearbook_user_badges_user_id ON yearbook_user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_yearbook_user_badges_badge_id ON yearbook_user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_yearbook_whiteboard_drawings_page_number ON yearbook_whiteboard_drawings(page_number);
CREATE INDEX IF NOT EXISTS idx_yearbook_whiteboard_drawings_user_id ON yearbook_whiteboard_drawings(user_id);