"use client";

import { FileText, Download, ShieldCheck, FolderOpen } from 'lucide-react';

export default function DealerDocumentsPage() {
  const documents = [
    { title: "BIS Certification Matrix - 2026", type: "PDF", size: "2.4 MB", category: "Compliance" },
    { title: "Standard Warranty Terms & Conditions", type: "PDF", size: "1.1 MB", category: "Legal" },
    { title: "Q2 Product Catalog & Specs", type: "PDF", size: "8.5 MB", category: "Marketing" },
    { title: "ISO 9001:2015 Import Certificate", type: "PDF", size: "1.8 MB", category: "Compliance" },
    { title: "Authorized Dealer Certificate Template", type: "PDF", size: "3.2 MB", category: "Marketing" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resource Center</h1>
        <p className="text-gray-500 mt-1">Download compliance certificates, warranty docs, and marketing materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-sky-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-sky-900">Compliance</h4>
            <p className="text-sm text-sky-700">BIS & ISO Docs</p>
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900">Legal</h4>
            <p className="text-sm text-indigo-700">Warranty & Terms</p>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-500">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-purple-900">Marketing</h4>
            <p className="text-sm text-purple-700">Catalogs & Banners</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50">
                <th className="py-4 px-6 font-medium">Document Name</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium">Size</th>
                <th className="py-4 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {documents.map((doc, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    {doc.title}
                  </td>
                  <td className="py-5 px-6">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-gray-500 font-mono text-xs">
                    {doc.size}
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}