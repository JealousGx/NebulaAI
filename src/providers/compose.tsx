import React, { type JSX, type ReactNode } from "react";

type Props = { children: ReactNode };
type Provider = (props: Props) => JSX.Element;

export const composeProviders = (...p: Provider[]) =>
	p.reduceRight(
		(Acc, P) =>
			({ children }: Props) => (
				<P>
					<Acc>{children}</Acc>
				</P>
			),
		({ children }: Props) => <React.Fragment>{children}</React.Fragment>,
	);
