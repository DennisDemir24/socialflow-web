import { create } from 'zustand';
import { Post } from '@/components/calendar/Calendar';
import { persist } from 'zustand/middleware';

interface PostState {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (postId: string) => void;
}

export const usePostStore = create<PostState>()(
  persist(
    (set) => ({
      posts: [
        {
          id: '1',
          title: 'Product Launch Announcement',
          content: 'Excited to announce our new product launch! Stay tuned for more details.',
          platform: 'twitter',
          scheduledTime: new Date('2024-02-01T09:00:00'),
          status: 'scheduled',
        },
        {
          id: '2',
          title: 'Customer Success Story',
          content: 'Check out how our customer achieved amazing results with our solution!',
          platform: 'linkedin',
          scheduledTime: new Date('2024-02-02T14:30:00'),
          status: 'draft',
        },
        {
          id: '3',
          title: 'Behind the Scenes',
          content: 'Take a peek behind the scenes at our latest photoshoot!',
          platform: 'instagram',
          scheduledTime: new Date('2024-02-03T11:00:00'),
          status: 'published',
        },
      ],
      addPost: (post: Post) =>
        set((state) => ({
          posts: [...state.posts, { ...post, id: post.id || Math.random().toString(36).substring(7) }],
        })),
      updatePost: (updatedPost: Post) =>
        set((state) => {
          console.log('Updating post:', updatedPost);
          const updatedPosts = state.posts.map((post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post
          );
          console.log('Updated posts:', updatedPosts);
          return { posts: updatedPosts };
        }),
      deletePost: (postId: string) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
    }),
    {
      name: 'social-flow-posts',
      partialize: (state) => ({
        posts: state.posts.map(post => ({
          ...post,
          scheduledTime: post.scheduledTime.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.posts) {
          state.posts = state.posts.map(post => ({
            ...post,
            scheduledTime: new Date(post.scheduledTime)
          }));
        }
      }
    }
  )
);
