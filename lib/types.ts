export type FantasySpot = {
  id: string;

  title: string;
  catch_copy: string | null;
  story: string;

  legend_title: string | null;
  legend_story: string | null;
  legend_tagline: string | null;

  latitude: number;
  longitude: number;
  location_name: string | null;

  seed_text: string;
  genre: string;
  place_type: string;
  mood: string | null;

  quest: string | null;
  tags: string[];

  image_theme: string;
  image_url: string | null;

  generation_type: "template" | "ai";

  level: number;

  comment_count: number;
  believe_count: number;
  visited_count: number;
  want_to_go_count: number;

  author_name: string;
  user_id: string | null;
  is_public: boolean;

  created_at: string;
  updated_at: string;
};

export type FantasyComment = {
  id: string;
  spot_id: string;
  comment_text: string;
  author_name: string;
  user_id: string | null;
  created_at: string;
};

export type GeneratedSpot = {
  title: string;
  catchCopy: string;
  story: string;
  quest: string;
  tags: string[];
  imageTheme: string;
};

export type ReactionType = "believe" | "visited" | "want_to_go";
