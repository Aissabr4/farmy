-- Update all existing user avatars to use simpler parameters that work better
UPDATE public.users
SET avatar = CASE
    WHEN name LIKE '%John%' THEN CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=blue&top=hat&clothingGraphic=bear&facialHairColor=black&facialHairType=beardMedium')
    WHEN name LIKE '%Mike%' THEN CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=brown&top=winterHat01&clothingGraphic=skull&facialHairColor=black&facialHairType=beardMajestic')
    WHEN name LIKE '%David%' THEN CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=green&top=winterHat03&clothingGraphic=deer&facialHairColor=black&facialHairType=beardLight')
    WHEN name LIKE '%Sarah%' THEN CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=green&top=hat&clothingGraphic=deer&facialHairColor=brown&facialHairType=beardLight')
    WHEN name LIKE '%Emily%' THEN CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=blue&top=winterHat02&clothingGraphic=bear&facialHairColor=brown&facialHairType=beardMedium')
    ELSE CONCAT('https://api.dicebear.com/7.x/avataaars/svg?seed=', name, '&gender=male&clothingColor=blue&top=hat&clothingGraphic=bear&facialHairColor=black&facialHairType=beardMedium')
END
WHERE avatar IS NULL OR avatar LIKE '%clothingColor=blue,green,brown%';