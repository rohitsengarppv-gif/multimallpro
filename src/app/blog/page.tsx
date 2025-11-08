"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Calendar, 
  User, 
  Eye, 
  MessageCircle, 
  Heart,
  Share2,
  Search,
  Tag,
  ArrowRight,
  Clock
} from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  views: number;
  comments: number;
  likes: number;
  image: string;
  featured: boolean;
};

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Must-Have Tech Gadgets for 2024",
    excerpt: "Discover the latest technology trends and gadgets that are revolutionizing our daily lives. From smart home devices to cutting-edge wearables.",
    content: "Full article content here...",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    category: "Technology",
    tags: ["Tech", "Gadgets", "Innovation", "2024"],
    publishDate: "Nov 1, 2024",
    readTime: 8,
    views: 1250,
    comments: 23,
    likes: 89,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
    featured: true
  },
  {
    id: "2",
    title: "Home Decor Trends That Will Transform Your Space",
    excerpt: "Explore the latest interior design trends and learn how to create a beautiful, functional living space on any budget.",
    content: "Full article content here...",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    category: "Home & Living",
    tags: ["Home Decor", "Interior Design", "Trends"],
    publishDate: "Oct 28, 2024",
    readTime: 6,
    views: 890,
    comments: 15,
    likes: 67,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: "3",
    title: "The Ultimate Guide to Online Shopping Safety",
    excerpt: "Stay safe while shopping online with these essential tips and best practices for secure e-commerce transactions.",
    content: "Full article content here...",
    author: {
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    category: "Shopping Tips",
    tags: ["Safety", "Online Shopping", "Security", "Tips"],
    publishDate: "Oct 25, 2024",
    readTime: 5,
    views: 2100,
    comments: 45,
    likes: 156,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    featured: true
  },
  {
    id: "4",
    title: "Sustainable Fashion: Building an Eco-Friendly Wardrobe",
    excerpt: "Learn how to make conscious fashion choices that benefit both your style and the environment.",
    content: "Full article content here...",
    author: {
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    category: "Fashion",
    tags: ["Sustainable Fashion", "Eco-Friendly", "Style"],
    publishDate: "Oct 20, 2024",
    readTime: 7,
    views: 1450,
    comments: 28,
    likes: 92,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: "5",
    title: "Kitchen Essentials Every Home Cook Needs",
    excerpt: "Discover the must-have kitchen tools and appliances that will elevate your cooking game.",
    content: "Full article content here...",
    author: {
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    category: "Kitchen & Cooking",
    tags: ["Kitchen", "Cooking", "Essentials", "Tools"],
    publishDate: "Oct 15, 2024",
    readTime: 9,
    views: 1780,
    comments: 34,
    likes: 124,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: "6",
    title: "Fitness Equipment for Your Home Gym Setup",
    excerpt: "Create the perfect home workout space with these essential fitness equipment recommendations.",
    content: "Full article content here...",
    author: {
      name: "David Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    category: "Fitness & Health",
    tags: ["Fitness", "Home Gym", "Equipment", "Health"],
    publishDate: "Oct 10, 2024",
    readTime: 6,
    views: 1320,
    comments: 19,
    likes: 78,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    featured: false
  }
];

const categories = ["All", "Technology", "Home & Living", "Shopping Tips", "Fashion", "Kitchen & Cooking", "Fitness & Health"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights from our experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          likedPosts.has(post.id)
                            ? "bg-rose-600 text-white"
                            : "bg-white/80 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min read
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-900">{post.author.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <article
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        likedPosts.has(post.id)
                          ? "bg-rose-600 text-white"
                          : "bg-white/80 text-gray-700 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} min
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs font-medium text-gray-900">{post.author.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss the latest articles, tips, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
