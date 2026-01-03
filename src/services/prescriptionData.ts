export const recentPrescriptions = [
  {
    id: 1,
    patientId: 101,
    doctorId: 201,
    diagnosis: "Bacterial throat infection",
    additionalNotes: "Drink plenty of water and avoid cold food",
    date: "2025-05-28",
    prescriptionId: "RX-1001",
    validUntilDate: "2025-06-04",
    createdAt: "2025-05-28T10:30:00Z",
    updatedAt: "2025-05-28T10:30:00Z",

    patient: {
      id: 101,
      name: "Vishal Kumar",
      age: 24,
      gender: "Male"
    },

    doctor: {
      id: 201,
      name: "Dr. Shah Faisal",
      specialization: "ENT Specialist"
    },

    medicineRequests: [
      {
        medicineName: "Amoxicillin",
        requestedQuantity: 10
      }
    ],

    prescribedMedications: [
      {
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "Every 8 hours",
        duration: "5 days"
      }
    ]
  },

  {
    id: 2,
    patientId: 102,
    doctorId: 202,
    diagnosis: "High blood pressure",
    additionalNotes: "Monitor BP daily and reduce salt intake",
    date: "2025-05-15",
    prescriptionId: "RX-1002",
    validUntilDate: "2025-06-15",
    createdAt: "2025-05-15T09:15:00Z",
    updatedAt: "2025-05-15T09:15:00Z",

    patient: {
      id: 102,
      name: "Pratik Anand",
      age: 31,
      gender: "Male"
    },

    doctor: {
      id: 202,
      name: "Dr. Numan Faisal",
      specialization: "Cardiologist"
    },

    medicineRequests: [
      {
        medicineName: "Lisinopril",
        requestedQuantity: 30
      }
    ],

    prescribedMedications: [
      {
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days"
      }
    ]
  }
];
