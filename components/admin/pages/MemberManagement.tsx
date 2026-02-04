
import React from 'react';
import { motion } from 'framer-motion';
import { RegistrationRequest } from '../../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface MemberManagementProps {
    requests: RegistrationRequest[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ requests, onApprove, onReject }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">مدیریت اعضا</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">لیست درخواست‌های عضویت و وضعیت کاربران</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">همه</button>
                        <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-700">در انتظار</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">کاربر</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">سازمان</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">اطلاعات تماس</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">وضعیت</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">اقدام</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-peikan-100 flex items-center justify-center text-peikan-700 font-bold text-xs">
                                                {req.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{req.name}</div>
                                                <div className="text-xs text-gray-400 dir-ltr text-right">{req.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{req.companyName}</td>
                                    <td className="p-4 text-sm font-mono dir-ltr text-right text-gray-600 dark:text-gray-400">{req.phone}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                                            req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                                            req.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                            'bg-amber-50 text-amber-600 border-amber-200'
                                        }`}>
                                            {req.status === 'pending' ? 'در انتظار بررسی' : req.status === 'approved' ? 'تایید شده' : 'رد شده'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {req.status === 'pending' ? (
                                            <div className="flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onApprove(req.id)} className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors" title="تایید">
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button onClick={() => onReject(req.id)} className="p-1.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-500 rounded-lg shadow-sm transition-colors" title="رد">
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        ) : <span className="text-gray-300 text-xs">-</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default MemberManagement;
