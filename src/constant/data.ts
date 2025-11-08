export const documents = [
  {
    DocumentName: "Certificate of Candidacy for Completion",
    Price: 150.00,
    Purpose: "",
    Quantity: 1,
  },
  {
    DocumentName: "Certificate of Enrollment",
    Price: 150.00,
    Purpose: "",
    Quantity: 1,
  },
  {
    DocumentName: "Copy of Diploma (For Graduates Only)",
    Price: 500.00,
    Purpose: "",
    Quantity: 1,
  },
  {
    DocumentName: "Form 137 / School Form 10",
    Price: 300.00,
    Purpose: "",
    Quantity: 1,
  },
  {
    DocumentName: "Good Moral Certificate",
    Price: 150.00,
    Purpose: "",
    Quantity: 1,
  },
  {
    DocumentName: "ESC Certificate",
    Price: 150.00,
    Purpose: "",
    Quantity: 1,
  },
  {
    DocumentName: "Certification Authentication Verification",
    Price: 700.00,
    Purpose: "",
    Quantity: 1,
  },
];

export const payment = [
  {
    PaymentFees: 'School books',
    Price: 300.00
  },
  {
    PaymentFees: 'Tuition Fee',
    Price: 5000.00
  },
  {
    PaymentFees: 'Miscellaneous Fee',
    Price: 2500.00
  },
  {
    PaymentFees: 'Testing Fee',
    Price: 1000.00
  }
];

export const roles = [
    { label: 'Student', value: 'Student', image: require('../../assets/icons/Book.png') },
    { label: 'Visitor', value: 'Visitor', image: require('../../assets/icons/User.png') },
    { label: 'Alumni', value: 'Alumni', image: require('../../assets/icons/alumni.png') },
];

export const options = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

const currentYear = new Date().getFullYear();

export const yearLevels = Array.from({ length: currentYear - 1990 }, (_, i) => {
  const startYear = currentYear - i - 1;
  const endYear = startYear + 1;
  const label = `${startYear} - ${endYear}`;
  return { label, value: label };
});

export const grades = [
        { label: 'Grade 1', value: '1' },
        { label: 'Grade 2', value: '2' },
        { label: 'Grade 3', value: '3' },
        { label: 'Grade 4', value: '4' },
        { label: 'Grade 5', value: '5' },
        { label: 'Grade 6', value: '6' },
        { label: 'Grade 7', value: '7' },
        { label: 'Grade 8', value: '8' },
        { label: 'Grade 9', value: '9' },
        { label: 'Grade 10', value: '10' },
        { label: 'Grade 11', value: '11' },
        { label: 'Grade 12', value: '12' },
    ];

export const  section =  [
        { label: 'Section 1', value: 'Section 1' },
        { label: 'Section 2', value: 'Section 2' },
        { label: 'Section 3', value: 'Section 3' },
        { label: 'Section 4', value: 'Section 4' },
        { label: 'Section 5', value: 'Section 5' },
        { label: 'Section 6', value: 'Section 6' },
        { label: 'Section 7', value: 'Section 7' },
        { label: 'Section 8', value: 'Section 8' },
        { label: 'Section 9', value: 'Section 9' },
        { label: 'Section 10', value: 'Section 10' },
        { label: 'Section 11', value: 'Section 11' },
        { label: 'Section 12', value: 'Section 12' },
];
