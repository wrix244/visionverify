import React, { useState } from 'react';
import { ExternalLink, Image as ImageIcon, Eye, X } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const LogsTable = ({ logs = [], onSelectLog }) => {
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-900/40 rounded-xl border border-surface-800">
        <p className="text-sm text-surface-400">No payment verification logs found matching filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-surface-800 bg-surface-900/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-900 text-xs font-semibold uppercase text-surface-400 border-b border-surface-800">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">UTR / Ref No</th>
              <th className="px-4 py-3">Proof Screenshot</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Confidence</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60">
            {logs.map((log) => (
              <tr key={log._id || log.id} className="hover:bg-surface-800/30 transition-colors">
                <td className="px-4 py-3 text-xs text-surface-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono font-medium text-surface-200">
                  {log.utrNumber || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {log.imageUrl ? (
                    <button
                      onClick={() => setPreviewImageUrl(log.imageUrl)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-brand-600/20 hover:text-brand-400 text-xs text-surface-300 border border-surface-700 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>View Screenshot</span>
                    </button>
                  ) : (
                    <span className="text-xs text-surface-500">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={log.status}>{log.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-bold text-surface-200">
                  {log.confidenceScore}%
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onSelectLog && onSelectLog(log)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
                    title="View Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* High-Resolution Screenshot Lightbox Preview Modal */}
      <Modal isOpen={!!previewImageUrl} onClose={() => setPreviewImageUrl(null)} title="Uploaded Payment Screenshot">
        {previewImageUrl && (
          <div className="space-y-4 text-center">
            <div className="overflow-hidden rounded-xl border border-surface-800 bg-surface-950 p-2 max-h-[70vh] flex items-center justify-center">
              <img
                src={previewImageUrl}
                alt="Uploaded Payment Proof Screenshot"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-xl"
              />
            </div>
            <div className="flex justify-end">
              <a
                href={previewImageUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold inline-flex items-center space-x-2 shadow"
              >
                <Eye className="w-4 h-4" />
                <span>Open Full Resolution</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
