import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Shield, Plus, Trash2, Edit3, Eye, X, Save, RotateCcw, AlertCircle,
    CheckCircle, Loader, Search, Filter, MapPin, Calendar, Camera,
    User, Star, Building2, ChevronDown, Upload, Image as ImageIcon
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

/* ────────────────────────────────────────────
   Helpers
──────────────────────────────────────────── */
const notify = (setFn, message, type = 'success') => {
    setFn({ message, type });
    setTimeout(() => setFn(null), 5000);
};

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const toInputDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toISOString().split('T')[0];
};

/* ────────────────────────────────────────────
   Notification Toast
──────────────────────────────────────────── */
const Toast = ({ notification }) => (
    <AnimatePresence>
        {notification && (
            <motion.div
                initial={{ opacity: 0, y: -50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -50, x: 50 }}
                className={`fixed top-6 right-6 z-[9999] p-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : notification.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
            >
                {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="font-medium text-sm">{notification.message}</span>
            </motion.div>
        )}
    </AnimatePresence>
);

/* ────────────────────────────────────────────
   Image Preview Strip (for Add/Edit form)
──────────────────────────────────────────── */
const ImagePreviewStrip = ({ files, onRemove, label }) => {
    if (!files || files.length === 0) return null;
    return (
        <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">{label} ({files.length} selected)</p>
            <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                    <div key={i} className="relative group">
                        <img
                            src={URL.createObjectURL(f)}
                            alt={`preview-${i}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────
   Existing Photo Strip (edit mode — shows uploaded photos)
──────────────────────────────────────────── */
const ExistingPhotos = ({ photos, trainingId, onPhotoDeleted }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (photoId) => {
        if (!window.confirm('Delete this photo?')) return;
        try {
            setDeletingId(photoId);
            await axios.delete(API_ENDPOINTS.DELETE_POLICE_TRAINING_PHOTO(trainingId, photoId));
            onPhotoDeleted(photoId);
        } catch {
            alert('Failed to delete photo');
        } finally {
            setDeletingId(null);
        }
    };

    if (!photos || photos.length === 0) {
        return <p className="text-xs text-gray-400 mt-1">No photos uploaded yet.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {photos.map(photo => (
                <div key={photo._id} className="relative group">
                    <img
                        src={photo.url}
                        alt={photo.altText || 'Training photo'}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={() => handleDelete(photo._id)}
                        disabled={deletingId === photo._id}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        {deletingId === photo._id ? <Loader size={8} className="animate-spin" /> : <X size={10} />}
                    </button>
                </div>
            ))}
        </div>
    );
};

/* ────────────────────────────────────────────
   Form Modal (Add / Edit)
──────────────────────────────────────────── */
const EMPTY_FORM = {
    state: '', district: '', policeStation: '', eventDate: '', location: '',
    description: '', officerName: '', officerDesignation: '', officerDistrict: '',
    officerState: '', officerNote: '',
};

const FormModal = ({ mode, training, onClose, onSaved, setNotification }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [photoFiles, setPhotoFiles] = useState([]);
    const [officerPhotoFile, setOfficerPhotoFile] = useState(null);
    const [momentoFile, setMomentoFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [officerPreview, setOfficerPreview] = useState(null);
    const [momentoPreview, setMomentoPreview] = useState(null);

    /* Pre-fill in edit mode */
    useEffect(() => {
        if (mode === 'edit' && training) {
            setForm({
                state: training.state || '',
                district: training.district || '',
                policeStation: training.policeStation || '',
                eventDate: toInputDate(training.eventDate),
                location: training.location || '',
                description: training.description || '',
                officerName: training.officerName || '',
                officerDesignation: training.officerDesignation || '',
                officerDistrict: training.officerDistrict || '',
                officerState: training.officerState || '',
                officerNote: training.officerNote || '',
            });
            setExistingPhotos(training.photos || []);
            if (training.officerPhoto?.url) setOfficerPreview(training.officerPhoto.url);
            if (training.momentoPhoto?.url) setMomentoPreview(training.momentoPhoto.url);
        }
    }, [mode, training]);

    const handleField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files);
        setPhotoFiles(prev => [...prev, ...files]);
    };

    const removeNewPhoto = (idx) => setPhotoFiles(prev => prev.filter((_, i) => i !== idx));

    const handleOfficerPhoto = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setOfficerPhotoFile(f);
        setOfficerPreview(URL.createObjectURL(f));
    };

    const handleMomento = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setMomentoFile(f);
        setMomentoPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.state || !form.district || !form.policeStation || !form.eventDate) {
            notify(setNotification, 'State, District, Police Station, and Event Date are required.', 'error');
            return;
        }

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        photoFiles.forEach(f => fd.append('photos', f));
        if (officerPhotoFile) fd.append('officerPhoto', officerPhotoFile);
        if (momentoFile) fd.append('momentoPhoto', momentoFile);

        try {
            setSaving(true);
            if (mode === 'add') {
                await axios.post(API_ENDPOINTS.CREATE_POLICE_TRAINING, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notify(setNotification, 'Training event created successfully!');
            } else {
                await axios.put(API_ENDPOINTS.UPDATE_POLICE_TRAINING(training._id), fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                notify(setNotification, 'Training event updated successfully!');
            }
            onSaved();
        } catch (err) {
            console.error(err);
            notify(setNotification, `Failed to ${mode === 'add' ? 'create' : 'update'} training event.`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const inputCls =
        'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-colors';
    const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-6"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0E2A4E] to-[#1a3c6b] rounded-xl flex items-center justify-center">
                            {mode === 'add' ? <Plus size={18} className="text-white" /> : <Edit3 size={18} className="text-white" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {mode === 'add' ? 'Add Training Event' : 'Edit Training Event'}
                            </h2>
                            <p className="text-xs text-gray-500">Fill in the details below</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* ── Section: Location ── */}
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0E2A4E] mb-4">
                            <MapPin size={15} className="text-orange-500" /> Location Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelCls}>State *</label>
                                <input name="state" value={form.state} onChange={handleField}
                                    required placeholder="e.g. Maharashtra" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>District *</label>
                                <input name="district" value={form.district} onChange={handleField}
                                    required placeholder="e.g. Pune" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Police Station *</label>
                                <input name="policeStation" value={form.policeStation} onChange={handleField}
                                    required placeholder="e.g. Wakad PS" className={inputCls} />
                            </div>
                        </div>
                    </div>

                    {/* ── Section: Event info ── */}
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0E2A4E] mb-4">
                            <Calendar size={15} className="text-orange-500" /> Event Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Event Date *</label>
                                <input type="date" name="eventDate" value={form.eventDate} onChange={handleField}
                                    required className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Venue / Location</label>
                                <input name="location" value={form.location} onChange={handleField}
                                    placeholder="e.g. Police Training Ground" className={inputCls} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className={labelCls}>Description</label>
                            <textarea name="description" value={form.description} onChange={handleField}
                                rows={3} placeholder="Describe the training event..."
                                className={`${inputCls} resize-none`} />
                        </div>
                    </div>

                    {/* ── Section: Training Photos ── */}
                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#0E2A4E] mb-4">
                            <Camera size={15} className="text-orange-500" /> Training Photos
                        </h3>

                        {/* Existing photos in edit mode */}
                        {mode === 'edit' && existingPhotos.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Existing photos (click × to remove):</p>
                                <ExistingPhotos
                                    photos={existingPhotos}
                                    trainingId={training._id}
                                    onPhotoDeleted={(photoId) =>
                                        setExistingPhotos(prev => prev.filter(p => p._id !== photoId))
                                    }
                                />
                            </div>
                        )}

                        <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group">
                            <Upload size={24} className="text-gray-400 group-hover:text-orange-500 mb-2 transition-colors" />
                            <span className="text-sm font-medium text-gray-500 group-hover:text-orange-600 transition-colors">
                                {mode === 'edit' ? 'Add more photos' : 'Upload training photos'}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">Multiple images supported (JPG, PNG, WebP)</span>
                            <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                        </label>

                        <ImagePreviewStrip files={photoFiles} onRemove={removeNewPhoto} label="New photos to upload" />
                    </div>

                    {/* ── Section: Chief Guest ── */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-4">
                            <Star size={15} className="text-amber-500 fill-amber-500" /> Chief Guest / Officiating Officer (Optional)
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Officer Name</label>
                                <input name="officerName" value={form.officerName} onChange={handleField}
                                    placeholder="Full name" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Designation</label>
                                <input name="officerDesignation" value={form.officerDesignation} onChange={handleField}
                                    placeholder="e.g. SP, DCP, Commissioner" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Officer's District</label>
                                <input name="officerDistrict" value={form.officerDistrict} onChange={handleField}
                                    placeholder="District" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Officer's State</label>
                                <input name="officerState" value={form.officerState} onChange={handleField}
                                    placeholder="State" className={inputCls} />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className={labelCls}>Officer's Note / Quote</label>
                            <textarea name="officerNote" value={form.officerNote} onChange={handleField}
                                rows={2} placeholder="Any remarks or quotes from the officer..."
                                className={`${inputCls} resize-none`} />
                        </div>

                        {/* Officer Photo + Momento */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className={labelCls}>Officer Photo</label>
                                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                                    {officerPreview ? (
                                        <div className="relative">
                                            <img src={officerPreview} alt="Officer" className="w-20 h-20 object-cover rounded-xl" />
                                            <span className="text-xs text-amber-600 font-medium mt-1 block text-center">Change</span>
                                        </div>
                                    ) : (
                                        <>
                                            <User size={24} className="text-amber-400 mb-1" />
                                            <span className="text-xs text-amber-600">Upload officer photo</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleOfficerPhoto} className="hidden" />
                                </label>
                            </div>

                            <div>
                                <label className={labelCls}>Momento Photo</label>
                                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                                    {momentoPreview ? (
                                        <div className="relative">
                                            <img src={momentoPreview} alt="Momento" className="w-20 h-20 object-cover rounded-xl" />
                                            <span className="text-xs text-amber-600 font-medium mt-1 block text-center">Change</span>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon size={24} className="text-amber-400 mb-1" />
                                            <span className="text-xs text-amber-600">Upload momento photo</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleMomento} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0E2A4E] to-[#1a3c6b] text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving…' : mode === 'add' ? 'Create Event' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

/* ────────────────────────────────────────────
   Detail View Modal
──────────────────────────────────────────── */
const DetailModal = ({ training, onClose }) => {
    const [lightboxIdx, setLightboxIdx] = useState(null);
    const photos = training.photos || [];

    if (!training) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Hero image */}
                {photos.length > 0 && (
                    <div className="relative h-56">
                        <img src={photos[0].url} alt="Training" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-5 text-white">
                            <h2 className="text-xl font-black">{training.policeStation}</h2>
                            <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
                                <MapPin size={13} /> {training.district}, {training.state}
                            </p>
                        </div>
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {training.state}
                        </div>
                    </div>
                )}

                <div className="p-6">
                    {/* Header (if no photo) */}
                    {photos.length === 0 && (
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">{training.policeStation}</h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <MapPin size={13} /> {training.district}, {training.state}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Close button */}
                    <div className="flex justify-end mb-2">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                            <Calendar size={12} /> {fmtDate(training.eventDate)}
                        </span>
                        {training.location && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                <MapPin size={12} /> {training.location}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                            <Camera size={12} /> {photos.length} photo{photos.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Description */}
                    {training.description && (
                        <p className="text-sm text-gray-700 leading-relaxed mb-5">{training.description}</p>
                    )}

                    {/* Chief Guest */}
                    {training.officerName && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                            <div className="flex items-start gap-4">
                                {training.officerPhoto?.url ? (
                                    <img src={training.officerPhoto.url} alt={training.officerName}
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-amber-300 flex-shrink-0" />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                        <User size={28} className="text-amber-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-0.5">Chief Guest</p>
                                    <h4 className="font-bold text-gray-900">{training.officerName}</h4>
                                    {training.officerDesignation && <p className="text-sm text-orange-700 font-medium">{training.officerDesignation}</p>}
                                    {(training.officerDistrict || training.officerState) && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {[training.officerDistrict, training.officerState].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {training.officerNote && (
                                        <p className="text-xs text-gray-600 italic mt-1">"{training.officerNote}"</p>
                                    )}
                                </div>
                                {training.momentoPhoto?.url && (
                                    <img src={training.momentoPhoto.url} alt="Momento"
                                        className="w-14 h-14 rounded-xl object-cover border-2 border-amber-200 flex-shrink-0" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Photo grid */}
                    {photos.length > 0 && (
                        <>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Camera size={15} className="text-orange-500" /> Training Photos
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {photos.map((p, idx) => (
                                    <div key={p._id || idx}
                                        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all group"
                                        onClick={() => setLightboxIdx(idx)}
                                    >
                                        <img src={p.url} alt={p.altText || `photo ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIdx !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={photos[lightboxIdx].url}
                            alt="Training"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                        <button onClick={() => setLightboxIdx(null)}
                            className="absolute top-5 right-5 w-10 h-10 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors">
                            <X size={18} />
                        </button>
                        {photos.length > 1 && (
                            <>
                                <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + photos.length) % photos.length); }}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-colors">
                                    ‹
                                </button>
                                <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % photos.length); }}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-colors">
                                    ›
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ────────────────────────────────────────────
   Training Table Row
──────────────────────────────────────────── */
const TrainingRow = ({ training, idx, onView, onEdit, onDelete, deleting, confirmDeleteId, setConfirmDeleteId }) => (
    <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
        className="hover:bg-gray-50 transition-colors"
    >
        <td className="px-5 py-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
                {training.photos?.[0]?.url ? (
                    <img src={training.photos[0].url} alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Camera size={16} className="text-gray-400" />
                    </div>
                )}
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{training.policeStation}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {training.district}, {training.state}
                    </p>
                </div>
            </div>
        </td>
        <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{fmtDate(training.eventDate)}</td>
        <td className="px-5 py-4 text-sm text-gray-700">
            {training.officerName ? (
                <div className="flex items-center gap-2">
                    <Star size={12} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                    <span className="truncate max-w-[140px]">{training.officerName}</span>
                </div>
            ) : (
                <span className="text-gray-400 text-xs">—</span>
            )}
        </td>
        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${training.photos?.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                <Camera size={11} /> {training.photos?.length || 0} photos
            </span>
        </td>
        <td className="px-5 py-4 whitespace-nowrap">
            {confirmDeleteId === training._id ? (
                /* Inline confirm */
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-red-600 font-semibold">Sure?</span>
                    <button
                        onClick={() => onDelete(training._id)}
                        disabled={deleting === training._id}
                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {deleting === training._id ? <Loader size={12} className="animate-spin" /> : 'Yes, Delete'}
                    </button>
                    <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                /* Normal actions — always visible */
                <div className="flex items-center gap-1.5">
                    <button onClick={() => onView(training)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye size={15} />
                    </button>
                    <button onClick={() => onEdit(training)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                        <Edit3 size={15} />
                    </button>
                    <button
                        onClick={() => setConfirmDeleteId(training._id)}
                        disabled={deleting === training._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                        {deleting === training._id ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                </div>
            )}
        </td>
    </motion.tr>
);

/* ────────────────────────────────────────────
   Main Management Component
──────────────────────────────────────────── */
const PoliceTrainingManagement = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [notification, setNotification] = useState(null);

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [viewTraining, setViewTraining] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterState, setFilterState] = useState('');
    const [stateList, setStateList] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    /* ── Fetch ── */
    const fetchTrainings = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterState) params.state = filterState;
            if (searchTerm) params.search = searchTerm;
            const res = await axios.get(API_ENDPOINTS.GET_POLICE_TRAININGS, { params });
            const data = res.data?.trainings || [];
            setTrainings(data);
            if (!filterState && !searchTerm) {
                setStateList([...new Set(data.map(t => t.state))].sort());
            }
        } catch {
            notify(setNotification, 'Failed to load training events.', 'error');
        } finally {
            setLoading(false);
        }
    }, [filterState, searchTerm]);

    useEffect(() => { fetchTrainings(); }, [fetchTrainings]);

    /* ── Delete ── */
    const handleDelete = async (id) => {
        try {
            setDeleting(id);
            setConfirmDeleteId(null);
            await axios.delete(API_ENDPOINTS.DELETE_POLICE_TRAINING(id));
            notify(setNotification, 'Training event deleted.');
            fetchTrainings();
        } catch (err) {
            console.error('Delete error:', err.response?.data || err.message);
            notify(setNotification, `Delete failed: ${err.response?.data?.message || err.message}`, 'error');
        } finally {
            setDeleting(null);
        }
    };

    const openAdd = () => { setFormMode('add'); setSelectedTraining(null); setShowFormModal(true); };
    const openEdit = (t) => { setFormMode('edit'); setSelectedTraining(t); setShowFormModal(true); };
    const onSaved = () => { setShowFormModal(false); fetchTrainings(); };

    /* Stats */
    const totalPhotos = trainings.reduce((acc, t) => acc + (t.photos?.length || 0), 0);
    const withOfficer = trainings.filter(t => t.officerName).length;
    const uniqueStates = new Set(trainings.map(t => t.state)).size;

    return (
        <div className="min-h-screen bg-gray-50 -m-6">
            <Toast notification={notification} />

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-[#0E2A4E] to-[#1a3c6b] px-6 py-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/20 border border-orange-400/30 rounded-2xl flex items-center justify-center">
                            <Shield size={24} className="text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">Police Training Management</h1>
                            <p className="text-sm text-white/60">Manage all district-wise training events</p>
                        </div>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg">
                        <Plus size={16} /> Add Training Event
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Events', value: trainings.length, icon: <Building2 size={22} />, color: 'bg-blue-500' },
                        { label: 'Total Photos', value: totalPhotos, icon: <Camera size={22} />, color: 'bg-purple-500' },
                        { label: 'States Covered', value: uniqueStates, icon: <MapPin size={22} />, color: 'bg-green-500' },
                        { label: 'With Chief Guest', value: withOfficer, icon: <Star size={22} />, color: 'bg-amber-500' },
                    ].map((s, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                                    <p className="text-2xl font-black text-gray-900 mt-0.5">{s.value}</p>
                                </div>
                                <div className={`${s.color} w-11 h-11 rounded-xl flex items-center justify-center text-white`}>
                                    {s.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Filter Bar ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search police station, officer…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && fetchTrainings()}
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <select
                            value={filterState}
                            onChange={e => setFilterState(e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[150px]"
                        >
                            <option value="">All States</option>
                            {stateList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={fetchTrainings} disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50">
                            <RotateCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                        </button>
                        {(searchTerm || filterState) && (
                            <button onClick={() => { setSearchTerm(''); setFilterState(''); }}
                                className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                                <X size={13} /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Table ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <Filter size={16} className="text-orange-500" />
                            Training Events
                            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {trainings.length}
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader size={32} className="animate-spin text-[#0E2A4E]" />
                            <span className="ml-3 text-gray-500 text-sm">Loading events…</span>
                        </div>
                    ) : trainings.length === 0 ? (
                        <div className="text-center py-20">
                            <Shield size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-base font-bold text-gray-600 mb-1">No Training Events Found</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                {searchTerm || filterState ? 'Try adjusting your filters.' : 'Add your first police training event.'}
                            </p>
                            <button onClick={openAdd}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors">
                                <Plus size={15} /> Add Event
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Officer</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Photos</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {trainings.map((t, idx) => (
                                        <TrainingRow
                                            key={t._id}
                                            training={t}
                                            idx={idx}
                                            onView={setViewTraining}
                                            onEdit={openEdit}
                                            onDelete={handleDelete}
                                            deleting={deleting}
                                            confirmDeleteId={confirmDeleteId}
                                            setConfirmDeleteId={setConfirmDeleteId}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {showFormModal && (
                    <FormModal
                        key="form-modal"
                        mode={formMode}
                        training={selectedTraining}
                        onClose={() => setShowFormModal(false)}
                        onSaved={onSaved}
                        setNotification={setNotification}
                    />
                )}
                {viewTraining && (
                    <DetailModal
                        key="detail-modal"
                        training={viewTraining}
                        onClose={() => setViewTraining(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PoliceTrainingManagement;
