import { redirect } from 'next/navigation';

export default function PublicQuestionsNewRedirect() {
  redirect('/dashboard/questions/new');
}
