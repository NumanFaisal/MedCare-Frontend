import * as z from "zod";

// --- 1. Sign Up Schema ---
export const signUpSchema = z.object({
  role: z.enum(["USER", "MEDICAL", "DOCTOR"]),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  
  // Optional fields (validated conditionally below)
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  facilityName: z.string().optional(),
  address: z.string().optional(),
})
.superRefine((data, ctx) => {
  // Doctor Logic
  if (data.role === "DOCTOR") {
    if (!data.specialization) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Specialization is required",
        path: ["specialization"],
      });
    }
    if (!data.licenseNumber || data.licenseNumber.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid license number is required",
        path: ["licenseNumber"],
      });
    }
  }

  // Medical Logic
  if (data.role === "MEDICAL") {
    if (!data.facilityName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Facility name is required",
        path: ["facilityName"],
      });
    }
    if (!data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required",
        path: ["address"],
      });
    }
  }
});

// Extract the Type automatically
export type SignUpFormValues = z.infer<typeof signUpSchema>;


// --- 2. (Example) Login Schema for later ---
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;