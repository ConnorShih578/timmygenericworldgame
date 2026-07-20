-- Database Schema for Conquer World Game
-- Run this in your Supabase SQL Editor to support room discovery!

-- 1. Create the rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(10) UNIQUE NOT NULL,
    era VARCHAR(30) NOT NULL,
    host_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'playing', 'finished'
    player_count INTEGER DEFAULT 1,
    max_players INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to read active rooms (lobby discovery)
CREATE POLICY "Allow public read rooms" 
ON public.rooms FOR SELECT 
USING (status = 'waiting');

-- Allow anyone to create a room
CREATE POLICY "Allow public insert rooms" 
ON public.rooms FOR INSERT 
WITH CHECK (true);

-- Allow updates (status changes, player joins)
CREATE POLICY "Allow public update rooms" 
ON public.rooms FOR UPDATE 
USING (true);

-- 4. Enable Realtime on the rooms table (to sync lobbies)
alter publication supabase_realtime add table public.rooms;

-- 5. Helper function & trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_updated_at_column = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
