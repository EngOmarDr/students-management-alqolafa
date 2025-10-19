// import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, User, GraduationCap, BookOpen, Laptop } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const StudentDetails = ({ userId }: { userId: string }) => {
    //   const { id } = useParams();
    //   const navigate = useNavigate();
    //   const student = mockStudents.find(s => s.id === id);

    const [student, setStudent] = useState<any>()

    useEffect(() => {
        getStudent();
    }, [userId])

    async function getStudent() {
        try {
            let { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            console.log(userId);
            console.log(error);
            console.log(data);

            setStudent(data);
        } catch (error) {
            console.log(error);
        }
    }

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

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border card-shadow">
                <div className="container mx-auto px-4 py-4">
                    {/* <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-2"
                    >
                        <ArrowRight className="w-4 h-4 ml-2" />
                        رجوع
                    </Button> */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient-primary mb-1">
                                {student.studentName}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                تفاصيل بيانات الطالب
                            </p>
                        </div>
                        {/* <Button
                            onClick={() => navigate(`/students/edit/${student.id}`)}
                            className="bg-gradient-to-r from-secondary to-secondary-hover"
                        >
                            <Pencil className="w-4 h-4 ml-2" />
                            تعديل
                        </Button> */}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <User className="w-5 h-5" /> المعلومات الشخصية
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {student.dateOfBirth && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>تاريخ الميلاد</span>
                                </div>
                                <p className="font-semibold">
                                    {new Date(student.dateOfBirth).toLocaleDateString('ar-SA')}
                                </p>
                            </div>
                        )}

                        {student.nationality && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>الجنسية</span>
                                </div>
                                <p className="font-semibold">{student.nationality}</p>
                            </div>
                        )}

                        {student.address && (
                            <div className="md:col-span-2">
                                <div className="text-sm text-gray-500 mb-1">مكان السكن</div>
                                <p className="font-semibold">{student.address}</p>
                            </div>
                        )}

                        {student.guardianName && (
                            <div>
                                <div className="text-sm text-gray-500 mb-1">اسم المُتابِع</div>
                                <p className="font-semibold">{student.guardianName}</p>
                            </div>
                        )}

                        {student.maritalStatus && (
                            <div>
                                <div className="text-sm text-gray-500 mb-1">الوضع العائلي</div>
                                <p className="font-semibold">{student.maritalStatus}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5" /> المعلومات التعليمية
                    </h2>
                    {student.degree && (
                        <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">الشهادة</div>
                            <p className="font-semibold">{student.degree}</p>
                        </div>
                    )}

                    {student.quranMemorized && (
                        <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">حفظ القرآن</div>
                            <p className="font-semibold text-indigo-700">{student.quranMemorized}</p>
                        </div>
                    )}

                    {student.computerSkills && (
                        <div className="mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <Laptop className="w-4 h-4" />
                                <span>مهارات الحاسوب</span>
                            </div>
                            <p className="font-semibold">{student.computerSkills}</p>
                        </div>
                    )}

                    {student.previousCourses && student.previousCourses.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                            <div className="text-sm text-gray-500 mb-2">الدورات العلمية السابقة</div>
                            <div className="flex flex-wrap gap-2">
                                {/* {student.previousCourses.map((course, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                                        {course}
                                    </span>
                                ))} */}
                            </div>
                        </div>
                    )}
                </section>

                {student.readingBooks && student.readingBooks.length > 0 && (
                    <section className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5" /> الكتب المقروءة
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {/* {student.readingBooks.map((book, idx) => (
                                <span key={idx} className="border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full">
                                    {book}
                                </span>
                            ))} */}
                        </div>
                    </section>
                )}

                <section className="bg-gray-100 rounded-lg p-4 text-xs text-gray-500 space-y-1">
                    <p>تاريخ الإضافة: {new Date(student.createdAt).toLocaleString('ar-SA')}</p>
                    <p>آخر تحديث: {new Date(student.updatedAt).toLocaleString('ar-SA')}</p>
                </section>
            </main>
        </div>

    );
};

export default StudentDetails;
