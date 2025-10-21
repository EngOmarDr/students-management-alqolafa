import { useState } from 'react';
import { LogIn, GraduationCap, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية زخرفية خفيفة */}
      <div className="absolute inset-0 opacity-30"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 relative z-10">
        {/* شعار المعهد مع تأثير تلألؤ */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-pulse"></div>
            <GraduationCap size={48} className="text-white relative z-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            معهد الخلفاء الراشدين
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            نظام إدارة الطلاب
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="text-right">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Mail size={18} className="text-blue-500" />
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-right placeholder-gray-400 transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm"
                placeholder="أدخل بريدك الإلكتروني"
              />
              <Mail className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="text-right">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Lock size={18} className="text-blue-500" />
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-right placeholder-gray-400 transition-all duration-300 bg-gray-50 hover:bg-white shadow-sm"
                placeholder="أدخل كلمة المرور"
              />
              <Lock className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm text-right animate-bounce shadow-md">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <LogIn size={22} />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2025 معهد الخلفاء الراشدين - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div >
  );
}


// <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex items-center justify-center p-4">
//   <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8">
//     {/* شعار المعهد */}
//     <div className="flex flex-col items-center mb-8 text-center">
//       <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-[pulse_3s_ease-in-out_infinite]">
//         <GraduationCap size={42} className="text-white" />
//       </div>
//       <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
//         معهد الخلفاء الراشدين
//       </h1>
//       <p className="text-gray-600 text-sm sm:text-base">
//         نظام إدارة الطلاب
//       </p>
//     </div>

//     {/* نموذج تسجيل الدخول */}
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="text-right">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           البريد الإلكتروني
//         </label>
//         <div className='relative'>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full pr-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-400 transition"
//           />
//           <Mail className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" size={20} />
//         </div>

//       </div>

//       <div className="text-right">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           كلمة المرور
//         </label>
//         <div className='relative'>

//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full pr-12 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-400 transition"
//           />
//           <Lock className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-right animate-fadeIn">
//           {error}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? (
//           <>
//             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             <span>جاري تسجيل الدخول...</span>
//           </>
//         ) : (
//           <>
//             <LogIn size={20} />
//             <span>تسجيل الدخول</span>
//           </>
//         )}
//       </button>
//     </form>

//     <div className="mt-8 text-center text-xs text-gray-500">
//       <p>© 2025 معهد الخلفاء الراشدين</p>
//     </div>
//   </div>

// </div>
