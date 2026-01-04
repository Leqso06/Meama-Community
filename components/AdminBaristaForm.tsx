import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Barista } from '../types';

interface BaristaFormData {
    name: string;
    photo: string;
    branch: string;
}

interface AdminBaristaFormProps {
    initialData?: Barista;
    onSubmit: (data: BaristaFormData) => void;
    onCancel: () => void;
}

const AdminBaristaForm: React.FC<AdminBaristaFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const { t } = useLocalization();
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [branch, setBranch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPhoto(initialData.photo);
            setBranch(initialData.branch);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !photo.trim() || !branch.trim()) {
            setError(t('fillAllFields'));
            return;
        }
        onSubmit({ name, photo, branch });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-brand-card rounded-lg shadow-2xl w-full max-w-md p-6 border border-brand-accent/20 fade-in-up">
                <h2 className="text-2xl font-bold text-brand-text-primary mb-6 text-center">
                    {initialData ? t('editBarista') : t('addBarista')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="name">
                            {t('name')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-brand-bg/50 border border-brand-accent/30 rounded-lg p-3 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                            placeholder="e.g. Giorgi Beridze"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="photo">
                            {t('photoUrl')}
                        </label>
                        <input
                            id="photo"
                            type="text"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            className="w-full bg-brand-bg/50 border border-brand-accent/30 rounded-lg p-3 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                            placeholder="https://..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-brand-text-secondary text-sm font-bold mb-2" htmlFor="branch">
                            {t('branch')}
                        </label>
                        <input
                            id="branch"
                            type="text"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full bg-brand-bg/50 border border-brand-accent/30 rounded-lg p-3 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-transparent border border-brand-text-secondary text-brand-text-secondary font-bold py-3 px-4 rounded-full hover:bg-brand-text-secondary hover:text-brand-bg transition-colors duration-300"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-brand-accent text-[#FCFBF4] font-bold py-3 px-4 rounded-full hover:bg-amber-600 transition-colors duration-300 shadow-lg shadow-brand-accent/20"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBaristaForm;