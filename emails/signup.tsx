import { Column } from '@react-email/column';
import { Container } from '@react-email/container';
import { Font } from '@react-email/font';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { render } from '@react-email/render';
import { Section } from '@react-email/section';
import { Tailwind } from '@react-email/tailwind';
import { Text } from '@react-email/text';
import * as React from 'react';

interface Props {
	endpoint: string;
}

export const html = (props: Props) => render(<Email {...props} />);

export default function Email({ endpoint }: Props) {
	return (
		<Tailwind>
			<Html lang="en" dir="ltr" className="bg-gray-200 py-4 sm:py-8">
				<Head>
					<title>Your form endpoint!</title>
					<Font
						fontFamily="Roboto"
						fallbackFontFamily="Verdana"
						webFont={{
							url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
							format: 'woff2',
						}}
						fontWeight={400}
						fontStyle="normal"
					/>
				</Head>

				<Container className="shadow bg-white p-4 sm:p-8 rounded-lg">
					<Heading as="h1">Your form endpoint!</Heading>

					<Text className="text-xl">Hi 👋</Text>

					<Text className="mb-8">
						Your form endpoint is {endpoint}.
					</Text>

					<Hr className="mb-8" />

					<Section className="w-full mx-auto">
						<Column className="text-right">
							Brought you by
							<a
								href="http://garethroll.com"
								target="_blank"
								className="ml-2">
								Gareth Roll
							</a>
						</Column>
					</Section>
				</Container>
			</Html>
		</Tailwind>
	);
}
