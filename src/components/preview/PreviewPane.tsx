'use client';

import * as React from 'react';
import { format } from 'date-fns';
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100",
      className
    )}
    {...props}
  >
    <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600">
      @
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// Platform-specific configuration
const PLATFORM_CONFIGS = {
  twitter: {
    characterLimit: 280,
    hashtagStyle: 'text-blue-500 hover:underline cursor-pointer',
    mobileWidth: 'max-w-[380px]',
    desktopWidth: 'max-w-[500px]',
  },
  facebook: {
    characterLimit: 63206,
    hashtagStyle: 'text-blue-600 hover:underline cursor-pointer',
    mobileWidth: 'max-w-[380px]',
    desktopWidth: 'max-w-[500px]',
  },
  instagram: {
    characterLimit: 2200,
    hashtagStyle: 'text-blue-900 hover:underline cursor-pointer',
    mobileWidth: 'max-w-[380px]',
    desktopWidth: 'max-w-[400px]',
  },
  linkedin: {
    characterLimit: 3000,
    hashtagStyle: 'text-blue-600 hover:underline cursor-pointer',
    mobileWidth: 'max-w-[380px]',
    desktopWidth: 'max-w-[500px]',
  },
};

interface PreviewPaneProps {
  platform: string;
  content: string;
  title?: string;
  scheduledTime: Date;
}

// Function to strip HTML tags
function stripHtml(html: string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Function to format hashtags
function formatHashtags(text: string, hashtagStyle: string) {
  return text.replace(/#[\w]+/g, (match) => (
    `<span class="${hashtagStyle}">${match}</span>`
  ));
}

// Function to extract and format URLs
function formatUrls(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => (
    `<div class="mt-2 border rounded-lg overflow-hidden">
      <div class="bg-gray-50 p-2 text-sm text-gray-600">${url}</div>
      <div class="p-2">
        <div class="h-32 bg-gray-100 flex items-center justify-center text-gray-500">
          [Link preview will appear here]
        </div>
      </div>
    </div>`
  ));
}

export function PreviewPane({ platform, content, title, scheduledTime = new Date() }: PreviewPaneProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const platformConfig = PLATFORM_CONFIGS[platform?.toLowerCase()] || PLATFORM_CONFIGS.twitter;
  
  // Strip HTML and format content
  const plainContent = React.useMemo(() => {
    const stripped = stripHtml(content);
    const withHashtags = formatHashtags(stripped, platformConfig.hashtagStyle);
    return formatUrls(withHashtags);
  }, [content, platform]);

  // Character count warning
  const characterCount = stripHtml(content).length;
  const isOverLimit = characterCount > platformConfig.characterLimit;

  const previewContainerClass = cn(
    'transition-all duration-300',
    isMobile ? platformConfig.mobileWidth : platformConfig.desktopWidth
  );

  if (!platform || !plainContent) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 bg-gray-50 rounded-lg">
        No preview available
      </div>
    );
  }

  const ViewToggle = () => (
    <div className="flex items-center justify-end mb-4 space-x-2">
      <button
        onClick={() => setIsMobile(false)}
        className={cn(
          'px-3 py-1 rounded-lg text-sm',
          !isMobile ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
        )}
      >
        Desktop
      </button>
      <button
        onClick={() => setIsMobile(true)}
        className={cn(
          'px-3 py-1 rounded-lg text-sm',
          isMobile ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
        )}
      >
        Mobile
      </button>
    </div>
  );

  const CharacterCount = () => (
    <div className={cn(
      'text-sm mt-2',
      isOverLimit ? 'text-red-500' : 'text-gray-500'
    )}>
      {characterCount}/{platformConfig.characterLimit} characters
      {isOverLimit && ' (over limit)'}
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-lg border p-4 max-w-[500px]">
      <div className="flex items-start space-x-3">
        <Avatar />
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <span className="font-bold">{title || 'Your Name'}</span>
            <span className="text-gray-500">@username</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{format(scheduledTime, 'MMM d')}</span>
          </div>
          <div className="mt-2 text-gray-900 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: plainContent }} />
        </div>
      </div>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="bg-white rounded-lg border p-4 max-w-[500px]">
      <div className="flex items-center space-x-3 mb-3">
        <Avatar />
        <div>
          <div className="font-semibold">{title || 'Your Page Name'}</div>
          <div className="text-sm text-gray-500">{format(scheduledTime, 'MMMM d, yyyy')}</div>
        </div>
      </div>
      <div className="text-gray-900 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: plainContent }} />
    </div>
  );

  const renderInstagramPreview = () => (
    <div className="bg-white rounded-lg border max-w-[400px]">
      <div className="flex items-center space-x-3 p-3 border-b">
        <Avatar />
        <span className="font-semibold">{title || 'your_instagram'}</span>
      </div>
      <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-500">
        [Photo will appear here]
      </div>
      <div className="p-3">
        <div className="flex items-center space-x-3 mb-2">
          <span>❤️</span>
          <span>💬</span>
          <span>➡️</span>
        </div>
        <div>
          <span className="font-semibold mr-2">{title || 'your_instagram'}</span>
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: plainContent }} />
        </div>
        <div className="text-gray-500 text-sm mt-1">
          {format(scheduledTime, 'MMMM d, yyyy')}
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border p-4 max-w-[500px]">
      <div className="flex items-start space-x-3 mb-3">
        <Avatar />
        <div>
          <div className="font-semibold">{title || 'Your Name'}</div>
          <div className="text-sm text-gray-500">Your Title</div>
          <div className="text-sm text-gray-500">{format(scheduledTime, 'MMM d, yyyy')}</div>
        </div>
      </div>
      <div className="text-gray-900 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: plainContent }} />
    </div>
  );

  const renderPreview = () => {
    try {
      switch (platform.toLowerCase()) {
        case 'twitter':
          return renderTwitterPreview();
        case 'facebook':
          return renderFacebookPreview();
        case 'instagram':
          return renderInstagramPreview();
        case 'linkedin':
          return renderLinkedInPreview();
        default:
          return (
            <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500 bg-gray-50 rounded-lg">
              Preview not available for this platform
            </div>
          );
      }
    } catch (err: any) {
      console.error('Error rendering preview:', err?.message || 'Unknown error');
      return (
        <div className="flex items-center justify-center h-full min-h-[200px] text-red-500 bg-red-50 rounded-lg">
          Error rendering preview
        </div>
      );
    }
  };

  return (
    <div>
      <ViewToggle />
      <div className={previewContainerClass}>
        {renderPreview()}
      </div>
      <CharacterCount />
    </div>
  );
}
