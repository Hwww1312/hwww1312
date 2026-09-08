import { z } from "zod";
import { BUSINESS } from "@/data/siteContent";

/** Shared by the client form and the server action, so they cannot drift. */
export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a phone number we can reach you on.")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "Use digits, spaces, and + ( ) - only."),
  email: z
    .string()
    .trim()
    .max(120)
    .email("That email address does not look right.")
    .optional()
    .or(z.literal("")),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date.")
    .refine((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(`${value}T00:00:00`) >= today;
    }, "Please choose today or a later date."),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Please choose a time.")
    .refine((value) => value >= "08:00" && value <= "21:00",
      `The kitchen runs ${BUSINESS.openingTime} to ${BUSINESS.closingTime}.`),
  guests: z.coerce
    .number()
    .int()
    .min(1, "At least one guest.")
    .max(20, "For more than 20, please call the restaurant."),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
  /** Bots fill hidden fields; people do not. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export type ReservationState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "sent"; message: string }
  /**
   * No email provider is configured yet. The request was NOT delivered, and
   * saying otherwise would be a fake submission, so the visitor is told to
   * call instead.
   */
  | { status: "unconfigured"; message: string };
