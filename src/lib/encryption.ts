import { createServerFn } from "@tanstack/react-start"
import crypto from "node:crypto"
import { z } from "zod"

import { env } from "@/env"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 16 // For AES-256-GCM
const AUTH_TAG_LENGTH = 16 // For AES-256-GCM

function getEncryptionKey() {
	const key = env.ENCRYPTION_KEY
	if (!key) {
		throw new Error("ENCRYPTION_KEY must be set in environment variables.")
	}

	const keyBuffer = Buffer.from(key, "base64")

	if (keyBuffer.length !== 32) {
		throw new Error("ENCRYPTION_KEY must be a 32-byte (256-bit) string.")
	}

	return { key, keyBuffer }
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * The output format is:
 *   ivHex:ciphertextHex:authTagHex
 *
 * - ivHex:        16-byte initialization vector, hex-encoded
 * - ciphertextHex: AES-256-GCM encrypted data, hex-encoded
 * - authTagHex:   16-byte authentication tag, hex-encoded
 *
 * @param text The plaintext string to encrypt.
 * @returns The encrypted string.
 */
export const encrypt = createServerFn({ method: "POST" })
	.inputValidator(z.string().min(1))
	.handler(async ({ data: text }) => {
		const { keyBuffer } = getEncryptionKey()

		const iv = crypto.randomBytes(IV_LENGTH)
		const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv, {
			authTagLength: AUTH_TAG_LENGTH,
		})

		let encrypted = cipher.update(text, "utf8", "hex")
		encrypted += cipher.final("hex")

		const authTag = cipher.getAuthTag()

		return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`
	})

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Expects the format:
 *   ivHex:ciphertextHex:authTagHex
 *
 * @param encryptedText The encrypted string (base64-encoded IV:ciphertext:authTag).
 * @returns The decrypted plaintext string.
 * @throws Error if decryption fails (e.g., due to wrong key, corrupted data, or tampering).
 */
export const decrypt = createServerFn({ method: "POST" })
	.inputValidator(z.string().min(1))
	.handler(async ({ data: encryptedText }) => {
		const { keyBuffer } = getEncryptionKey()

		const parts = encryptedText.split(":")
		if (parts.length !== 3) {
			throw new Error("Invalid encrypted text format.")
		}

		const iv = Buffer.from(parts[0], "hex")

		const encrypted = parts[1]

		const authTag = Buffer.from(parts[2], "hex")

		const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv, {
			authTagLength: AUTH_TAG_LENGTH,
		})
		decipher.setAuthTag(authTag) // Crucial for GCM to verify authenticity

		let decrypted = decipher.update(encrypted, "hex", "utf8")
		decrypted += decipher.final("utf8")

		return decrypted
	})
