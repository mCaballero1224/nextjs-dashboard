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

// Validate values using Zod
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});
	// Usually a good idea to store monetary values as cents to avoid 
  // floating-point errors. Use Math.round to ensure amount is a 
  // whole number
	const amountInCents = Math.round(amount * 100);
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

export async function updateInvoice(id: string, formData: FormData) {
  // Extract values from FormData
  const {customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Calculate the amount incents to prevent flaoting-point issues
	const amountInCents = Math.round(amount * 100);

  // Pass values into SQL query
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  // Cache route segments and redirect back to invoices page
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  // No need to redirect, revalidatePath will trigger
  // a new server reqeust and re-render the table
  revalidatePath('/dashboard/invoices');
}
