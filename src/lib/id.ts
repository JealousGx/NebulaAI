import { uuidv7 } from "uuidv7"

export function prefixedId(prefix: string) {
	return `${prefix}_${uuidv7Base64Url()}`
}

function uuidv7Base64Url() {
	const hex = uuidv7().replace(/-/g, "")

	return Buffer.from(hex, "hex").toString("base64url")
}
