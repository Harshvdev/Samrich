import { createClient } from '@/lib/supabase/server';
import { Post, Tag, Comment } from '@/types/database';

// Fallback seed content for immediate preview when database is cold
const FALLBACK_POSTS: Post[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    title: 'The Orchard at Twilight',
    slug: 'the-orchard-at-twilight',
    excerpt: 'You stand alone with your one wooden ladder, the whole orchard making its quiet demands.',
    content: null,
    content_html: `
      <div class="poem-stanza">
        <p>You stand alone with your one wooden ladder,<br />
        the whole orchard leaning in,<br />
        making its quiet, fragrant demands.</p>
      </div>
      <div class="poem-stanza">
        <p>Above the branch where the apples gather weight,<br />
        a flock of cedar waxwings dips<br />
        into the silver basin of the evening air.</p>
      </div>
      <div class="poem-stanza">
        <p>No one told the trees<br />
        how to hold what is about to fall.<br />
        They simply open their wooden hands,<br />
        and let the dark take what it needs.</p>
      </div>
    `,
    type: 'poem',
    status: 'published',
    cover_url: null,
    reading_time: '2 min read',
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: '1', name: 'Solitude', slug: 'solitude', created_at: '' },
      { id: '2', name: 'Dusk & Dawn', slug: 'dusk-and-dawn', created_at: '' }
    ],
    likes_count: 14,
    comments_count: 1
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    title: 'Map of an Unlit Street',
    slug: 'map-of-an-unlit-street',
    excerpt: 'What the lamppost leaves unsaid when the copper wiring hums in early winter.',
    content: null,
    content_html: `
      <div class="poem-stanza">
        <p>Between the shuttered bakery and the fence,<br />
        the lamppost stutters once,<br />
        humming its copper prayer to the damp asphalt.</p>
      </div>
      <div class="poem-stanza">
        <p>I walked this lane before the frost took hold.<br />
        I carried an envelope with no return address,<br />
        heavy with names that refused to fit the page.</p>
      </div>
      <div class="poem-stanza">
        <p>Tell me again how distance works:<br />
        how two people can stand beneath the same sky<br />
        and listen to completely different rain.</p>
      </div>
    `,
    type: 'poem',
    status: 'published',
    cover_url: null,
    reading_time: '2 min read',
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: '3', name: 'Memory', slug: 'memory', created_at: '' },
      { id: '5', name: 'Rain', slug: 'rain', created_at: '' }
    ],
    likes_count: 28,
    comments_count: 1
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    title: 'The Watchmaker of Old Canton',
    slug: 'the-watchmaker-of-old-canton',
    excerpt: 'For forty years, Mr. Hallowell refused to repair clocks that ran fast. "Haste," he would mutter, "is a defect of character."',
    content: null,
    content_html: `
      <p class="first-paragraph">For forty years, Mr. Hallowell refused to repair clocks that ran fast. "Haste," he would mutter to whichever customer dared set an eager carriage clock on his velvet cloth, "is a defect of character, not mechanics."</p>
      <p>His shop sat between a tea merchant and an unlisted bookbinder on an alleyway so narrow that rain only fell upon it when the wind tilted northwest. Inside, hundreds of escapements ticked in polite, unsynchronized discord—a gentle rain of brass teeth and jeweled pivots that swallowed conversation whole.</p>
      <p>One November Tuesday, a young woman brought in an ornate pocket chronometer. It was cased in coin silver, worn smooth where generations of thumbs had opened its hunter cover. The balance wheel had frozen at fourteen minutes past three.</p>
      <p>"Can you make it breathe again?" she asked, her knuckles pale against the glass counter.</p>
      <p>Hallowell took up his jeweler's loupe, screwed it into his right eye socket, and eased open the movement. Deep within the barrel arbor, caught in the spiral of the blued-steel hairspring, lay a single strand of dried lavender. Not rusted, not snapped. Just waiting.</p>
      <p>"It didn't stop from wear," he whispered after a long silence. "Someone wished very hard for that moment to stay."</p>
    `,
    type: 'story',
    status: 'published',
    cover_url: null,
    reading_time: '5 min read',
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: '4', name: 'Short Fiction', slug: 'short-fiction', created_at: '' },
      { id: '3', name: 'Memory', slug: 'memory', created_at: '' }
    ],
    likes_count: 42,
    comments_count: 0
  }
];

export async function getPublishedPosts(type?: 'poem' | 'story'): Promise<Post[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('posts')
      .select('*, tags(id, name, slug), post_videos(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return type ? FALLBACK_POSTS.filter(p => p.type === type) : FALLBACK_POSTS;
    }
    return data as Post[];
  } catch {
    return type ? FALLBACK_POSTS.filter(p => p.type === type) : FALLBACK_POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*, tags(id, name, slug), post_videos(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = FALLBACK_POSTS.find(p => p.slug === slug);
      return fallback || null;
    }
    return data as Post;
  } catch {
    const fallback = FALLBACK_POSTS.find(p => p.slug === slug);
    return fallback || null;
  }
}

export async function getApprovedComments(postId: string): Promise<Comment[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data as Comment[];
  } catch {
    return [];
  }
}

export async function getLikesCount(postId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error || count === null) {
      const fallback = FALLBACK_POSTS.find(p => p.id === postId);
      return fallback?.likes_count || 0;
    }
    return count;
  } catch {
    return 0;
  }
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { id: '1', name: 'Solitude', slug: 'solitude', created_at: '' },
        { id: '2', name: 'Dusk & Dawn', slug: 'dusk-and-dawn', created_at: '' },
        { id: '3', name: 'Memory', slug: 'memory', created_at: '' },
        { id: '4', name: 'Short Fiction', slug: 'short-fiction', created_at: '' },
        { id: '5', name: 'Rain', slug: 'rain', created_at: '' }
      ];
    }
    return data as Tag[];
  } catch {
    return [];
  }
}
