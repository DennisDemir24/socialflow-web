interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
