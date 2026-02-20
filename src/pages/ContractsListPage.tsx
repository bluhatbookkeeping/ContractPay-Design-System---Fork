import React, { useState } from 'react';
import { Plus, Search, FileText, ChevronRight } from 'lucide-react';
import { HeaderBar } from '../components/Navigation';
import { PrimaryButton } from '../components/Buttons';
import { StatusBadge } from '../components/Badges';
import { projects } from '../data/mockData';
interface ContractsListPageProps {
  onNavigate: (page: string, id?: string) => void;
}
export function ContractsListPage({ onNavigate }: ContractsListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredContracts = projects.filter(
    (p) =>
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.homeownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex flex-col bg-gray-50 -m-4 lg:-m-8 min-h-full">
      <HeaderBar
        title="Contracts"
        rightAction={
        <PrimaryButton size="sm" onClick={() => onNavigate('new-project')}>
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </PrimaryButton>
        } />


      <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900" />

        </div>

        {/* Contracts List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                    Contract ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                    Project / Client
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                    Start Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs text-right">
                    Value
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map((project) =>
                <tr
                  key={project.id}
                  onClick={() => onNavigate('contract', project.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group">

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">
                      #{project.id.toUpperCase()}-2025
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {project.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.homeownerName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {project.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-medium text-gray-900">
                      ${project.contractAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400 group-hover:text-navy-900">
                      <ChevronRight className="w-5 h-5 ml-auto" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredContracts.length === 0 &&
          <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">
                No contracts found
              </h3>
              <p className="text-gray-500 text-sm">
                Try adjusting your search terms
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

}