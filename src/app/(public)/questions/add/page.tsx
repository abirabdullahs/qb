import { redirect } from 'next/navigation';

export default function PublicQuestionsAddRedirect() {
  redirect('/dashboard/questions/new');
}
