import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";

import styles from '~/styles/notedetail.css';

export default function NoteDetailsPage() {
  const note = useLoaderData();
  console.log(note);
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to='/notes'>Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>

      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export async function loader(data) {
  const notes = await getStoredNotes();
  const noteId = data.params.noteId;
  const selectedNote = notes.find(note => note.id === noteId);
  if (!selectedNote) {
    throw json(
      { message: `Could not find note for id: ${ noteId }` },
      { status: 404, statusText: 'Not found' }
    );
  }
  return selectedNote;
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta = ({ data }) => ({
  title: data.title,
  // description: 'Manage your notes.'
});