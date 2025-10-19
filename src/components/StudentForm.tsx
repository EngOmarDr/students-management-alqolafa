import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (data: StudentInsert) => Promise<void>;
  onCancel: () => void;
}

export function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentInsert>({
    student_name: '',
    birth_date: '',
    residence: '',
    nationality: '',
    guardian_name: '',
    previous_courses: '',
    quran_memorized: '',
    computer_proficiency: false,
    certificate: '',
    family_status: '',
    books_read: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        student_name: student.student_name,
        birth_date: student.birth_date,
        residence: student.residence,
        nationality: student.nationality,
        guardian_name: student.guardian_name,
        previous_courses: student.previous_courses,
        quran_memorized: student.quran_memorized,
        computer_proficiency: student.computer_proficiency,
        certificate: student.certificate,
        family_status: student.family_status,
        books_read: student.books_read,
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        student_name: '',
        birth_date: '',
        residence: '',
        nationality: '',
        guardian_name: '',
        previous_courses: '',
        quran_memorized: '',
        computer_proficiency: false,
        certificate: '',
        family_status: '',
        books_read: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {student ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم الطالب *
            </label>
            <input
              type="text"
              required
              value={formData.student_name}
              onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ الميلاد *
            </label>
            <input
              type="date"
              required
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مكان السكن *
            </label>
            <input
              type="text"
              required
              value={formData.residence}
              onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الجنسية *
            </label>
            <input
              type="text"
              required
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المُتابِع
            </label>
            <input
              type="text"
              value={formData.guardian_name}
              onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الدورات العلمية التي سبق أن اشتركت بها
            </label>
            <textarea
              value={formData.previous_courses}
              onChange={(e) => setFormData({ ...formData, previous_courses: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كم تحفظ من القرآن *
            </label>
            <input
              type="text"
              required
              value={formData.quran_memorized}
              onChange={(e) => setFormData({ ...formData, quran_memorized: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: 5 أجزاء، حافظ كامل، ..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="computer_proficiency"
              checked={formData.computer_proficiency}
              onChange={(e) => setFormData({ ...formData, computer_proficiency: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="computer_proficiency" className="mr-2 text-sm font-medium text-gray-700">
              هل تجيد التعامل مع الحاسب
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الشهادة الحاصل عليها
            </label>
            <input
              type="text"
              value={formData.certificate}
              onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوضع العائلي *
            </label>
            <select
              required
              value={formData.family_status}
              onChange={(e) => setFormData({ ...formData, family_status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر...</option>
              <option value="أعزب">أعزب</option>
              <option value="متزوج">متزوج</option>
              <option value="مطلق">مطلق</option>
              <option value="أرمل">أرمل</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ما هي الكتب التي تطالعها
            </label>
            <textarea
              value={formData.books_read}
              onChange={(e) => setFormData({ ...formData, books_read: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'جاري الحفظ...' : student ? 'تحديث' : 'إضافة'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
