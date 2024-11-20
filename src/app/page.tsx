'use client';

import { Activity, BarChart3, MessageSquare, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TodaysPosts } from "@/components/dashboard/TodaysPosts";
import { PlatformBreakdown } from "@/components/dashboard/PlatformBreakdown";
import { usePostStore } from "@/store/postStore";
import { isToday } from "date-fns";

export default function Home() {
  const { posts } = usePostStore();

  // Calculate statistics
  const totalPosts = posts.length;
  const scheduledPosts = posts.filter(post => post.status === 'scheduled').length;
  const publishedPosts = posts.filter(post => post.status === 'published').length;
  const todaysPosts = posts.filter(post => isToday(post.scheduledTime)).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={BarChart3}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Today's Posts"
          value={todaysPosts}
          icon={Activity}
          description="Posts scheduled for today"
        />
        <StatCard
          title="Scheduled Posts"
          value={scheduledPosts}
          icon={MessageSquare}
          description="Upcoming posts"
        />
        <StatCard
          title="Published Posts"
          value={publishedPosts}
          icon={TrendingUp}
          description="All-time published"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <TodaysPosts />
        <PlatformBreakdown />
      </div>
    </div>
  );
}
