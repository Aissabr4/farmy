-- Update all existing user avatars to use farm-style male avatars
UPDATE public.users
SET avatar = CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight')
WHERE avatar IS NULL OR avatar NOT LIKE '%clothingColor=blue,green,brown%';