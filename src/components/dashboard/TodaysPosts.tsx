import { usePostStore } from "@/store/postStore";
import { format, isToday } from "date-fns";

export function TodaysPosts() {
  const { posts } = usePostStore();
  
  const todaysPosts = posts
    .filter(post => isToday(post.scheduledTime))
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Today's Posts</h3>
        <span className="text-sm text-muted-foreground">
          {format(new Date(), 'MMMM d, yyyy')}
        </span>
      </div>
      
      {todaysPosts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No posts scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
            >
              <div className="space-y-1">
                <p className="font-medium">{post.title}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span className="capitalize">{post.platform}</span>
                  <span>•</span>
                  <span>{format(post.scheduledTime, "h:mm a")}</span>
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
      )}
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Total posts today:</span>
          <span>{todaysPosts.length}</span>
        </div>
      </div>
    </div>
  );
}
