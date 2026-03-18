'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(['pending', 'paid']),
	date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});
	// Usually a good idea to store monetary values as cents to avoid 
	// floating-point errors
	const amountInCents = amount * 100;
	const date = new Date().toISOString().split('T')[0];

	await sql`
		INSERT INTO invoices (customer_id, amount, status, date)
		VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	`;

	// Cache route segments to enable quick navigation
	revalidatePath('/dashboard/invoices');
	// Redirect user back to /dashboard/invoices page after
	// invoice creation
	redirect('/dashboard/invoices');
}
