import React from 'react';
import { PipelineStatus, OpportunityStatus } from '../types';

const StatusBadge = ({ status }: { status: string }) => {
  const getStyles = (s: string) => {
    switch (s) {
      case PipelineStatus.INTERESTED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case PipelineStatus.PENDING_CONFIRMATION: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PipelineStatus.IN_PROPOSAL: return 'bg-purple-100 text-purple-800 border-purple-200';
      case PipelineStatus.WITH_RFQ: return 'bg-orange-100 text-orange-800 border-orange-200';
      case PipelineStatus.PURCHASE_ORDER: return 'bg-green-100 text-green-800 border-green-200';
      case PipelineStatus.CANCELED: return 'bg-red-100 text-red-800 border-red-200';
      case OpportunityStatus.OPEN: return 'bg-green-100 text-green-800';
      case OpportunityStatus.CLOSED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStyles(status)}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
