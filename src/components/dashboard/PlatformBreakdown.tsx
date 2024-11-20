import { usePostStore } from "@/store/postStore";

export function PlatformBreakdown() {
  const { posts } = usePostStore();
  
  const platformCounts = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPosts = posts.length;
  const platforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold mb-4">Platform Breakdown</h3>
      <div className="space-y-4">
        {platforms.map(([platform, count]) => {
          const percentage = Math.round((count / totalPosts) * 100);
          return (
            <div key={platform} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium capitalize">{platform}</span>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${
                    platform === "twitter"
                      ? "bg-blue-500"
                      : platform === "facebook"
                      ? "bg-indigo-500"
                      : platform === "instagram"
                      ? "bg-pink-500"
                      : "bg-purple-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
