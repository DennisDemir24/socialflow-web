import { Post } from "@/components/calendar/Calendar";
import { usePostStore } from "@/store/postStore";
import { format } from "date-fns";

export function RecentPosts() {
  const { posts } = usePostStore();
  const recentPosts = posts
    .sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Recent Posts</h3>
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between border-b pb-4 last:border-0"
          >
            <div className="space-y-1">
              <p className="font-medium">{post.title}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{post.platform}</span>
                <span>•</span>
                <span>{format(post.scheduledTime, "MMM d, yyyy")}</span>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                post.status === "published"
                  ? "bg-green-100 text-green-700"
                  : post.status === "scheduled"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {post.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
