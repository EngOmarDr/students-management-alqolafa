/*
  # إنشاء جدول الطلاب (Students Table)

  ## الجداول الجديدة
    - `students`
      - `id` (uuid, primary key) - معرف فريد للطالب
      - `student_name` (text) - اسم الطالب
      - `birth_date` (date) - تاريخ الميلاد
      - `residence` (text) - مكان السكن
      - `nationality` (text) - الجنسية
      - `guardian_name` (text) - اسم المُتابِع
      - `previous_courses` (text) - الدورات العلمية السابقة
      - `quran_memorized` (text) - كم يحفظ من القرآن
      - `computer_proficiency` (boolean) - إجادة التعامل مع الحاسب
      - `certificate` (text) - الشهادة الحاصل عليها
      - `family_status` (text) - الوضع العائلي
      - `books_read` (text) - الكتب التي يطالعها
      - `created_at` (timestamptz) - تاريخ الإنشاء
      - `updated_at` (timestamptz) - تاريخ آخر تحديث

  ## الأمان (Security)
    - تفعيل RLS على جدول `students`
    - إضافة سياسات للسماح بجميع العمليات للمستخدمين المصرح لهم
    - السماح للجميع بالقراءة والكتابة (يمكن تخصيصها حسب الحاجة)
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  birth_date date NOT NULL,
  residence text NOT NULL,
  nationality text NOT NULL,
  guardian_name text NOT NULL,
  previous_courses text DEFAULT '',
  quran_memorized text NOT NULL,
  computer_proficiency boolean DEFAULT false,
  certificate text DEFAULT '',
  family_status text NOT NULL,
  books_read text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON students
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read access for anonymous users"
  ON students
  FOR SELECT
  TO anon
  USING (true);