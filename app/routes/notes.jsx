import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useCatch, useLoaderData, useNavigate, useTransition } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json({ message: 'Could find any notes.' }, { status: 404, statusText: 'Not found' });
  }
  // return json(notes);
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) { return { message: 'Invalid title : must be at least 5 characters long.' }; }
  // add validation
  const existingNote = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNote.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect('/notes');
}

export const meta = () => ({
  title: 'All Notes',
  description: 'Manage your notes.'
});

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function CatchBoundary() {
  const caughtResponse = useCatch();
  const message = caughtResponse.data?.message || 'Data not found.';
  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function ErrorBoundary({ error }) {
  return (<main className="error">
    <h1>An error related to your notes occurred !</h1>
    <p>{error.message}</p>
    <p>Back to <Link to='/'>Home</Link></p>
  </main>);
}