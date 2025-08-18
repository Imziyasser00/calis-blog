export type Category = {
    _id: string;
    title: string;
    slug?: { current: string };
};

export type PostCard = {
    _id: string;
    title: string;
    slug: string;
    publishedAt?: string;
    excerpt?: string;
    mainImage?: any;
    categoryTitles: string[];
};

export type Hero = {
    title: string;
    slug: string;
    mainImage?: any;
};

export type HomeData = {
    hero: Hero | null;
    featured: PostCard[];
    recent: PostCard[];
    topics: Category[];
};
