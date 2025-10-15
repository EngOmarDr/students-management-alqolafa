import { Edit2, Trash2, User } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentsListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentsList({ students, onEdit, onDelete }: StudentsListProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 text-lg">لا توجد بيانات طلاب</p>
        <p className="text-gray-400 text-sm mt-1">قم بإضافة طالب جديد للبدء</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <div
          key={student.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {student.student_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{student.student_name}</h3>
                <p className="text-sm text-gray-500">{student.nationality}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ الميلاد:</span>
              <span className="font-medium text-gray-800">{student.birth_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">السكن:</span>
              <span className="font-medium text-gray-800">{student.residence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المُتابِع:</span>
              <span className="font-medium text-gray-800">{student.guardian_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">حفظ القرآن:</span>
              <span className="font-medium text-gray-800">{student.quran_memorized}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الحاسب:</span>
              <span className={`font-medium ${student.computer_proficiency ? 'text-green-600' : 'text-red-600'}`}>
                {student.computer_proficiency ? 'نعم' : 'لا'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الوضع العائلي:</span>
              <span className="font-medium text-gray-800">{student.family_status}</span>
            </div>
            {student.certificate && (
              <div className="flex justify-between">
                <span className="text-gray-600">الشهادة:</span>
                <span className="font-medium text-gray-800">{student.certificate}</span>
              </div>
            )}
          </div>

          {(student.previous_courses || student.books_read) && (
            <div className="border-t pt-3 mb-4 space-y-2">
              {student.previous_courses && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">الدورات السابقة:</p>
                  <p className="text-xs text-gray-700 line-clamp-2">{student.previous_courses}</p>
                </div>
              )}
              {student.books_read && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">الكتب:</p>
                  <p className="text-xs text-gray-700 line-clamp-2">{student.books_read}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(student)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
            >
              <Edit2 size={16} />
              تعديل
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition font-medium text-sm"
            >
              <Trash2 size={16} />
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
