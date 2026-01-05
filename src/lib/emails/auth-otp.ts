import { sendEmail } from "."

const FROM = "nebula@jealous.dev"

export async function sendAuthOTPEmail(data: { email: string; otp: string }) {
	await sendEmail({
		data: {
			from: FROM,
			to: data.email,
			template: {
				id: "account-verification-code",
				variables: {
					OTP: data.otp,
					CURR_YEAR: new Date().getFullYear(),
				},
			},
		},
	})
}
