import { betterAuth, type GenericEndpointContext } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { emailOTP } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { db } from "@/db" // your drizzle instance
import { sendAuthOTPEmail } from "../emails/auth-otp"
import { prefixedId } from "../id"

const OTP_LENGTH = 6
const OTP_EXPIRATION_SECONDS = 600 // 10 minutes
const ALLOWED_OTP_ATTEMPTS = 5

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "mysql", // or "pg", "sqlite"
	}),

	plugins: [
		emailOTP({
			sendVerificationOTP,
			otpLength: OTP_LENGTH,
			expiresIn: OTP_EXPIRATION_SECONDS,
			allowedAttempts: ALLOWED_OTP_ATTEMPTS,
		}),
		tanstackStartCookies(), // make sure this is the last plugin in the array
	],

	advanced: {
		database: {
			generateId: (opts) => {
				switch (opts.model) {
					case "user": {
						return prefixedId("usr")
					}

					case "session": {
						return prefixedId("sess")
					}

					case "account": {
						return prefixedId("acct")
					}

					case "verification": {
						return prefixedId("verif")
					}

					default: {
						return false
					}
				}
			},
		},
	},
})

async function sendVerificationOTP(
	data: {
		email: string
		otp: string
		type: "sign-in" | "email-verification" | "forget-password"
	},
	_ctx?: GenericEndpointContext | undefined,
) {
	const { email, otp, type } = data
	switch (type) {
		case "sign-in": {
			await sendAuthOTPEmail({ email, otp })
			break
		}
		default: {
			throw new Error("Unsupported OTP type. Only 'sign-in' is supported.")
		}
	}
}
