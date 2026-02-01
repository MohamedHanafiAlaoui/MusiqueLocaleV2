-- Insert sample tracks for testing
INSERT INTO track (title, artist, description, category, duration, file_size, file_url, cover_image) VALUES
('Test Song 1', 'Test Artist 1', 'This is a test song', 'pop', 180, 5000000, '/uploads/music/test1.mp3', 'https://via.placeholder.com/300'),
('Test Song 2', 'Test Artist 2', 'Another test song', 'rock', 240, 6000000, '/uploads/music/test2.mp3', 'https://via.placeholder.com/300'),
('Test Song 3', 'Test Artist 3', 'Test song without audio', 'jazz', 200, 0, NULL, 'https://via.placeholder.com/300');
