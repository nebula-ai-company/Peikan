
import React from 'react';
import { motion } from 'framer-motion';
import { Company } from '../../../types';
import { Plus, MoreVertical } from 'lucide-react';

interface CompaniesProps {
    companies: Company[];
}

const Companies: React.FC<CompaniesProps> = ({ companies }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-gray-900/10 transition-all">
                    <Plus size={18} />
                    <span>ثبت شرکت جدید</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(comp => (
                    <div key={comp.id} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-peikan-200 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-6">
                            <img src={comp.logo} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt={comp.name} />
                            <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${comp.plan === 'enterprise' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                        {comp.plan === 'enterprise' ? 'سازمانی' : 'پایه'}
                                    </span>
                                    <button className="text-gray-400 hover:text-gray-900">
                                        <MoreVertical size={18} />
                                    </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">{comp.name}</h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`w-2 h-2 rounded-full ${comp.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {comp.status === 'active' ? 'فعال' : 'غیرفعال'} • ثبت: {comp.registeredAt}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="flex -space-x-2 space-x-reverse">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-[#1e1e1e]"></div>
                                ))}
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 border-2 border-white dark:border-[#1e1e1e]">
                                    +{comp.employeeCount}
                                </div>
                            </div>
                            <button className="text-xs font-bold text-peikan-700 hover:underline">مدیریت اعضا</button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Companies;
