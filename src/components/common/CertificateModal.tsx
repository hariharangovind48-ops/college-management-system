import React from 'react';
import { Certificate } from '../../types';
import { Award, ShieldCheck, X, Printer, CheckCircle2, Building2 } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-200">
              Verified Digital Certificate of Excellence
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Outer Frame */}
        <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/60">
          <div className="relative border-4 border-double border-amber-500/40 p-8 rounded-xl bg-slate-950/80 shadow-inner">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/70" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/70" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/70" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/70" />

            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 text-white shadow-lg mb-1 border border-blue-400/40">
                <Building2 className="w-7 h-7 text-blue-200" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                INFO INSTITUTE OF ENGINEERING
              </h2>
              <p className="text-xs text-slate-400 tracking-wider font-medium">
                Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai
              </p>
              <p className="text-[11px] text-blue-300/80 font-mono">
                S.F.No.1075/1, Kovilpalayam, Coimbatore, Tamil Nadu - 641107
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Certificate of {certificate.achievement}
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-slate-400 italic">This is proudly presented to</p>
              <div>
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
                  {certificate.studentName}
                </h3>
                <p className="text-sm font-mono text-blue-400 mt-1">
                  Roll No: <span className="font-semibold text-slate-200">{certificate.rollNo}</span> • Dept. of Computer Science and Engineering
                </p>
              </div>

              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                for outstanding active participation and exemplary performance in{' '}
                <span className="font-semibold text-white">{certificate.eventName}</span> held at{' '}
                INFO Institute of Engineering, presenting the technical innovation project titled:
              </p>

              <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-lg max-w-lg mx-auto">
                <p className="text-xs font-semibold text-blue-200 italic">
                  "{certificate.projectTitle}"
                </p>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="mt-10 pt-6 border-t border-slate-800 grid grid-cols-3 items-end text-center text-xs">
              <div className="space-y-1">
                <p className="font-mono text-slate-400 text-[11px]">{certificate.issueDate}</p>
                <div className="w-24 h-0.5 bg-slate-700 mx-auto" />
                <p className="font-medium text-slate-300">Date of Issue</p>
              </div>

              {/* Verified Seal */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 text-emerald-400 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Officially Verified</span>
                </div>
                <p className="text-[10px] font-mono text-slate-400">{certificate.certificateNo}</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-blue-300 text-[11px]">{certificate.signatory}</p>
                <div className="w-28 h-0.5 bg-slate-700 mx-auto" />
                <p className="font-medium text-slate-300">Head of Department / Principal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Link note */}
        <div className="px-6 py-2.5 bg-slate-950 text-center border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
          Online verification ID: <span className="text-blue-400">{certificate.certificateNo}</span> • Verified through College Academic Record System
        </div>
      </div>
    </div>
  );
};
