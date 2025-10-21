import {
  Calendar,
  MapPin,
  User,
  BookOpen,
  Laptop,
  CheckCircle,
  XCircle,
  UserCheck,
  RefreshCw,
  Clock,
  Layers,
  Award,
  Book,
  Heart,
  Flag,
} from "lucide-react";
import { Database } from "../lib/database.types";

interface StudentDetailsProps {
  userId: string;
  student: Database["public"]["Tables"]["students"]["Row"];
  onCancel: () => void;
}

const StudentDetails = ({ userId, onCancel, student }: StudentDetailsProps) => {
  //   const { id } = useParams();
  //   const navigate = useNavigate();
  //   const student = mockStudents.find(s => s.id === id);

  //   const [student, setStudent] = useState<any>();

  //   useEffect(() => {
  //     getStudent();
  //   }, [userId]);

  //   async function getStudent() {
  //     try {
  //       let { data, error } = await supabase
  //         .from("students")
  //         .select("*")
  //         .eq("id", userId)
  //         .single();

  //       if (error) throw error;
  //       setStudent(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">الطالب غير موجود</h2>
          {/* <Button onClick={() => navigate('/')}>العودة للقائمة</Button> */}
        </div>
      </div>
    );
  }
  const coursesList = student.previous_courses
    .split("\n")
    .map((course, index) => (
      <li
        key={index}
        className="flex items-start gap-2 text-base font-medium text-gray-800"
      >
        <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-1" />
        {course.trim()}
      </li>
    ));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={onCancel} // Close on backdrop click (mock)
      dir="rtl"
    >
      {/* Modal Content Card */}
      {/* max-h-[90vh] makes it vertically scrollable, max-w-5xl ensures it fits well on screens */}
      <div
        className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        {/* <button
          onClick={onCancel}
          className="absolute top-4 left-4 p-2 text-gray-700 rounded-full shadow-lg hover:bg-red-200 transition-colors duration-300 z-50"
          title="إغلاق"
        >
          <XCircle size={24} color="red" />
        </button> */}

        {/* Page Header and Title Card (Adapted for Modal Header) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl py-4 shadow-md border-b-4 border-indigo-600 z-40">
          <div className="flex items-center justify-between gap-5 w-full">
            <div className="flex flex-row items-center gap-5">
              <div className="ms-6 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
                <User size={36} className="text-white drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  {student.student_name}
                </h1>
                {/* <p className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-1">
                  <Fingerprint size={16} className="text-indigo-500" />
                  <span className="text-xs sm:text-sm">ID: {student.id}</span>
                  </p> */}
              </div>
            </div>
            <button
              onClick={onCancel}
              className=" p-2 mx-5 rounded-full hover:bg-red-200 transition-colors duration-300 z-50"
              title="إغلاق"
            >
              <XCircle size={24} color="red" />
            </button>
          </div>
          {/* Action Button */}
        </div>

        {/* Main Content Grid - Padding inside the scrollable area */}
        <div className="p-6 sm:p-8 space-y-10">
          {/* 1. Personal & Contact Information */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-extrabold text-indigo-700 mb-5 border-b-2 border-indigo-200 pb-2 flex items-center gap-3">
              <UserCheck size={24} />
              المعلومات الشخصية والاتصال
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <DetailItem
                icon={Calendar}
                label="تاريخ الميلاد"
                value={student.birth_date}
                color="text-pink-600"
              />
              <DetailItem
                icon={MapPin}
                label="مكان السكن"
                value={student.residence}
                color="text-red-600"
              />
              <DetailItem
                icon={Flag}
                label="الجنسية"
                value={student.nationality}
                color="text-green-600"
              />
              <DetailItem
                icon={Heart}
                label="الوضع العائلي"
                value={student.family_status}
                color="text-orange-600"
              />
              <DetailItem
                icon={UserCheck}
                label="اسم الولي/المسؤول"
                value={student.guardian_name}
                color="text-blue-600"
              />
            </div>
          </div>

          {/* 2. Academic Status */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-extrabold text-indigo-700 mb-5 border-b-2 border-indigo-200 pb-2 flex items-center gap-3">
              <BookOpen size={24} />
              الوضع الأكاديمي والمهارات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <DetailItem
                icon={Award}
                label="أعلى شهادة"
                value={student.certificate}
                color="text-purple-600"
              />
              <DetailItem
                icon={BookOpen}
                label="مقدار حفظ القرآن (جزء)"
                value={student.quran_memorized}
                color="text-yellow-600"
              />
              <DetailItem
                icon={Book}
                label="الكتب المقروءة"
                value={student.books_read}
                color="text-teal-600"
              />

              {/* Computer Proficiency Badge */}
              <div className="flex flex-col gap-1 p-4 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-opacity-50 hover:ring-blue-600/50">
                <div className="flex items-center gap-3">
                  <Laptop size={20} className="text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                    إجادة الحاسب
                  </span>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white font-extrabold text-sm shadow-md transition-colors duration-300 ${
                      student.computer_proficiency
                        ? "bg-green-500 shadow-green-300/50"
                        : "bg-red-500 shadow-red-300/50"
                    }`}
                  >
                    {student.computer_proficiency ? (
                      <>
                        {" "}
                        <CheckCircle size={16} /> يجيد{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <XCircle size={16} /> لا يجيد{" "}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Previous Courses - Full Width Block */}
            <div className="mt-6 bg-gray-50 p-5 rounded-xl border-r-4 border-indigo-400 shadow-inner">
              <h3 className="text-lg font-extrabold text-gray-800 mb-3 flex items-center gap-2">
                <Layers size={20} className="text-indigo-600" />
                الدورات والمشاركات السابقة
              </h3>
              <ul className="space-y-2 list-none p-0 m-0">{coursesList}</ul>
            </div>
          </div>

          {/* 3. System Metadata */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-extrabold text-indigo-700 mb-5 border-b-2 border-indigo-200 pb-2 flex items-center gap-3">
              <Clock size={24} />
              بيانات النظام
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailItem
                icon={Clock}
                label="تاريخ الإنشاء"
                value={formatDate(student.created_at)}
                color="text-gray-500"
              />
              <DetailItem
                icon={RefreshCw}
                label="آخر تحديث"
                value={formatDate(student.updated_at)}
                color="text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;

const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString("ar-SY", options);
  } catch {
    return dateString;
  }
};

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  color: string; // Tailwind color class, e.g., 'text-indigo-600'
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div
    dir="rtl"
    className="flex flex-col gap-1 p-4 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-opacity-50"
    style={
      { "--ring-color": color.replace("text-", "ring-") } as React.CSSProperties
    }
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={`flex-shrink-0 ${color}`} />
      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
        {label}
      </span>
    </div>
    <p className="text-gray-900 font-extrabold text-lg mr-8 leading-snug break-words">
      {value}
    </p>
  </div>
);
