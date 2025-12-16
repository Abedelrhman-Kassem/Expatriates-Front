export type Student = {
  name: string | undefined;
  submissionNumber: string | undefined;
  nationality: string | undefined;
  passportNumber: string | undefined;
  idNumber: string | undefined;
  college: string | undefined;
  gender: string | undefined;
  certificateCountry: string | undefined;
  admissionYear: string | undefined;
  exemptionStatus: string | undefined;
  studentStatus: string | undefined;
  major: string | undefined;
  birthDate: string | undefined;
  placeOfResidence: string | undefined;
  email: string | undefined;
  whatsNumber: string | undefined;
  number: string | undefined;
  applicationType: string | undefined;
  educationStage: string | undefined;
  educationType: string | undefined;
  requestType: string | undefined;
  formatType: string | undefined;
  percentage: string | undefined;
};

export const genderValues: string[] = ['ذكر', 'أنثى'];

export const gradeValues: string[] = [
  'المستوي صفر',
  'المستوي الأول',
  'المستوي الثاني',
  'المستوي الثالث',
  'المستوي الرابع',
  'المستوي الخامس',
  'المستوي السادس',
];

export const admissionYearValues: string[] = Array.from(
  { length: 20 },
  (_, i) => {
    const end = new Date().getFullYear() - i;
    const start = end - 1;
    return `${start}/${end}`;
  }
);

export const exemptionStatusValues: string[] = [
  'نفقة خاصة',
  'تخفيض',
  'منحة',
  'معاملة طالب مصري',
];

export const studentStatusValues: string[] = ['باقي', 'مستجد'];

export const entryTypeValues: string[] = ['مقيد', 'مرشح'];

export const collegeValues: string[] = [
  'الآداب',
  'التجارة',
  'التربية',
  'التربية النوعية',
  'التمريض',
  'الحاسبات',
  'الحقوق',
  'الزراعة',
  'الصيدلة',
  'الطب البشري',
  'الطب البيطري',
  'العلوم',
  'الهندسة',
  'تربية رياضية بنين',
  'تكنولوجيا و تنمية',
  'طب فاقوس',
  'طب وجراحة الفم و الأسنان',
  'علوم إعاقة',
];

export const requestTypeValues: string[] = [
  'تحويل من الخارج',
  'تحويل من الداخل',
  'إعادة ترشيح',
  'تعديل ترشيح',
  'نقل قيد',
  'طلب',
];

export const educationTypeValues: string[] = ['ساعات معتمده', 'فصلى'];

export const formatTypeValues: string[] = ['مصري', 'من الخارج'];

export const applicationTypeValues: string[] = ['عادى', 'مصروفات خاصة'];
