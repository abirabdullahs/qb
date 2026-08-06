import { redirect } from 'next/navigation';

export default function DashboardAddQuestionRedirect() {
  redirect('/dashboard/questions/new');
}
