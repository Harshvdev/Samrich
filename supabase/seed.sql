-- ==============================================================================
-- Seed Data: Samrich Poems & Stories
-- ==============================================================================

-- 1. Default Profile
INSERT INTO public.profiles (display_name, slug, bio)
VALUES (
    'Samrich',
    'samrich',
    'Poet and short story writer exploring silence, memory, and the unseen contours of everyday life.'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Tags
INSERT INTO public.tags (id, name, slug)
VALUES 
    ('11111111-1111-1111-1111-111111111101', 'Solitude', 'solitude'),
    ('11111111-1111-1111-1111-111111111102', 'Dusk & Dawn', 'dusk-and-dawn'),
    ('11111111-1111-1111-1111-111111111103', 'Memory', 'memory'),
    ('11111111-1111-1111-1111-111111111104', 'Short Fiction', 'short-fiction'),
    ('11111111-1111-1111-1111-111111111105', 'Rain', 'rain')
ON CONFLICT (slug) DO NOTHING;

-- 3. Sample Featured Poems & Stories
-- Poem 1: The Orchard at Twilight
INSERT INTO public.posts (
    id, title, slug, excerpt, content_html, type, status, reading_time, published_at
) VALUES (
    '22222222-2222-2222-2222-222222222201',
    'The Orchard at Twilight',
    'the-orchard-at-twilight',
    'You are alone with your one wooden ladder, the whole orchard making its quiet demands.',
    '<div class="poem-stanza"><p>You stand alone with your one wooden ladder,<br>the whole orchard leaning in,<br>making its quiet, fragrant demands.</p></div><div class="poem-stanza"><p>Above the branch where the apples gather weight,<br>a flock of cedar waxwings dips<br>into the silver basin of the evening air.</p></div><div class="poem-stanza"><p>No one told the trees<br>how to hold what is about to fall.<br>They simply open their wooden hands,<br>and let the dark take what it needs.</p></div>',
    'poem',
    'published',
    '2 min read',
    now() - interval '3 days'
) ON CONFLICT (slug) DO NOTHING;

-- Poem 2: Map of an Unlit Street
INSERT INTO public.posts (
    id, title, slug, excerpt, content_html, type, status, reading_time, published_at
) VALUES (
    '22222222-2222-2222-2222-222222222202',
    'Map of an Unlit Street',
    'map-of-an-unlit-street',
    'What the lamppost leaves unsaid when the copper wiring hums in early winter.',
    '<div class="poem-stanza"><p>Between the shuttered bakery and the fence,<br>the lamppost stutters once,<br>humming its copper prayer to the damp asphalt.</p></div><div class="poem-stanza"><p>I walked this lane before the frost took hold.<br>I carried an envelope with no return address,<br>heavy with names that refused to fit the page.</p></div><div class="poem-stanza"><p>Tell me again how distance works:<br>how two people can stand beneath the same sky<br>and listen to completely different rain.</p></div>',
    'poem',
    'published',
    '2 min read',
    now() - interval '7 days'
) ON CONFLICT (slug) DO NOTHING;

-- Story 1: The Watchmaker of Old Canton
INSERT INTO public.posts (
    id, title, slug, excerpt, content_html, type, status, reading_time, published_at
) VALUES (
    '22222222-2222-2222-2222-222222222203',
    'The Watchmaker of Old Canton',
    'the-watchmaker-of-old-canton',
    'For forty years, Mr. Hallowell refused to repair clocks that ran fast. "Haste," he would mutter, "is a defect of character."',
    '<p class="first-paragraph">For forty years, Mr. Hallowell refused to repair clocks that ran fast. "Haste," he would mutter to whichever customer dared set an eager carriage clock on his velvet cloth, "is a defect of character, not mechanics."</p><p>His shop sat between a tea merchant and an unlisted bookbinder on an alleyway so narrow that rain only fell upon it when the wind tilted northwest. Inside, hundreds of escapements ticked in polite, unsynchronized discord—a gentle rain of brass teeth and jeweled pivots that swallowed conversation whole.</p><p>One November Tuesday, a young woman brought in an ornate pocket chronometer. It was cased in coin silver, worn smooth where generations of thumbs had opened its hunter cover. The balance wheel had frozen at fourteen minutes past three.</p><p>"Can you make it breathe again?" she asked, her knuckles pale against the glass counter.</p><p>Hallowell took up his jeweler''s loupe, screwed it into his right eye socket, and eased open the movement. Deep within the barrel arbor, caught in the spiral of the blued-steel hairspring, lay a single strand of dried lavender. Not rusted, not snapped. Just waiting.</p><p>"It didn''t stop from wear," he whispered after a long silence. "Someone wished very hard for that moment to stay."</p>',
    'story',
    'published',
    '6 min read',
    now() - interval '10 days'
) ON CONFLICT (slug) DO NOTHING;

-- Post Tags Relationships
INSERT INTO public.post_tags (post_id, tag_id)
VALUES 
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101'),
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111102'),
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111103'),
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111105'),
    ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111104'),
    ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111103')
ON CONFLICT DO NOTHING;

-- Sample Approved Reader Comments
INSERT INTO public.comments (post_id, author_name, content, status, created_at)
VALUES 
    ('22222222-2222-2222-2222-222222222201', 'Clara V.', 'The closing lines about the trees opening their wooden hands took my breath away. Such quiet tenderness.', 'approved', now() - interval '2 days'),
    ('22222222-2222-2222-2222-222222222202', 'Julian M.', 'Captures that exact winter evening solitude in city streets.', 'approved', now() - interval '5 days');
