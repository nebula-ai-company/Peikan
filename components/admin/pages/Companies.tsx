
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Company } from '../../../types';
import { Plus, MoreVertical, Search, Building2, Users, Shield, Filter } from 'lucide-react';
import AddCompanyModal from './companies/AddCompanyModal';
import CompanyDetailsModal from './companies/CompanyDetailsModal';

interface CompaniesProps {
    companies: Company[];
}

const Companies: React.FC<CompaniesProps> = ({ companies: initialCompanies }) => {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<'all' | 'basic' | 'enterprise'>('all');
    
    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    const handleAddCompany = (newCompany: Partial<Company>) => {
        const company: Company = {
            id: `comp_${Date.now()}`,
            name: newCompany.name || 'New Company',
            logo: newCompany.logo || '',
            employeeCount: newCompany.employeeCount || 0,
            status: 'active',
            plan: newCompany.plan || 'basic',
            registeredAt: newCompany.registeredAt || new Date().toLocaleDateString('fa-IR'),
            // Optional fields
            industry: newCompany.industry,
            website: newCompany.website,
            phone: newCompany.phone,
            address: newCompany.address,
            contactPerson: newCompany.contactPerson,
            contactEmail: newCompany.contactEmail,
        };
        setCompanies([company, ...companies]);
    };

    const handleUpdateCompany = (updatedCompany: Company) => {
        setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
        setSelectedCompany(updatedCompany); // Keep modal open with new data
    };

    const handleDeleteCompany = (id: string) => {
        setCompanies(prev => prev.filter(c => c.id !== id));
        setSelectedCompany(null);
    };

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'all' || c.plan === filterPlan;
        return matchesSearch && matchesPlan;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-10">
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddCompanyModal 
                        onClose={() => setIsAddModalOpen(false)} 
                        onAdd={handleAddCompany} 
                    />
                )}
                {selectedCompany && (
                    <CompanyDetailsModal 
                        company={selectedCompany}
                        onClose={() => setSelectedCompany(null)}
                        onUpdate={handleUpdateCompany}
                        onDelete={handleDeleteCompany}
                    />
                )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex-1 w-full md:w-auto">
                    <div className="relative group">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-peikan-700 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="جستجو نام سازمان..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pr-11 pl-4 text-sm outline-none focus:border-peikan-700 focus:ring-4 focus:ring-peikan-700/10 transition-all font-medium"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group">
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            value={filterPlan}
                            onChange={(e) => setFilterPlan(e.target.value as any)}
                            className="appearance-none bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pr-9 pl-8 text-sm font-bold text-gray-700 dark:text-gray-200 focus:border-peikan-700 outline-none cursor-pointer"
                        >
                            <option value="all">همه طرح‌ها</option>
                            <option value="enterprise">سازمانی</option>
                            <option value="basic">پایه</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-peikan-700 hover:bg-peikan-800 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-peikan-700/20 transition-all active:scale-95 whitespace-nowrap flex-1 md:flex-none"
                    >
                        <Plus size={18} />
                        <span>ثبت شرکت جدید</span>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredCompanies.map(comp => (
                        <motion.div 
                            key={comp.id} 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            onClick={() => setSelectedCompany(comp)}
                            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all group cursor-pointer relative"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="relative">
                                    <img src={comp.logo} className="w-16 h-16 rounded-2xl object-cover shadow-sm bg-gray-50 dark:bg-white/5" alt={comp.name} />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${comp.plan === 'enterprise' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'}`}>
                                        <Shield size={10} />
                                        {comp.plan === 'enterprise' ? 'سازمانی' : 'پایه'}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full ${comp.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 group-hover:text-peikan-700 transition-colors">{comp.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
                                    <Building2 size={12} />
                                    {comp.industry ? comp.industry : `ثبت شده در: ${comp.registeredAt}`}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Users size={16} />
                                    <span className="text-sm font-bold">{comp.employeeCount.toLocaleString()}</span>
                                    <span className="text-[10px] text-gray-400">پرسنل</span>
                                </div>
                                <button className="text-xs font-bold text-peikan-700 dark:text-peikan-400 bg-peikan-50 dark:bg-peikan-900/20 px-3 py-1.5 rounded-lg hover:bg-peikan-100 dark:hover:bg-peikan-900/40 transition-colors">
                                    مشاهده جزئیات
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredCompanies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                    <Building2 size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">سازمانی یافت نشد</h3>
                    <p className="text-sm text-gray-500">با معیارهای جستجوی فعلی موردی وجود ندارد.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Companies;
