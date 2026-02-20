import React, { useState } from 'react';
import { Star, Copy, Share2, CheckCircle, XCircle, Circle } from 'lucide-react';
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
        <div className="flex gap-2">
            <button
            className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors"
            title="Copy text">

              <Copy className="w-4 h-4" />
            </button>
            <button
            className="p-1.5 text-gray-400 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-colors"
            title="Share">

              <Share2 className="w-4 h-4" />
            </button>
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