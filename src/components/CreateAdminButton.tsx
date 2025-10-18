import { useState } from 'react';
import { Shield } from 'lucide-react';

export function CreateAdminButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-900 mb-2">إنشاء حساب المدير</h3>
          <p className="text-blue-700 text-sm mb-4">
            لا يوجد مستخدمين في النظام. اضغط على الزر أدناه لإنشاء حساب المدير الأول.
          </p>

          <button
            onClick={createAdmin}
            disabled={loading || (result?.success === true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Shield size={20} />
                إنشاء حساب المدير
              </>
            )}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium mb-2 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.message || (result.success ? 'تم بنجاح' : 'حدث خطأ')}
              </p>
              {result.success && result.credentials && (
                <div className="bg-white p-3 rounded border border-green-300 mt-3" dir="ltr">
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Email:</strong> {result.credentials.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Password:</strong> {result.credentials.password}
                  </p>
                </div>
              )}
              {result.error && (
                <p className="text-sm text-red-700 mt-2">{result.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
