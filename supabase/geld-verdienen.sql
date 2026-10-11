-- Creator-code (Fortnite Support-a-Creator) per creator. Eenmalig uitvoeren in de SQL Editor.
alter table creators add column if not exists support_code text;

-- Voorbeelden (pas aan en voer uit):
-- update creators set support_code = 'JOUWCODE' where slug = 'ehvgaming';
-- update creators set setup = '[
--   {"label": "Headset",    "name": "Merk Model"},
--   {"label": "Controller", "name": "Merk Model"},
--   {"label": "Monitor",    "name": "Merk Model", "url": "https://www.coolblue.nl/product/..."}
-- ]' where slug = 'ehvgaming';
-- Zonder "url" linkt de knop naar een Coolblue-zoekopdracht op de naam; met een Coolblue-url naar dat product.
