import React, { useState, Component } from 'react';
import {
  StarRating,
  TestimonialCard,
  ReviewRequestBadge } from
'../components/ReviewComponents';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { reviews, projects } from '../data/mockData';
import {
  X,
  Send,
  User,
  Mail,
  Briefcase,
  MessageSquare,
  Plus } from
'lucide-react';
export function ReviewsPage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    homeownerName: '',
    projectId: '',
    message: ''
  });
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [additionalEmailInput, setAdditionalEmailInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const selectedProject = projects.find((p) => p.id === requestForm.projectId);
  const allEmails = [primaryEmail, ...additionalEmails].filter(Boolean);
  const handleAddEmail = () => {
    const trimmed = additionalEmailInput.trim();
    if (trimmed && !allEmails.includes(trimmed)) {
      setAdditionalEmails((prev) => [...prev, trimmed]);
    }
    setAdditionalEmailInput('');
  };
  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddEmail();
    }
  };
  const removeAdditionalEmail = (email: string) => {
    setAdditionalEmails((prev) => prev.filter((e) => e !== email));
  };
  const handleProjectChange = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    setRequestForm((prev) => ({
      ...prev,
      projectId,
      homeownerName: proj ? proj.homeownerName : prev.homeownerName
    }));
    setPrimaryEmail(proj?.homeownerEmail ?? '');
    setAdditionalEmails([]);
  };
  const handleSubmit = () => {
    if (!requestForm.homeownerName || !primaryEmail || !requestForm.projectId)
    return;
    setSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setSubmitted(false);
      setRequestForm({
        homeownerName: '',
        projectId: '',
        message: ''
      });
      setPrimaryEmail('');
      setAdditionalEmails([]);
      setAdditionalEmailInput('');
    }, 1800);
  };
  const closeModal = () => {
    setShowRequestModal(false);
    setSubmitted(false);
    setRequestForm({
      homeownerName: '',
      projectId: '',
      message: ''
    });
    setPrimaryEmail('');
    setAdditionalEmails([]);
    setAdditionalEmailInput('');
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Request Review Modal */}
      {showRequestModal &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Request a Review
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Send a review request to a past client
                </p>
              </div>
              <button
              onClick={closeModal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">

                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ?
          <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  Request Sent!
                </h4>
                <p className="text-sm text-gray-500">
                  Review request sent to {allEmails.length} recipient
                  {allEmails.length !== 1 ? 's' : ''}.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                  {allEmails.map((e) =>
              <span
                key={e}
                className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">

                      {e}
                    </span>
              )}
                </div>
              </div> :

          <div className="px-6 py-5 space-y-4">
                {/* Project selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Project
                    </span>
                  </label>
                  <select
                value={requestForm.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white">

                    <option value="">Select a project…</option>
                    {projects.map((p) =>
                <option key={p.id} value={p.id}>
                        {p.address} — {p.homeownerName}
                      </option>
                )}
                  </select>
                  {selectedProject &&
              <p className="text-xs text-gray-400 mt-1.5 ml-1">
                      Contract: $
                      {selectedProject.contractAmount.toLocaleString()} ·
                      Status: {selectedProject.status}
                    </p>
              }
                </div>

                {/* Client name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Client Name
                    </span>
                  </label>
                  <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={requestForm.homeownerName}
                onChange={(e) =>
                setRequestForm((prev) => ({
                  ...prev,
                  homeownerName: e.target.value
                }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />

                </div>

                {/* Email recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Send To
                    </span>
                  </label>

                  {/* Primary email */}
                  <div className="relative mb-2">
                    <input
                  type="email"
                  placeholder="client@example.com"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />

                    {selectedProject?.homeownerEmail &&
                primaryEmail === selectedProject.homeownerEmail &&
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-[#1e3a5f]/10 text-[#1e3a5f] font-semibold px-1.5 py-0.5 rounded-full">
                          Primary
                        </span>
                }
                  </div>

                  {/* Additional email chips */}
                  {additionalEmails.length > 0 &&
              <div className="flex flex-wrap gap-1.5 mb-2">
                      {additionalEmails.map((email) =>
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1.5 rounded-full">

                          {email}
                          <button
                    onClick={() => removeAdditionalEmail(email)}
                    className="text-gray-400 hover:text-red-500 transition-colors">

                            <X className="w-3 h-3" />
                          </button>
                        </span>
                )}
                    </div>
              }

                  {/* Add additional email input */}
                  <div className="flex gap-2">
                    <input
                  type="email"
                  placeholder="Add another email…"
                  value={additionalEmailInput}
                  onChange={(e) => setAdditionalEmailInput(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-gray-50" />

                    <button
                  onClick={handleAddEmail}
                  disabled={!additionalEmailInput.trim()}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">

                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Press Enter or comma to add. All recipients will receive the
                    same request.
                  </p>
                </div>

                {/* Personal message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Personal Message{' '}
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    </span>
                  </label>
                  <textarea
                rows={3}
                placeholder="Hi! It was a pleasure working on your project. I'd really appreciate if you could take a moment to leave a review…"
                value={requestForm.message}
                onChange={(e) =>
                setRequestForm((prev) => ({
                  ...prev,
                  message: e.target.value
                }))
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none" />

                </div>

                <div className="flex gap-3 pt-1">
                  <PrimaryButton
                fullWidth
                onClick={handleSubmit}
                disabled={
                !requestForm.homeownerName ||
                !primaryEmail ||
                !requestForm.projectId
                }>

                    <Send className="w-4 h-4 mr-2" />
                    Send to {allEmails.length || 1} Recipient
                    {allEmails.length !== 1 ? 's' : ''}
                  </PrimaryButton>
                  <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                </div>
              </div>
          }
          </div>
        </div>
      }

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-[#1e3a5f] mb-2">4.8</h2>
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
            <PrimaryButton fullWidth onClick={() => setShowRequestModal(true)}>
              Request Review
            </PrimaryButton>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recent Requests
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {projects.map((project) =>
          <div
            key={project.id}
            className="bg-white p-4 rounded-lg border border-gray-200 min-w-[220px]">

              <p className="font-medium text-sm mb-1 text-gray-900">
                {project.address}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                {project.homeownerName}
              </p>
              <ReviewRequestBadge
              status={
              project.id === 'p1' ?
              'pending' :
              project.id === 'p2' ?
              'sent' :
              'pending'
              } />

            </div>
          )}
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