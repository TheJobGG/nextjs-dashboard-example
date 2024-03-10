'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from "@/auth";
import { AuthError } from 'next-auth';

// Type for error state handling
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Create Invoice action //

// Zod | invoice schema
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer' }),
  amount: z.coerce.number().gt(0, 'Please enter a number greater than $0'),
  status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status' }),
  date: z.string()
});


// Zod | Invoice form schema
const CreateFormInvoice = InvoiceSchema.omit({ id: true, date: true });

// Action method

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateFormInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database error: Failed to Create Invoice'
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// Update Invoice Action //

const UpdateFormInvoice = InvoiceSchema.omit({
  id: true,
  date: true
});

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateFormInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status')
  })


  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.'
    }
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
      `;
  } catch (error) {
    return {
      message: 'Database error: Failed to Update Invoice'
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Delete Invoice Action //

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' }
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' }
  }
}



// Login Sign in //

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
            return 'Invalid credentials';
      
        default:
          return 'Something went wrong';
      }
    }
    throw error;
  }
}
