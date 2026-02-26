import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Briefcase,
  AlertCircle,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
  MapPin,
  User } from
'lucide-react';
import { PrimaryButton } from '../components/Buttons';
import { ProjectCard } from '../components/Cards';
import { projects } from '../data/mockData';
interface ProjectsPageProps {
  onNavigate: (page: string, id?: string) => void;
  userRole?: 'contractor' | 'homeowner';
}
export function ProjectsPage({
  onNavigate,
  userRole = 'contractor'
}: ProjectsPageProps) {
  const [filter, setFilter] = useState<
    'all' | 'active' | 'pending' | 'completed'>(
    'all');
  const isHomeowner = userRole === 'homeowner';
  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.status === 'active';
    if (filter === 'pending')
    return p.status === 'pending' || p.status === 'sent';
    if (filter === 'completed') return p.status === 'complete';
    return true;
  });
  // Calculate stats (contractor only)
  const totalValue = projects.reduce((sum, p) => sum + p.contractAmount, 0);
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const pendingCount = projects.filter(
    (p) => p.status === 'pending' || p.status === 'sent'
  ).length;
  const completedCount = projects.filter((p) => p.status === 'complete').length;
  // Homeowner: contracts awaiting signature
  const awaitingSignature = projects.filter((p) => p.status === 'sent');
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HOMEOWNER: Awaiting Signature Banner */}
      {isHomeowner && awaitingSignature.length > 0 &&
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-1">
                {awaitingSignature.length === 1 ?
              'You have a contract waiting for your signature' :
              `You have ${awaitingSignature.length} contracts waiting for your signature`}
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Your contractor has sent a contract for review. Please review
                and sign to get your project started.
              </p>
              <div className="space-y-2">
                {awaitingSignature.map((p) =>
              <button
                key={p.id}
                onClick={() =>
                onNavigate('homeowner-contract-review', p.id)
                }
                className="flex items-center justify-between w-full bg-white border border-blue-200 rounded-lg px-4 py-3 hover:bg-blue-50 transition-colors text-left">

                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {p.address}
                      </p>
                      <p className="text-xs text-gray-500">
                        Contractor: {p.contractorName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Awaiting Signature
                      </span>
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    </div>
                  </button>
              )}
              </div>
            </div>
          </div>
        </div>
      }

      {/* CONTRACTOR: Stats Header */}
      {!isHomeowner &&
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
      }

      {/* Search + New Project (contractor only) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {!isHomeowner &&
        <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900" />

          </div>
        }
        {isHomeowner && <div />}
        {!isHomeowner &&
        <PrimaryButton
          size="md"
          className="flex-shrink-0"
          onClick={() => onNavigate('new-project')}>

            <Plus className="w-5 h-5 mr-2" />
            New Project
          </PrimaryButton>
        }
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'active', 'pending', 'completed'] as const).map((f) => {
          const count =
          f === 'all' ?
          projects.length :
          f === 'active' ?
          activeCount :
          f === 'pending' ?
          pendingCount :
          completedCount;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-navy-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>

              {f}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>

                {count}
              </span>
            </button>);

        })}
      </div>

      {/* HOMEOWNER: Custom project list with contract status */}
      {isHomeowner ?
      <div className="space-y-4">
          {filteredProjects.map((project) => {
          const isSent = project.status === 'sent';
          const isActive = project.status === 'active';
          const isComplete = project.status === 'complete';
          return (
            <div
              key={project.id}
              onClick={() =>
              isSent ?
              onNavigate('homeowner-contract-review', project.id) :
              onNavigate('project-detail', project.id)
              }
              className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-navy-300 hover:shadow-sm transition-all">

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {project.address}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5" />{' '}
                        {project.contractorName}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isSent &&
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Signature
                      </span>
                  }
                    {isActive &&
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Contract Active
                      </span>
                  }
                    {isComplete &&
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </span>
                  }
                  </div>
                </div>

                {isActive &&
              <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                      <span>Project Progress</span>
                      <span className="font-bold text-gray-900">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                    className="bg-navy-900 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progress}%`
                    }} />

                    </div>
                  </div>
              }

                {isSent &&
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                      Tap to review and sign your contract
                    </p>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </div>
              }
              </div>);

        })}
        </div> /* CONTRACTOR: Original project cards */ :

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
      }
    </div>);

}