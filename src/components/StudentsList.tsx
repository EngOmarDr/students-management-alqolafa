import React, { useState, useMemo, useEffect } from 'react';
import { Edit2, Trash2, User, Search, MapPin, GraduationCap, Computer, Heart, BookOpen, Calendar, Shield, XCircle, Eye, Clock, AlertTriangle, X } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentsListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDetails: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentsList({ students, onEdit, onDelete, onDetails }: StudentsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  // تصفية الطلاب بناءً على البحث بالاسم
  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // --- حالة قائمة طلاب فارغة ---
  if (students.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 m-4 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <User size={40} className="text-gray-500" />
        </div>
        <p className="text-gray-800 text-2xl font-bold mb-3">لا توجد بيانات طلاب</p>
        <p className="text-gray-500 text-base">قم بإضافة طالب جديد للبدء في بناء قاعدة البيانات وإدارة السجلات.</p>
      </div>
    );
  }

  // --- التصميم الجذّاب لقائمة الطلاب ---
  return (
    <>
      {/* حقل البحث المُحسّن */}
      <div className="relative max-w-xl mx-auto mb-10 shadow-xl rounded-2xl group">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <Search size={22} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="البحث باسم الطالب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
          className="w-full pl-6 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-right placeholder-gray-500 transition-all duration-300 bg-white font-medium text-lg outline-none"
        />
      </div>

      {filteredStudents.length == 0 && searchTerm.trim().length > 0 && <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 m-4 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <User size={40} className="text-gray-500" />
        </div>
        <p className="text-gray-800 text-2xl font-bold mb-3">{searchTerm} لا توجد بيانات طلاب بهذا الاسم</p>

      </div>}

      {/* قائمة الطلاب كبطاقات ديناميكية */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredStudents.map((student) => (
          // <div
          //   key={student.id}
          //   className="bg-white flex flex-col justify-between rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border border-gray-100 overflow-hidden"
          // >
          //   <div>

          //     {/* رأس البطاقة - Gradient Dynamic */}
          //     <div className="bg-gradient-to-br from-blue-700 to-cyan-500 p-6 text-white relative">
          //       {/* شارة حالة الطالب */}
          //       <span className="absolute top-0 left-0 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-br-2xl shadow-md">
          //         نشط
          //       </span>

          //       <div className="flex items-center gap-4 pt-2">
          //         {/* الصورة الرمزية بشكل دائري ثلاثي الأبعاد */}
          //         <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-extrabold shadow-inner border-2 border-white/50">
          //           {student.student_name.charAt(0)}
          //         </div>
          //         <div>
          //           <h3 className="text-2xl font-bold tracking-wide">{student.student_name}</h3>
          //           <p className="text-blue-100 text-sm flex items-center gap-1 mt-0.5">
          //             <MapPin size={14} className="text-cyan-200" />
          //             {student.nationality}
          //           </p>
          //         </div>
          //       </div>
          //     </div>

          //     {/* محتوى البطاقة */}
          //     <div className="p-6 space-y-5">
          //       {/* معلومات أساسية في Grid */}
          //       <div className="space-y-3 text-sm" dir="rtl">
          //         <InfoItem icon={Calendar} label="الميلاد" value={student.birth_date} />
          //         <InfoItem icon={MapPin} label="السكن" value={student.residence} />
          //         <InfoItem icon={Shield} label="المُتابع" value={student.guardian_name || 'غير محدد'} />
          //       </div>

          //       {/* تفاصيل إضافية */}
          //       <div className="border-t border-dashed border-gray-200 pt-5 space-y-3" dir="rtl">
          //         <InfoItem
          //           icon={GraduationCap}
          //           label="حفظ القرآن"
          //           value={student.quran_memorized}
          //           color="text-green-600"
          //         />
          //         <InfoItem
          //           icon={Computer}
          //           label="الحاسب"
          //           value={student.computer_proficiency ? 'مُلِم' : 'غير مُلِم'}
          //           color={student.computer_proficiency ? 'text-green-600' : 'text-red-600'}
          //         />
          //         <InfoItem
          //           icon={Heart}
          //           label="الوضع العائلي"
          //           value={student.family_status}
          //           color="text-orange-500"
          //         />
          //         {student.certificate && (
          //           <InfoItem
          //             icon={GraduationCap}
          //             label="الشهادة"
          //             value={student.certificate}
          //           />
          //         )}
          //       </div>

          //       {/* الدورات والكتب */}
          //       {(student.previous_courses || student.books_read) && (
          //         <div className="border-t border-gray-100 pt-4 space-y-3" dir="rtl">
          //           {student.previous_courses && (
          //             <LongDetail icon={BookOpen} label="الدورات السابقة" content={student.previous_courses} />
          //           )}
          //           {student.books_read && (
          //             <LongDetail icon={BookOpen} label="الكتب المقروءة" content={student.books_read} />
          //           )}
          //         </div>
          //       )}

          //     </div>
          //   </div>
          //   {/* الأزرار - تأثير الفقاعة */}
          //   <div className="flex gap-3 p-6 border-t border-gray-200">
          //     <ActionButton
          //       icon={Eye}
          //       label=""
          //       onClick={() => onDetails(student)}
          //       className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/50"
          //     />
          //     <ActionButton
          //       icon={Edit2}
          //       label="تعديل"
          //       onClick={() => onEdit(student)}
          //       className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
          //     />
          //     <ActionButton
          //       icon={Trash2}
          //       label="حذف"
          //       onClick={() => onDelete(student.id)}
          //       className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/50"
          //     />
          //   </div>
          // </div>

          <div
            key={student.id}
            dir='rtl'
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-indigo-400/30 transition-all duration-500 hover:scale-[1.01] border border-blue-100 p-6 relative overflow-hidden"
          >
            {/* Abstract background gradient */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="flex items-start mb-4">
              <h3 className="text-xl font-extrabold text-gray-900 border-b-4 border-blue-500/50 pb-1 pr-2 whitespace-nowrap">
                {student.student_name}
              </h3>
              {/* Status Badge */}
              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white whitespace-nowrap">
                <Check size={14} className="ml-1" />
                مسجل
              </span> */}
            </div>

            <div className="space-y-3 text-sm border-b border-gray-100 pb-4">
              {/* Detail Item: Birth Date */}
              <div className="flex  items-center">
                <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><Clock size={16} />تاريخ الميلاد:</span>
                <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.birth_date}</span>
              </div>
              {/* Detail Item: Residence */}
              <div className="flex items-center">
                <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><MapPin size={16} />السكن:</span>
                <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.residence}</span>
              </div>
              {/* Detail Item: Quran Memorized */}
              <div className="flex items-center">
                <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><BookOpen size={16} />حفظ القرآن:</span>
                <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.quran_memorized}</span>
              </div>
              {/* Detail Item: Computer Proficiency */}
              <div className="flex items-center">
                <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><Computer size={16} />الحاسب:</span>
                <span className={`font-bold text-sm px-2 py-0.5 rounded-lg shadow-inner mx-3 whitespace-nowrap ${student.computer_proficiency ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {student.computer_proficiency ? 'يجيد' : 'لا يجيد'}
                </span>
              </div>
              {/* Detail Item: Family Status */}
              <div className="flex items-center">
                <span className="font-semibold flex items-center gap-2 text-indigo-600 whitespace-nowrap"><Heart size={16} />الوضع العائلي:</span>
                <span className="text-gray-800 font-medium mx-3 whitespace-nowrap">{student.family_status}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => onDetails(student)}
                className="flex-grow flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold shadow-lg shadow-green-400/50"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onEdit(student)}
                className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 font-bold shadow-lg shadow-indigo-400/50"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleOpenDeleteModal(student.id)}
                className="flex-grow flex text-center items-center justify-center bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-bold shadow-lg shadow-red-400/50"
                title="حذف الطالب"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

        ))}
      </div>
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

// --- مكونات مساعدة لتحسين الوضوح والتكرار ---

// Component for standard info lines
const InfoItem = ({ icon: Icon, label, value, color = 'text-gray-500' }: { icon: React.ElementType, label: string, value: string, color?: string }) => (
  <div className="flex items-center gap-2">
    <Icon size={16} className={`text-blue-500 ${color}`} />
    <span className="font-semibold text-gray-700 min-w-[70px]">{label}:</span>
    <span className="text-gray-600 font-medium">{value}</span>
  </div>
);

// Component for longer text details
const LongDetail = ({ icon: Icon, label, content }: { icon: React.ElementType, label: string, content: string }) => (
  <div>
    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
      <Icon size={16} className="text-blue-500" />
      {label}:
    </span>
    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg line-clamp-2 border border-gray-100">{content}</p>
  </div>
);

// Component for action buttons
const ActionButton = ({ icon: Icon, label, onClick, className }: { icon: React.ElementType, label: string, onClick: () => void, className: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 text-white py-2.5 px-4 rounded-xl transition-all duration-300 font-semibold text-sm transform hover:scale-[1.03] ${className}`}
  >
    <Icon size={18} />
    {label}
  </button>
);


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
