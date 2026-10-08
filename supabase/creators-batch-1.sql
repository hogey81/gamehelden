-- First batch of Dutch gaming creators. Run once in Supabase (SQL Editor > New query > Run).
-- Channel IDs were looked up on YouTube on 2026-10-08, so the sync can't pick a look-alike
-- channel. Games come from each channel's description; adjust them in the Table Editor.
insert into creators (slug, handle, channel_id, games) values
  ('royalistiq',        '@Royalistiq',        'UC6UTBWQJOvtGIjdBcC7WwPw', '{fortnite,gta,minecraft}'),
  ('qucee',             '@Qucee',             'UCfqnx4kPKA4kaaUDODirUwg', '{fortnite,gta}'),
  ('vthorben',          '@vThorben',          'UCfAc9LkMfi5t2zQneTObYTg', '{fortnite}'),
  ('vakogames',         '@VakoGames',         'UCT-AZz7xGucVz30fjSOxkwA', '{fortnite,minecraft}'),
  ('games4real',        '@games4real',        'UC9SeqSlo6OiBLuHjKqnu8Pg', '{fortnite,gta}'),
  ('omgitstiesto',      '@OMGitsTiesto',      'UCmvIX5eB4L9Rq5H_gdOcmgg', '{fortnite}'),
  ('noahtje',           '@Noahtje',           'UCj5AehF5EjOOk40XDz_t9GA', '{fortnite,ea-fc,minecraft,cod}'),
  ('glero',             '@Glero',             'UCHsyUZ7TvrNNZjaXLxAAGsw', '{fortnite,gta,minecraft}'),
  ('gamemeneer',        '@GameMeneer',        'UCU0TjDaglN5awRHKY_tThzA', '{}'),
  ('dutchtuber',        '@Dutchtuber',        'UCzWgtYoa3X7p8zJk5pEr6ww', '{minecraft,roblox}'),
  ('dutchtubergaming',  '@DutchtuberGaming',  'UCBS1vxH489OL-oN7P3HUsPw', '{}'),
  ('enzoknol2',         '@EnzoKnol2',         'UCAvSf9id_1Lz-NI11yYK46A', '{}'),
  ('dennus2',           '@Dennus2',           'UCA01rHjMSyYrbAitCmrct8A', '{minecraft,roblox}'),
  ('dennus3',           '@Dennus3',           'UC-9IwXkuThytX-AdxXFzUog', '{roblox}'),
  ('clonnygames',       '@clonnygames',       'UCPex89Pgo06t4VSArO53y_Q', '{}'),
  ('paraduze',          '@Paraduze',          'UCaeE4Ci4qayB1i5NrlQMyEQ', '{}'),
  ('legendsofgamingnl', '@legendsofgamingnl', 'UC97XthQ7oIOfAWIGPoyFDYQ', '{}'),
  ('dylanpeys',         '@DylanPeys',         'UC0FS8uuTdt80f_RyBVggx9Q', '{minecraft,gta}'),
  ('harm2',             '@HARM2',             'UC1DiQDNzgMnKuib_66PeBHw', '{minecraft}'),
  ('lekkerspelen',      '@lekkerspelen',      'UCNz5474yx24nxVygk6kunLQ', '{}'),
  ('eengamestad',       '@EenGameStad',       'UCrbgPoMNeN0gqRWKjFTwybw', '{minecraft}'),
  ('davincstylegames',  '@DavincstyleGames',  'UCPp6IuyEDyslkrLM2ILHp_g', '{roblox}'),
  ('meermika',          '@MeerMika',          'UC5O3qsMH2O97wNbQ0M5uVmg', '{}')
on conflict (slug) do nothing;
