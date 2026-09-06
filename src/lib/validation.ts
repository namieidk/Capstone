import { z } from "zod";

// Standard password policy: at least 8 characters with 1 uppercase,
// 1 lowercase, and 1 special character. Used everywhere a password is
// set (admin add-employee, signup, …) so the rule stays in one place.
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character.");

export type PasswordInput = z.infer<typeof passwordSchema>;

// Returns the first unmet requirement, or null when the value is valid.
export function getPasswordError(value: string): string | null {
  const result = passwordSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Password does not meet the requirements.";
}

// Global grade retention threshold: percentage between 0 and 100.
export const thresholdSchema = z
  .number({ error: "Threshold must be a number." })
  .min(0, "Threshold must be at least 0%.")
  .max(100, "Threshold must be at most 100%.");

// School grading system form (mirrors CreateSchoolGradingDto on the backend).
export const schoolGradingSchema = z.object({
  school_name: z.string().trim().min(1, "School name is required.").max(150, "School name is too long."),
  grading_scale: z.string().trim().min(1, "Grading scale is required.").max(50, "Grading scale is too long."),
  passing_grade: z.number({ error: "Passing grade must be a number." }).finite("Passing grade must be a number."),
  highest_grade: z.number({ error: "Highest grade must be a number." }).finite("Highest grade must be a number."),
  failing_grade: z.number({ error: "Failing grade must be a number." }).finite("Failing grade must be a number."),
  notes: z.string().max(2000, "Notes are too long.").optional(),
  special_codes: z.record(z.string(), z.string()).optional(),
});
