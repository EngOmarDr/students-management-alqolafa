import { Edit2, Trash2, User } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentsTable({ students, onEdit, onDelete }: StudentsTableProps) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold">الاسم</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">تاريخ الميلاد</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">السكن</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">الجنسية</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">المُتابِع</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">حفظ القرآن</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">الحاسب</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">الشهادة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">الوضع العائلي</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, index) => (
              <tr
                key={student.id}
                className={`hover:bg-blue-50 transition ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {student.student_name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{student.student_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{student.birth_date}</td>
                <td className="px-4 py-3 text-gray-700">{student.residence}</td>
                <td className="px-4 py-3 text-gray-700">{student.nationality}</td>
                <td className="px-4 py-3 text-gray-700">{student.guardian_name}</td>
                <td className="px-4 py-3 text-gray-700">{student.quran_memorized}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      student.computer_proficiency
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {student.computer_proficiency ? 'نعم' : 'لا'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {student.certificate || '-'}
                </td>
                <td className="px-4 py-3 text-gray-700">{student.family_status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="تعديل"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
  );
}
