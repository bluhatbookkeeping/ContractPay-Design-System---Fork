import React, { Component } from 'react';
import {
  StarRating,
  TestimonialCard,
  ReviewRequestBadge } from
'../components/ReviewComponents';
import { PrimaryButton } from '../components/Buttons';
import { reviews } from '../data/mockData';
export function ReviewsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-navy-900 mb-2">4.8</h2>
            <StarRating rating={5} size="lg" readonly />
            <p className="text-sm text-gray-500 mt-2">23 Reviews</p>
          </div>

          <div className="flex-1 w-full max-w-sm space-y-2">
            {[5, 4, 3, 2, 1].map((star, i) =>
            <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-3">{star}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: i === 0 ? '80%' : i === 1 ? '15%' : '5%'
                  }} />

                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-auto">
            <PrimaryButton fullWidth>Request Review</PrimaryButton>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Requests
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="bg-white p-4 rounded-lg border border-gray-200 min-w-[200px]">
            <p className="font-medium text-sm mb-2">847 Oak Street</p>
            <ReviewRequestBadge status="pending" />
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 min-w-[200px]">
            <p className="font-medium text-sm mb-2">1204 Maple Ave</p>
            <ReviewRequestBadge status="sent" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">All Reviews</h3>
        {reviews.map((review) =>
        <TestimonialCard
          key={review.id}
          rating={review.rating}
          content={review.content}
          authorName={review.authorName}
          authorLocation={review.authorLocation}
          date={review.date}
          photos={review.photos}
          showActions />

        )}
      </div>
    </div>);

}