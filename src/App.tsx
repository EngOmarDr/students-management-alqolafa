import { useState, useEffect } from 'react';
import { Plus, GraduationCap, LayoutGrid, Table2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { StudentForm } from './components/StudentForm';
import { StudentsList } from './components/StudentsList';
import { StudentsTable } from './components/StudentsTable';
import type { Database } from './lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: StudentInsert) => {
    try {
      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingStudent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchStudents();
      setShowForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
      throw error;
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف بيانات هذا الطالب؟')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">إدارة الطلاب</h1>
                <p className="text-gray-600 text-sm">معهد الخلفاء الراشدين</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={20} />
              إضافة طالب جديد
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">إجمالي الطلاب:</span>
                <span className="text-2xl font-bold text-blue-600">{students.length}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <LayoutGrid size={18} />
                  بطاقات
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Table2 size={18} />
                  جدول
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : viewMode === 'cards' ? (
          <StudentsList
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <StudentsTable
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <StudentForm
            student={editingStudent}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default App;
