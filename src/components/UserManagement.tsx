import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, User, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  permissions: {
    can_view: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_add: boolean;
  };
  is_active: boolean;
  created_at: string;
}

interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'user';
  permissions: {
    can_view: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_add: boolean;
  };
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    permissions: {
      can_view: false,
      can_edit: false,
      can_delete: false,
      can_add: false,
    },
  });
  const { profile } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            permissions: formData.permissions,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
              role: formData.role,
              permissions: formData.permissions,
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }
      }

      await fetchUsers();
      handleCancel();
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      full_name: user.full_name,
      role: user.role,
      permissions: user.permissions,
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      await fetchUsers();
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const toggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error: any) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      full_name: '',
      role: 'user',
      permissions: {
        can_view: false,
        can_edit: false,
        can_delete: false,
        can_add: false,
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
        <p className="text-gray-600 mt-4">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
            <p className="text-sm text-gray-600">إضافة وتعديل صلاحيات المستخدمين</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <Plus size={20} />
          إضافة مستخدم
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold">الاسم</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">البريد الإلكتروني</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">الدور</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">الصلاحيات</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">الحالة</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700" dir="ltr">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                      {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {user.role === 'admin' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          جميع الصلاحيات
                        </span>
                      ) : (
                        <>
                          {user.permissions.can_view && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">عرض</span>
                          )}
                          {user.permissions.can_add && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">إضافة</span>
                          )}
                          {user.permissions.can_edit && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">تعديل</span>
                          )}
                          {user.permissions.can_delete && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">حذف</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(user.id, user.is_active)}
                      disabled={user.id === profile?.id}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {user.is_active ? (
                        <CheckCircle className="text-green-600 mx-auto" size={20} />
                      ) : (
                        <XCircle className="text-red-600 mx-auto" size={20} />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === profile?.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-bold">
                {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={!!editingUser}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-right"
                    dir="ltr"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      كلمة المرور *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الدور *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
              </div>

              {formData.role === 'user' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                    الصلاحيات
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.permissions.can_view}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, can_view: e.target.checked },
                          })
                        }
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">عرض الطلاب</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.permissions.can_add}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, can_add: e.target.checked },
                          })
                        }
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">إضافة طالب</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.permissions.can_edit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, can_edit: e.target.checked },
                          })
                        }
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">تعديل طالب</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-lg hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.permissions.can_delete}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, can_delete: e.target.checked },
                          })
                        }
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">حذف طالب</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingUser ? 'حفظ التعديلات' : 'إضافة مستخدم'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
