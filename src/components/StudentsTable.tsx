import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, User, MapPin, GraduationCap, Computer, Heart, AlertTriangle, X, Check, Clock, BookOpen, Eye } from 'lucide-react';

import type { Database } from '../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Effect to control the enter/exit animations
  useEffect(() => {
    if (isOpen) {
      // STEP 1: Immediately render the component
      setShouldRender(true);
      // STEP 2: Wait a tick and start the "enter" transition
      const timer = setTimeout(() => setIsTransitioning(true), 10);
      return () => clearTimeout(timer);
    } else {
      // STEP 3: Start the "exit" transition
      setIsTransitioning(false);
      // STEP 4: Unmount component after transition duration (300ms)
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  // Apply classes based on transition state
  const overlayClasses = isTransitioning ? 'opacity-100' : 'opacity-0';
  const modalClasses = isTransitioning ? 'scale-100 opacity-100' : 'scale-95 opacity-0';


  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300 ${overlayClasses}`}
      aria-modal="true"
      role="dialog"
      // Close modal when clicking outside of the content box
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${modalClasses} border-t-8 border-red-500/80 hover:border-red-600`}
        onClick={(e) => e.stopPropagation()} // Prevent the click from bubbling up to the overlay
      >
        <div className="p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-3 p-5 bg-red-50 border-t border-red-100 rounded-b-xl">
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 text-base font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-300/60"
          >
            <Trash2 size={18} />
            تأكيد الحذف
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-xl text-gray-800 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <X size={18} />
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};


// --- STUDENTS TABLE COMPONENT (المكون الرئيسي المُعدّل) ---

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDetails: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentsTable({ students, onEdit, onDelete, onDetails }: StudentsTableProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenDeleteModal = (id: string) => {
    setStudentToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      onDelete(studentToDelete);
      setIsModalOpen(false);
      setStudentToDelete(null);
    }
  };

  if (students.length === 0) {
    return (
      <div dir="rtl" className="text-center py-20 bg-white rounded-3xl shadow-2xl border border-blue-100 m-4 sm:m-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <User size={40} className="text-white drop-shadow-md" />
        </div>
        <p className="text-gray-800 text-2xl font-extrabold mb-3">لا توجد بيانات طلاب حاليًا</p>
        <p className="text-gray-500 text-base">ابدأ بتسجيل أول طالب في قاعدة البيانات باستخدام زر الإضافة أدناه.</p>
      </div>
    );
  }

  // عرض كبطاقات على الهواتف الصغيرة (Mobile View - Card Layout)
  // if (isMobile) {
  //   return (
  //     <div dir="rtl" className="grid gap-6 grid-cols-1">
  //       {students.map((student) => (
  //         <div
  //           key={student.id}
  //           className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-indigo-400/30 transition-all duration-500 hover:scale-[1.01] border border-blue-100 p-6 relative overflow-hidden"
  //         >
  //           {/* Abstract background gradient */}
  //           <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

  //           <div className="flex items-start mb-4">
  //             <h3 className="text-xl font-extrabold text-gray-900 border-b-4 border-blue-500/50 pb-1 pr-2 whitespace-nowrap">
  //               {student.student_name}
  //             </h3>
  //             {/* Status Badge */}
  //             {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white whitespace-nowrap">
  //               <Check size={14} className="ml-1" />
  //               مسجل
  //             </span> */}
  //           </div>

  //           <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
  //             {/* Detail Item: Birth Date */}
  //             <div className="flex  items-center">
  //               <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><Clock size={16} />تاريخ الميلاد:</span>
  //               <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.birth_date}</span>
  //             </div>
  //             {/* Detail Item: Residence */}
  //             <div className="flex items-center">
  //               <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><MapPin size={16} />السكن:</span>
  //               <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.residence}</span>
  //             </div>
  //             {/* Detail Item: Quran Memorized */}
  //             <div className="flex items-center">
  //               <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><BookOpen size={16} />حفظ القرآن:</span>
  //               <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.quran_memorized}</span>
  //             </div>
  //             {/* Detail Item: Computer Proficiency */}
  //             <div className="flex items-center">
  //               <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><Computer size={16} />الحاسب:</span>
  //               <span className={`font-bold text-sm px-2 py-0.5 rounded-lg shadow-inner mx-3 whitespace-nowrap ${student.computer_proficiency ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
  //                 {student.computer_proficiency ? 'يجيد' : 'لا يجيد'}
  //               </span>
  //             </div>
  //             {/* Detail Item: Family Status */}
  //             <div className="flex items-center">
  //               <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><Heart size={16} />الوضع العائلي:</span>
  //               <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.family_status}</span>
  //             </div>
  //           </div>

  //           {/* Action Buttons */}
  //           <div className="flex gap-3 pt-4">
  //             <button
  //               onClick={() => onDetails(student)}
  //               className="flex-grow flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold shadow-lg shadow-green-400/50"
  //             >
  //               <Eye size={18} />
  //             </button>
  //             <button
  //               onClick={() => onEdit(student)}
  //               className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 font-bold shadow-lg shadow-indigo-400/50"
  //             >
  //               <Edit2 size={18} />
  //             </button>
  //             <button
  //               onClick={() => handleOpenDeleteModal(student.id)}
  //               className="flex-grow flex text-center items-center justify-center bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-bold shadow-lg shadow-red-400/50"
  //               title="حذف الطالب"
  //             >
  //               <Trash2 size={18} />
  //             </button>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }

  // عرض كجدول على الشاشات الكبيرة (Desktop View - Table Layout)
  return (
    <>
      <div dir="rtl" className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
              <tr>
                {/* Added whitespace-nowrap to all headers */}
                <th className="px-6 py-4 text-right text-base font-extrabold w-1/5 tracking-wider whitespace-nowrap">الاسم</th>
                <th className="px-6 py-4 text-right text-base font-extrabold whitespace-nowrap">تاريخ الميلاد</th>
                <th className="px-6 py-4 text-right text-base font-extrabold whitespace-nowrap">الجنسية</th>
                <th className="px-6 py-4 text-right text-base font-extrabold whitespace-nowrap">حفظ القرآن</th>
                <th className="px-6 py-4 text-right text-base font-extrabold whitespace-nowrap">الحاسب</th>
                <th className="px-6 py-4 text-right text-base font-extrabold whitespace-nowrap">الشهادة</th>
                <th className="px-6 py-4 text-right text-base font-extrabold whitespace-nowrap">الوضع العائلي</th>
                <th className="px-6 py-4 text-center text-base font-extrabold w-1/12 whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={`hover:bg-indigo-50/70 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">{student.student_name}</span>
                  </td>
                  {/* Birth Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">{student.birth_date}</td>
                  {/* Nationality */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin size={16} className="text-blue-500" />
                      {student.nationality}
                    </div>
                  </td>
                  {/* Quran Memorized */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">{student.quran_memorized}</td>
                  {/* Computer Proficiency */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-md ${student.computer_proficiency
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}
                    >
                      <Computer size={14} />
                      {student.computer_proficiency ? 'نعم' : 'لا'}
                    </span>
                  </td>
                  {/* Certificate */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <GraduationCap size={16} className="text-purple-600" />
                      {student.certificate || '-'}
                    </div>
                  </td>
                  {/* Family Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">{student.family_status}</td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onDetails(student)}
                        className="p-2.5 text-green-600 bg-green-200 hover:bg-green-200 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="التفاصيل"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2.5 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(student.id)}
                        className="p-2.5 text-red-600 bg-red-100 hover:bg-red-200 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal Render */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف الطالب ${students.find(s => s.id === studentToDelete)?.student_name || 'المحدد'}؟ لا يمكن التراجع عن هذا الإجراء.`}
      />
    </>
  );
}