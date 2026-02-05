import { useStore } from "@tanstack/react-form"
import React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Input, type InputProps } from "@/components/ui/input"
import { Label, type LabelProps } from "@/components/ui/label"
import * as ShadcnSelect from "@/components/ui/select"
import {
	Switch as ShadcnSwitch,
	type SwitchProps,
} from "@/components/ui/switch"
import {
	Textarea as ShadcnTextarea,
	type TextareaProps,
} from "@/components/ui/textarea"

import { useFieldContext, useFormContext } from "@/hooks/use-form/form-context"

export function SubscribeButton({
	label,
	...props
}: { label: string } & ButtonProps) {
	const form = useFormContext()
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" disabled={isSubmitting} {...props}>
					{label}
				</Button>
			)}
		</form.Subscribe>
	)
}

function ErrorMessages({
	errors,
}: {
	errors: Array<string | { message: string }>
}) {
	return (
		<React.Fragment>
			{errors.map((error) => (
				<div
					key={typeof error === "string" ? error : error.message}
					className="text-xs text-red-500"
				>
					{typeof error === "string" ? error : error.message}
				</div>
			))}
		</React.Fragment>
	)
}

export function TextField({
	label,
	labelProps,
	description,
	...inputProps
}: {
	label: string
	labelProps?: LabelProps
	description?: string
} & InputProps) {
	const field = useFieldContext<string>()
	const errors = useStore(field.store, (state) => state.meta.errors)

	return (
		<div className="space-y-2">
			<Label htmlFor={label} {...labelProps}>
				{label}
			</Label>

			<Input
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				className="bg-background/40 border-border"
				{...inputProps}
			/>

			{field.state.meta.isTouched ? (
				<ErrorMessages errors={errors} />
			) : description ? (
				<p className="text-xs text-muted-foreground">{description}</p>
			) : null}
		</div>
	)
}

export function TextArea({
	label,
	labelProps,
	description,
	...textareaProps
}: {
	label: string
	description?: string
	labelProps?: LabelProps
} & TextareaProps) {
	const field = useFieldContext<string>()
	const errors = useStore(field.store, (state) => state.meta.errors)

	return (
		<div className="space-y-2">
			<Label htmlFor={label} {...labelProps}>
				{label}
			</Label>

			<ShadcnTextarea
				id={label}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				className="bg-background/40 border-border resize-none"
				{...textareaProps}
			/>

			{field.state.meta.isTouched ? (
				<ErrorMessages errors={errors} />
			) : description ? (
				<p className="text-xs text-muted-foreground">{description}</p>
			) : null}
		</div>
	)
}

export function Select({
	label,
	values,
	placeholder,
	contentProps,
	selectProps,
	triggerProps,
	valueProps,
	groupProps,
	labelProps,
	itemProps,
	description,
	required,
}: {
	label: string
	values: Array<{ label: string; value: string }>
	placeholder?: string
	contentProps?: ShadcnSelect.SelectContentProps
	selectProps?: ShadcnSelect.SelectProps
	triggerProps?: ShadcnSelect.SelectTriggerProps
	valueProps?: ShadcnSelect.SelectValueProps
	groupProps?: ShadcnSelect.SelectGroupProps
	labelProps?: ShadcnSelect.SelectLabelProps
	itemProps?: ShadcnSelect.SelectItemProps
	description?: string
	required?: boolean
}) {
	const field = useFieldContext<string>()
	const errors = useStore(field.store, (state) => state.meta.errors)

	return (
		<div className="space-y-2">
			<Label htmlFor={label}>{label}</Label>

			<ShadcnSelect.Select
				required={required}
				name={field.name}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
				{...selectProps}
			>
				<ShadcnSelect.SelectTrigger
					className="bg-background/40 border-border"
					{...triggerProps}
				>
					<ShadcnSelect.SelectValue placeholder={placeholder} {...valueProps} />
				</ShadcnSelect.SelectTrigger>
				<ShadcnSelect.SelectContent {...contentProps}>
					<ShadcnSelect.SelectGroup {...groupProps}>
						<ShadcnSelect.SelectLabel {...labelProps}>
							{label}
						</ShadcnSelect.SelectLabel>
						{values.map((value) => (
							<ShadcnSelect.SelectItem
								key={value.value}
								value={value.value}
								{...itemProps}
							>
								{value.label}
							</ShadcnSelect.SelectItem>
						))}
					</ShadcnSelect.SelectGroup>
				</ShadcnSelect.SelectContent>
			</ShadcnSelect.Select>

			{/* {field.state.meta.isTouched && <ErrorMessages errors={errors} />} */}

			{field.state.meta.isTouched ? (
				<ErrorMessages errors={errors} />
			) : description ? (
				<p className="text-xs text-muted-foreground">{description}</p>
			) : null}
		</div>
	)
}

export function Switch({
	label,
	labelProps,
	...switchProps
}: {
	label: string
	labelProps?: LabelProps
} & SwitchProps) {
	const field = useFieldContext<boolean>()
	const errors = useStore(field.store, (state) => state.meta.errors)

	return (
		<div>
			<div className="flex items-center gap-2">
				<ShadcnSwitch
					id={label}
					onBlur={field.handleBlur}
					checked={field.state.value}
					onCheckedChange={(checked) => field.handleChange(checked)}
					{...switchProps}
				/>

				<Label htmlFor={label} {...labelProps}>
					{label}
				</Label>
			</div>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	)
}
