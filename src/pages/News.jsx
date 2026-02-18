import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Bell, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ResumeLoader from "@/components/common/ResumeLoader";
import NewsFilterBar from "@/components/news/NewsFilterBar";
import NewsCard from "@/components/news/NewsCard";
import SEONewsEnhanced from "@/components/seo/SEONewsEnhanced";

export default function News() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Fetch the top 12 trending news articles about the job market, career advice, and skills development. Use your access to the internet to find real, current articles from today. For each article, provide a title, a 2-3 sentence summary, the source name, the original article URL, the publication date, and assign a relevant category. The categories are: 'Hiring Trends', 'Salary Insights', 'Remote Work', 'AI Impact', 'Skill Development', 'Industry News'.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  source: { type: "string" },
                  url: {type: "string"},
                  published_date: { type: "string", format: "date" },
                  category: { type: "string", enum: ['Hiring Trends', 'Salary Insights', 'Remote Work', 'AI Impact', 'Skill Development', 'Industry News'] },
                  read_time: { type: "number" }
                },
                required: ["title", "summary", "source", "url", "published_date", "category", "read_time"]
              }
            }
          }
        }
      });
      if (response.articles) {
        setNews(response.articles);
      }
    } catch (error) {
      console.error("Error loading news:", error);
      // You can add a fallback to sample data here if you want
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <ResumeLoader />;
  }

  return (
    <>
      <SEONewsEnhanced />
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-8 h-8 text-[var(--brand-error)]" />
          <h1 className="text-3xl font-bold text-[var(--brand-text-primary)]">Career News & Trends</h1>
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
            <TrendingUp className="w-4 h-4 mr-1" /> Live
          </Badge>
        </div>
        <p className="text-[var(--brand-text-secondary)] text-lg">
          Stay updated with the latest job market trends, salary insights, and career opportunities.
        </p>
      </motion.div>

      <NewsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onRefresh={loadNews}
      />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article, index) => (
            <NewsCard key={index} article={article} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}