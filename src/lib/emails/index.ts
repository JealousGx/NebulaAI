import { Resend } from "resend"

import { env } from "@/env"

const resend = new Resend(env.RESEND_API_KEY)

type BaseEmail = {
	to: string
	from: string
}

/**
 * Raw email (no template)
 * subject + html + text are REQUIRED
 */
type RawEmail = BaseEmail & {
	template?: never
	subject: string
	html: string
	text: string
}

/**
 * Template-based email
 * subject/html/text are NOT needed
 */
type TemplateEmail = BaseEmail & {
	template: {
		id: string
		variables?: Record<string, string | number> | undefined
	}
	subject?: never
	html?: never
	text?: never
}

export type SendEmailArgs = RawEmail | TemplateEmail

export async function sendEmail(args: SendEmailArgs) {
	const { from, to, template, subject, html, text } = args

	if (template) {
		await resend.emails
			.send({
				from,
				to,
				template,
			})
			.catch((error) => {
				console.error("Failed to send email:", error)
			})
	} else {
		await resend.emails
			.send({
				from,
				to,
				subject,
				html,
				text,
			})
			.catch((error) => {
				console.error("Failed to send email:", error)
			})
	}
}
