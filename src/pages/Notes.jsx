import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNotesData, folderPath, folderIsPrivate } from "../lib/notesApi";
import NoteMarkdown from "../components/notes/NoteMarkdown";
import TableOfContents from "../components/TableOfContents";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const Notes = () => {
  const { noteId, folderId } = useParams();
  const [sessionRejected, setSessionRejected] = useState(false);
  const onUnauthorized = useCallback(() => setSessionRejected(true), []);
  const admin = Boolean(localStorage.getItem("adminToken")) && !sessionRejected;
  const tree = useNotesData("/tree", { admin, onUnauthorized });
  const note = useNotesData(`/notes/${noteId}`, {
    admin,
    onUnauthorized,
    enabled: Boolean(noteId),
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [expanded, setExpanded] = useState({});
  useEffect(() => {
    const timer = setTimeout(() => setTerm(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const searchRequest = useNotesData(`/tree?q=${encodeURIComponent(term)}`, {
    admin,
    onUnauthorized,
    enabled: Boolean(term),
  });
  const folders = tree.data?.folders || [],
    notes = tree.data?.notes || [];
  const selectedFolder = folders.find((folder) => folder._id === folderId);
  const selectedNote = noteId ? note.data : null;
  const selectedParent =
    selectedNote?.folder ||
    notes.find((note) => note._id === noteId)?.folder ||
    folderId;
  const ancestors = folderPath(selectedParent, folders);
  const content =
    selectedNote?.markdownContent || selectedFolder?.introduction || "";
  const title = selectedNote?.title || selectedFolder?.name || "Learning notes";
  const privateContent =
    (selectedNote?.status !== "public" && Boolean(selectedNote)) ||
    folderIsPrivate(selectedParent, folders);
  useDocumentMeta({
    title: admin && privateContent ? "Private notes" : title,
    description:
      "Learning notes on machine learning, algorithms, and software engineering.",
    path: noteId
      ? `/notes/${noteId}`
      : folderId
        ? `/notes/folders/${folderId}`
        : "/notes",
    noindex: admin,
  });
  const closePanel = () => setMobileOpen(false);
  const noteLink = (item) => (
    <Link
      key={item._id}
      onClick={closePanel}
      to={`/notes/${item._id}`}
      aria-current={noteId === item._id ? "page" : undefined}
      className={`block rounded-md px-3 py-2 text-sm transition-colors ${noteId === item._id ? "bg-emerald-400/10 text-emerald-300" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`}
    >
      {item.title}
      {admin &&
        (item.status !== "public" || folderIsPrivate(item.folder, folders)) && (
          <span className="ml-2 text-xs text-amber-400">
            {item.status === "draft" ? "draft" : "private"}
          </span>
        )}
    </Link>
  );
  const branch = (parent = null, seen = new Set()) => (
    <div className={parent ? "ml-3 border-l border-slate-800 pl-2" : ""}>
      {folders
        .filter((folder) => folder.parent === parent && !seen.has(folder._id))
        .map((folder) => {
          const open =
            expanded[folder._id] ??
            ancestors.some((item) => item._id === folder._id);
          return (
            <div key={folder._id}>
              <div className="flex items-center gap-1 py-1">
                <button
                  aria-label={`${open ? "Collapse" : "Expand"} ${folder.name}`}
                  aria-expanded={open}
                  onClick={() =>
                    setExpanded((previous) => ({
                      ...previous,
                      [folder._id]: !open,
                    }))
                  }
                  className="h-8 w-7 shrink-0 rounded text-slate-500 hover:bg-slate-900"
                >
                  {open ? "▾" : "▸"}
                </button>
                <Link
                  onClick={closePanel}
                  to={`/notes/folders/${folder._id}`}
                  className={`min-w-0 flex-1 rounded py-2 text-sm ${folderId === folder._id ? "text-emerald-300" : "text-slate-300 hover:text-white"}`}
                >
                  {folder.name}
                  {admin && folderIsPrivate(folder._id, folders) && (
                    <span className="ml-2 text-xs text-amber-400">private</span>
                  )}
                </Link>
              </div>
              {open && branch(folder._id, new Set([...seen, folder._id]))}
            </div>
          );
        })}
      {notes.filter((note) => (note.folder || null) === parent).map(noteLink)}
    </div>
  );
  const unavailable = (request) => (
    <div
      role="alert"
      className="rounded-lg border border-red-400/20 p-5 text-sm text-red-300"
    >
      {request.error?.response?.status === 401 ? (
        <>
          Admin session expired.{" "}
          <Link to="/login" className="underline">
            Sign in again
          </Link>
          .
        </>
      ) : (
        <>
          Content unavailable.{" "}
          <button onClick={() => request.refetch()} className="underline">
            Try again
          </button>
        </>
      )}
    </div>
  );
  const folderContents = (id) => (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {folders
        .filter((folder) => (folder.parent || null) === (id || null))
        .map((folder) => (
          <Link
            key={folder._id}
            to={`/notes/folders/${folder._id}`}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-emerald-400/40"
          >
            <span className="text-xs font-mono text-emerald-400">FOLDER</span>
            <h2 className="mt-2 font-semibold">{folder.name}</h2>
          </Link>
        ))}
      {notes
        .filter((note) => (note.folder || null) === (id || null))
        .map((item) => (
          <Link
            key={item._id}
            to={`/notes/${item._id}`}
            className="rounded-xl border border-slate-800 p-5 hover:border-emerald-400/40"
          >
            <span className="text-xs font-mono text-slate-500">
              NOTE{admin ? ` / ${item.status.toUpperCase()}` : ""}
            </span>
            <h2 className="mt-2 font-semibold">{item.title}</h2>
          </Link>
        ))}
    </div>
  );
  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-200 lg:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          className="my-4 rounded-lg border border-slate-700 px-4 py-2 text-sm md:hidden"
        >
          {mobileOpen ? "Close folders" : "Browse notes"}
        </button>
        <div className="flex items-start gap-8">
          <aside
            className={`${mobileOpen ? "block" : "hidden"} md:block sticky top-20 w-full shrink-0 self-start border-r border-slate-800 py-6 pr-4 md:w-64 max-h-[calc(100dvh-100px)] overflow-y-auto`}
          >
            <Link
              onClick={closePanel}
              to="/notes"
              className="font-mono text-xs tracking-widest text-emerald-400"
            >
              LEARNING / NOTES
            </Link>
            {admin && (
              <Link
                to="/admin/notes"
                className="mt-3 block text-xs text-slate-400 underline"
              >
                Manage notes
              </Link>
            )}
            <label className="mt-5 mb-4 block">
              <span className="sr-only">Search all notes</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notes…"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </label>
            {tree.isPending ? (
              <p className="text-sm text-slate-500">Loading folders…</p>
            ) : tree.isError && !tree.data ? (
              unavailable(tree)
            ) : term ? (
              <div>
                <p className="mb-2 text-xs text-slate-500">Search results</p>
                {searchRequest.isPending ? (
                  <p className="text-sm text-slate-500">Searching…</p>
                ) : searchRequest.isError ? (
                  unavailable(searchRequest)
                ) : (
                  <>
                    {folders
                      .filter((folder) =>
                        folder.name
                          .toLocaleLowerCase()
                          .includes(term.toLocaleLowerCase()),
                      )
                      .map((folder) => (
                        <Link
                          onClick={closePanel}
                          key={folder._id}
                          to={`/notes/folders/${folder._id}`}
                          className="block py-2 text-sm text-emerald-300"
                        >
                          {folder.name}
                        </Link>
                      ))}
                    {searchRequest.data?.notes.map(noteLink)}
                    {searchRequest.data?.notes.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No matching notes.
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              branch()
            )}
          </aside>
          <main
            className={`${mobileOpen ? "hidden md:block" : "block"} min-w-0 flex-1 py-6 md:py-10`}
          >
            {tree.isPending ? (
              <div className="h-60 animate-pulse rounded-xl bg-slate-900" />
            ) : tree.isError && !tree.data ? (
              unavailable(tree)
            ) : noteId && note.isPending ? (
              <div className="h-60 animate-pulse rounded-xl bg-slate-900" />
            ) : noteId &&
              note.isError &&
              (!note.data || note.error?.response?.status === 404) ? (
              unavailable(note)
            ) : folderId && !selectedFolder ? (
              <p>Folder not found or unavailable.</p>
            ) : (
              <>
                <nav
                  aria-label="Breadcrumb"
                  className="mb-5 flex flex-wrap gap-2 text-xs text-slate-500"
                >
                  <Link to="/notes" className="hover:text-emerald-300">
                    Notes
                  </Link>
                  {ancestors.map((folder) => (
                    <span key={folder._id}>
                      /{" "}
                      <Link
                        to={`/notes/folders/${folder._id}`}
                        className="hover:text-emerald-300"
                      >
                        {folder.name}
                      </Link>
                    </span>
                  ))}
                </nav>
                <header className="mb-8 border-b border-slate-800 pb-6">
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {title}
                  </h1>
                  {selectedNote ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Updated{" "}
                      {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      {admin && privateContent
                        ? ` · ${selectedNote.status === "draft" ? "Draft" : "Private"}`
                        : ""}
                    </p>
                  ) : (
                    !selectedFolder && (
                      <p className="mt-4 text-slate-400">
                        An evolving collection of study notes, experiments, and
                        things I learn.
                      </p>
                    )
                  )}
                </header>
                <div className="flex items-start gap-8">
                  <div className="min-w-0 flex-1">
                    <NoteMarkdown
                      key={noteId || folderId || "root"}
                      content={content}
                      admin={admin}
                    />
                    {!noteId && folderContents(folderId)}
                    {!noteId &&
                      !folderId &&
                      !folders.length &&
                      !notes.length && (
                        <p className="text-slate-500">
                          No notes published yet.
                        </p>
                      )}
                  </div>
                  {content && <TableOfContents key={noteId || folderId} content={content} mobile />}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Notes;
