import React, { useState, Component } from 'react';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Briefcase,
  AlertCircle } from
'lucide-react';
import { PrimaryButton } from '../components/Buttons';
import { ProjectCard } from '../components/Cards';
import { MetricCard } from '../components/AnalyticsComponents';
import { projects } from '../data/mockData';
interface ProjectsPageProps {
  onNavigate: (page: string, id?: string) => void;
}
export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [filter, setFilter] = useState<
    'all' | 'active' | 'pending' | 'completed'>(
    'all');
  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.status === 'active';
    if (filter === 'pending')
    return p.status === 'pending' || p.status === 'sent';
    if (filter === 'completed') return p.status === 'complete';
    return true;
  });
  // Calculate stats
  const totalValue = projects.reduce((sum, p) => sum + p.contractAmount, 0);
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const pendingCount = projects.filter(
    (p) => p.status === 'pending' || p.status === 'sent'
  ).length;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">
              Total Contract Value
            </p>
            <p className="text-2xl font-bold font-mono text-navy-900">
              ${totalValue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">
              Active Projects
            </p>
            <p className="text-2xl font-bold font-mono text-navy-900">
              {activeCount}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">
              Pending Actions
            </p>
            <p className="text-2xl font-bold font-mono text-navy-900">
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900" />

        </div>
        <PrimaryButton
          size="md"
          className="flex-shrink-0"
          onClick={() => onNavigate('new-project')}>

          <Plus className="w-5 h-5 mr-2" />
          New Project
        </PrimaryButton>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'active', 'pending', 'completed'] as const).map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-navy-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>

            {f}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) =>
        <div key={project.id} className="w-full [&>div]:max-w-none">
            <ProjectCard
            address={project.address}
            homeownerName={project.homeownerName}
            status={project.status}
            amount={project.contractAmount}
            progress={project.progress}
            onClick={() => onNavigate('project-detail', project.id)} />

          </div>
        )}
      </div>
    </div>);

}