/*
  # تحديث سياسات الأمان لجدول الطلاب

  ## التغييرات
    - حذف السياسات القديمة المقيدة
    - إضافة سياسات جديدة تسمح بجميع العمليات للمستخدمين غير المصادق عليهم
    - السماح بالقراءة والإضافة والتحديث والحذف للجميع

  ## السياسات الجديدة
    - سياسة SELECT للجميع
    - سياسة INSERT للجميع
    - سياسة UPDATE للجميع
    - سياسة DELETE للجميع
*/

DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON students;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON students;

CREATE POLICY "Allow select for all users"
  ON students
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert for all users"
  ON students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for all users"
  ON students
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete for all users"
  ON students
  FOR DELETE
  TO anon, authenticated
  USING (true);