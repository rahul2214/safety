import { redirect } from 'next/navigation';

/** Member Posts is now part of Campus Command, where each post and its case are one entry. */
export default function PostsRedirect() {
  redirect('/org/dashboard?tab=all');
}
