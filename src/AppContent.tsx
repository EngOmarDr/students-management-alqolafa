import { useState, useEffect } from 'react';
import { Plus, GraduationCap, LayoutGrid, Table2, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { StudentForm } from './components/StudentForm';
import { StudentsList } from './components/StudentsList';
import { StudentsTable } from './components/StudentsTable';
import { UserManagement } from './components/UserManagement';
import { useAuth } from './contexts/AuthContext';
import type { Database } from './lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];

export function AppContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState<'students' | 'users'>('students');
  const { user, role, signOut, canView, canAdd, canEdit, canDelete } = useAuth();

  useEffect(() => {
    if (canView()) {
      fetchStudents();
    } else {
      setLoading(false);
    }
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
        if (!canEdit()) {
          alert('ليس لديك صلاحية التعديل');
          return;
        }
        const { error } = await supabase
          .from('students')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingStudent.id);

        if (error) throw error;
      } else {
        if (!canAdd()) {
          alert('ليس لديك صلاحية الإضافة');
          return;
        }
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
    if (!canEdit()) {
      alert('ليس لديك صلاحية التعديل');
      return;
    }
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete()) {
      alert('ليس لديك صلاحية الحذف');
      return;
    }

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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto lg:px-12 py-8">
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
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  {role === 'admin' ? 'مدير' : 'مستخدم'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          </div>
          {/* 
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('students')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${currentPage === 'students'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <GraduationCap size={18} />
                الطلاب
              </button>
              {isAdmin() && (
                <button
                  onClick={() => setCurrentPage('users')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${currentPage === 'users'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Users size={18} />
                  المستخدمين
                </button>
              )}
            </div>
          </div>
 */}
          {currentPage === 'students' && canView() && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">إجمالي الطلاب:</span>
                      <span className="text-2xl font-bold text-blue-600">{students.length}</span>
                    </div>
                    {canAdd() && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md font-medium text-sm"
                      >
                        <Plus size={18} />
                        إضافة طالب
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${viewMode === 'cards'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      <LayoutGrid size={18} />
                      بطاقات
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${viewMode === 'table'
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
            </>
          )}
        </div>

        {currentPage === 'students' ? (
          canView() ? (
            loading ? (
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
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">ليس لديك صلاحية عرض الطلاب</p>
              <p className="text-gray-500 text-sm mt-2">يرجى التواصل مع المدير لمنحك الصلاحيات المناسبة</p>
            </div>
          )
        ) : (
          <UserManagement />
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
