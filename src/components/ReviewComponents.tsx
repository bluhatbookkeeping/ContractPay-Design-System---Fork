import React, { useEffect, useState, useRef } from 'react';
import {
  Star,
  Copy,
  Share2,
  CheckCircle,
  XCircle,
  Circle,
  ExternalLink } from
'lucide-react';
interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}
export function StarRating({
  rating,
  onChange,
  size = 'md',
  readonly = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}>

            <Star
              className={`${sizeClasses[size]} ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />

          </button>);

      })}
    </div>);

}
interface TestimonialCardProps {
  rating: number;
  content: string;
  authorName: string;
  authorLocation: string;
  date: string;
  photos?: string[];
  showActions?: boolean;
}
export function TestimonialCard({
  rating,
  content,
  authorName,
  authorLocation,
  date,
  photos,
  showActions
}: TestimonialCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleCopy = () => {
    navigator.clipboard.
    writeText(`"${content}" — ${authorName}, ${authorLocation}`).
    catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareDestinations = [
  {
    label: 'Google Business',
    icon: '🔍',
    hint: 'Post to your Google Business Profile',
    href: 'https://business.google.com'
  },
  {
    label: 'Facebook',
    icon: '📘',
    hint: 'Share on your Facebook page',
    href: 'https://facebook.com'
  },
  {
    label: 'Yelp',
    icon: '⭐',
    hint: 'Share on your Yelp business page',
    href: 'https://yelp.com'
  },
  {
    label: 'Copy Link',
    icon: '🔗',
    hint: 'Copy a shareable link to this review',
    href: null
  }];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <StarRating rating={rating} size="sm" readonly />
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      <p className="text-gray-800 text-sm leading-relaxed mb-4 line-clamp-4">
        "{content}"
      </p>

      {photos && photos.length > 0 &&
      <div className="flex gap-2 mb-4">
          {photos.map((photo, i) =>
        <div
          key={i}
          className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">

              <img
            src={photo}
            alt="Project"
            className="w-full h-full object-cover" />

            </div>
        )}
        </div>
      }

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-900">{authorName}</p>
          <p className="text-xs text-gray-500">{authorLocation}</p>
        </div>

        {showActions &&
        <div className="flex gap-2 items-center">
            {/* Copy review text */}
            <div className="relative group">
              <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg transition-colors ${copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-[#1e3a5f] hover:bg-blue-50'}`}>

                {copied ?
              <CheckCircle className="w-4 h-4" /> :

              <Copy className="w-4 h-4" />
              }
              </button>
              <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {copied ? 'Copied!' : 'Copy review text'}
                <div className="absolute top-full right-2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>

            {/* Share dropdown */}
            <div className="relative" ref={shareRef}>
              <div className="relative group">
                <button
                onClick={() => setShareOpen(!shareOpen)}
                className={`p-1.5 rounded-lg transition-colors ${shareOpen ? 'text-[#1e3a5f] bg-blue-50' : 'text-gray-400 hover:text-[#1e3a5f] hover:bg-blue-50'}`}>

                  <Share2 className="w-4 h-4" />
                </button>
                {!shareOpen &&
              <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Share this review
                    <div className="absolute top-full right-2 border-4 border-transparent border-t-gray-900" />
                  </div>
              }
              </div>

              {shareOpen &&
            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-52 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Share Review To
                    </p>
                  </div>
                  {shareDestinations.map((dest) =>
              <button
                key={dest.label}
                onClick={() => {
                  if (dest.href) {
                    window.open(dest.href, '_blank');
                  } else {
                    navigator.clipboard.
                    writeText(window.location.href).
                    catch(() => {});
                  }
                  setShareOpen(false);
                }}
                className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">

                      <span className="text-base leading-none mt-0.5">
                        {dest.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {dest.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {dest.hint}
                        </p>
                      </div>
                      {dest.href &&
                <ExternalLink className="w-3 h-3 text-gray-300 ml-auto mt-1 flex-shrink-0" />
                }
                    </button>
              )}
                </div>
            }
            </div>
          </div>
        }
      </div>
    </div>);

}
interface ReviewRequestBadgeProps {
  status: 'sent' | 'received' | 'pending' | 'declined';
}
export function ReviewRequestBadge({ status }: ReviewRequestBadgeProps) {
  const configs = {
    sent: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      text: 'Request Sent'
    },
    received: {
      icon: CheckCircle,
      color: 'text-green-700',
      bg: 'bg-green-100',
      text: 'Review Received'
    },
    pending: {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-100',
      text: 'Not Requested'
    },
    declined: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      text: 'Declined'
    }
  };
  const config = configs[status];
  const Icon = config.icon;
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>

      <Icon className="w-3.5 h-3.5" />
      {config.text}
    </div>);

}