import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useNotesData,
  notesAdminRequest,
  refreshNotes,
  folderPath,
  folderIsPrivate,
} from "../lib/notesApi";
import NoteMarkdown from "../components/notes/NoteMarkdown";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const fieldClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400";
const buttonClass =
  "rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-emerald-400 disabled:opacity-50";
const FolderOptions = ({ folders, exclude }) => (
  <>
    <option value="">Root</option>
    {folders
      .filter(
        (folder) =>
          !folderPath(folder._id, folders).some((item) => item._id === exclude),
      )
      .map((folder) => (
        <option key={folder._id} value={folder._id}>
          {folderPath(folder._id, folders)
            .map((item) => item.name)
            .join(" / ")}
        </option>
      ))}
  </>
);

const ContentEditor = ({ type, item, folders, parent, onClose, onSaved }) => {
  const folder = type === "folder";
  const [title, setTitle] = useState(item?.[folder ? "name" : "title"] || "");
  const [location, setLocation] = useState(
    item?.[folder ? "parent" : "folder"] || parent || "",
  );
  const [content, setContent] = useState(
    item?.[folder ? "introduction" : "markdownContent"] || "",
  );
  const [visibility, setVisibility] = useState(
    item?.[folder ? "visibility" : "status"] || (folder ? "public" : "draft"),
  );
  const [tags, setTags] = useState(item?.tags?.join(", ") || "");
  const [order, setOrder] = useState(item?.order || 0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = folder
        ? {
            name: title,
            parent: location || null,
            introduction: content,
            visibility,
            order: Number(order),
          }
        : {
            title,
            folder: location || null,
            markdownContent: content,
            status: visibility,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            order: Number(order),
          };
      await notesAdminRequest(
        item ? "put" : "post",
        `/${folder ? "folders" : "notes"}${item ? `/${item._id}` : ""}`,
        data,
      );
      await refreshNotes();
      onSaved();
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <form
      onSubmit={save}
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-7"
    >
      <h2 className="mb-6 text-xl font-semibold">
        {item ? "Edit" : "New"} {folder ? "folder" : "note"}
      </h2>
      <fieldset disabled={saving} className="space-y-5">
        <label className="block text-sm">
          {folder ? "Folder name" : "Title"}
          <input
            required
            maxLength={folder ? 120 : 200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={`${fieldClass} mt-2`}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            {folder ? "Parent folder" : "Folder"}
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={`${fieldClass} mt-2`}
            >
              <FolderOptions
                folders={folders}
                exclude={folder ? item?._id : undefined}
              />
            </select>
          </label>
          <label className="block text-sm">
            {folder ? "Visibility" : "Status"}
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
              className={`${fieldClass} mt-2`}
            >
              {(folder
                ? ["public", "private"]
                : ["draft", "public", "private"]
              ).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Order
            <input
              type="number"
              required
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className={`${fieldClass} mt-2`}
            />
            <span className="mt-1 block text-xs text-slate-500">
              Lower numbers appear first.
            </span>
          </label>
        </div>
        {(folderIsPrivate(location, folders) ||
          (folder && visibility === "private")) && (
          <p className="text-sm text-amber-300">
            This folder and its descendants are private. A public note inside it
            remains hidden from visitors.
          </p>
        )}
        {!folder && (
          <label className="block text-sm">
            Tags
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="ML, Python, autograd"
              className={`${fieldClass} mt-2`}
            />
          </label>
        )}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="note-markdown" className="text-sm">
              {folder ? "Folder introduction" : "Content"} · Markdown
            </label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={buttonClass}
            >
              {preview ? "Edit Markdown" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="min-h-48 rounded-lg border border-slate-800 p-5">
              <NoteMarkdown content={content} admin />
            </div>
          ) : (
            <textarea
              id="note-markdown"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={18}
              className={`${fieldClass} font-mono`}
              placeholder={
                folder
                  ? "Describe this course, book, or topic…"
                  : "# My note\n\nCode, explanations, and $math$…"
              }
            />
          )}
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="flex gap-3 border-t border-slate-800 pt-5">
          <button
            type="submit"
            className="rounded-lg bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onClose} className={buttonClass}>
            Cancel
          </button>
        </div>
      </fieldset>
    </form>
  );
};

const AdminNotes = () => {
  const tree = useNotesData("/tree", { admin: true });
  const folders = tree.data?.folders || [],
    notes = tree.data?.notes || [];
  const [current, setCurrent] = useState(null);
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [importTitle, setImportTitle] = useState("");
  const [importFolder, setImportFolder] = useState("");
  const selectedFolder = folders.find((folder) => folder._id === current);
  useDocumentMeta({
    title: "Manage notes",
    path: "/admin/notes",
    noindex: true,
  });
  const navigateFolder = (id) => {
    setCurrent(id);
    setEditor(null);
    setImportOpen(false);
    setError("");
    setNotice("");
  };
  const editNote = async (id) => {
    setBusy(true);
    setError("");
    try {
      const item = await notesAdminRequest("get", `/notes/${id}`);
      setEditor({ type: "note", item });
      setImportOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to open note.");
    } finally {
      setBusy(false);
    }
  };
  const remove = async (type, item) => {
    if (
      !window.confirm(
        `Delete ${item.name || item.title}?${type === "folder" ? " Only empty folders can be deleted." : ""}`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await notesAdminRequest(
        "delete",
        `/${type === "folder" ? "folders" : "notes"}/${item._id}`,
      );
      if (current === item._id) setCurrent(item.parent || null);
      await refreshNotes();
      setNotice("Deleted successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to delete.");
    } finally {
      setBusy(false);
    }
  };
  const importFile = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!file || file.size > 4 * 1024 * 1024)
        throw new Error("Choose a .md, .ipynb or ZIP file under 4 MB.");
      const data = new FormData();
      data.append("file", file);
      data.append("folder", importFolder);
      if (importTitle.trim()) data.append("title", importTitle.trim());
      const note = await notesAdminRequest("post", "/import", data);
      await refreshNotes();
      setCurrent(note.folder || null);
      setEditor({ type: "note", item: note });
      setImportOpen(false);
      setFile(null);
      setNotice("Imported as a draft. Review the preview before publishing.");
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Import failed.",
      );
    } finally {
      setBusy(false);
    }
  };
  const navigation = (parent = null, seen = new Set()) =>
    folders
      .filter(
        (folder) => (folder.parent || null) === parent && !seen.has(folder._id),
      )
      .map((folder) => (
        <div key={folder._id} className="ml-3 border-l border-slate-800 pl-2">
          <button
            disabled={busy}
            onClick={() => navigateFolder(folder._id)}
            className={`w-full rounded px-2 py-2 text-left text-sm ${current === folder._id ? "bg-emerald-400/10 text-emerald-300" : "text-slate-400 hover:text-white"}`}
          >
            {folder.name}
            {folderIsPrivate(folder._id, folders) && (
              <span className="ml-2 text-xs text-amber-400">private</span>
            )}
          </button>
          {navigation(folder._id, new Set([...seen, folder._id]))}
        </div>
      ));
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="font-mono text-xs tracking-widest text-emerald-400">
              WORKSPACE / NOTES
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Learning archive</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/notes" className={buttonClass}>
              Read notes
            </Link>
            <Link to="/admin" className={buttonClass}>
              Back to workspace
            </Link>
          </div>
        </header>
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-400/20 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-emerald-400/20 p-4 text-sm text-emerald-300"
          >
            {notice}
          </p>
        )}
        {tree.isPending ? (
          <p>Loading archive…</p>
        ) : tree.isError ? (
          <p role="alert">
            Unable to load notes.{" "}
            <Link to="/login" className="underline">
              Sign in again
            </Link>{" "}
            or{" "}
            <button onClick={() => tree.refetch()} className="underline">
              retry
            </button>
            .
          </p>
        ) : (
          <div className="grid items-start gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="max-h-[60vh] overflow-y-auto rounded-xl border border-slate-800 p-3 md:sticky md:top-24">
              <button
                disabled={busy}
                onClick={() => navigateFolder(null)}
                className={`w-full p-2 text-left text-sm ${current === null ? "text-emerald-300" : "text-slate-300"}`}
              >
                All folders / Root
              </button>
              {navigation()}
            </aside>
            <main className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {folderPath(current, folders)
                      .map((folder) => folder.name)
                      .join(" / ") || "Root"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    {selectedFolder?.name || "Unfiled notes"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={busy}
                    onClick={() => {
                      setEditor({ type: "folder" });
                      setImportOpen(false);
                    }}
                    className={buttonClass}
                  >
                    + Folder
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => {
                      setEditor({ type: "note" });
                      setImportOpen(false);
                    }}
                    className={buttonClass}
                  >
                    + Note
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => {
                      setImportOpen(true);
                      setEditor(null);
                      setImportFolder(current || "");
                      setImportTitle("");
                    }}
                    className={buttonClass}
                  >
                    Import .md / .ipynb / ZIP
                  </button>
                </div>
              </div>
              {importOpen ? (
                <form
                  onSubmit={importFile}
                  className="space-y-5 rounded-xl border border-slate-800 p-5"
                >
                  <h3 className="text-xl font-semibold">Import a note</h3>
                  <p className="text-sm text-slate-400">
                    A .md or .ipynb file, or a ZIP containing one .md and its relative
                    image files. Maximum upload: 4 MB. Expanded ZIP: 12 MB.
                    Notebooks convert saved cells and outputs without executing code.
                    Imported notes start as drafts.
                  </p>
                  <fieldset disabled={busy} className="space-y-4">
                    <label className="block text-sm">
                      File
                      <input
                        required
                        type="file"
                        accept=".md,.ipynb,.zip"
                        onChange={(event) =>
                          setFile(event.target.files[0] || null)
                        }
                        className={`${fieldClass} mt-2`}
                      />
                    </label>
                    <label className="block text-sm">
                      Title (optional)
                      <input
                        value={importTitle}
                        onChange={(event) => setImportTitle(event.target.value)}
                        className={`${fieldClass} mt-2`}
                      />
                    </label>
                    <label className="block text-sm">
                      Destination
                      <select
                        value={importFolder}
                        onChange={(event) =>
                          setImportFolder(event.target.value)
                        }
                        className={`${fieldClass} mt-2`}
                      >
                        <FolderOptions folders={folders} />
                      </select>
                    </label>
                    <div className="flex gap-3">
                      <button
                        className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
                        type="submit"
                      >
                        {busy ? "Importing…" : "Import as draft"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImportOpen(false)}
                        className={buttonClass}
                      >
                        Cancel
                      </button>
                    </div>
                  </fieldset>
                </form>
              ) : editor ? (
                <ContentEditor
                  key={`${editor.type}:${editor.item?._id || "new"}`}
                  type={editor.type}
                  item={editor.item}
                  folders={folders}
                  parent={current}
                  onClose={() => setEditor(null)}
                  onSaved={() => {
                    setEditor(null);
                    setNotice("Saved successfully.");
                  }}
                />
              ) : (
                <>
                  {selectedFolder && (
                    <div className="mb-6 flex flex-wrap gap-3 text-sm">
                      <button
                        disabled={busy}
                        onClick={() =>
                          setEditor({ type: "folder", item: selectedFolder })
                        }
                        className="text-emerald-300"
                      >
                        Edit folder / introduction
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => remove("folder", selectedFolder)}
                        className="text-red-300"
                      >
                        Delete folder
                      </button>
                      {folderIsPrivate(current, folders) && (
                        <span className="text-amber-300">
                          Private folder — all descendants are hidden
                        </span>
                      )}
                    </div>
                  )}
                  <div className="space-y-3">
                    {folders
                      .filter((folder) => (folder.parent || null) === current)
                      .map((folder) => (
                        <div
                          key={folder._id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 p-4"
                        >
                          <button
                            disabled={busy}
                            onClick={() => navigateFolder(folder._id)}
                            className="text-left font-medium"
                          >
                            ▸ {folder.name}
                          </button>
                          <span className="text-xs text-slate-500">
                            Folder · order {folder.order}
                          </span>
                        </div>
                      ))}
                    {notes
                      .filter((note) => (note.folder || null) === current)
                      .map((note) => (
                        <div
                          key={note._id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 p-4"
                        >
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {note.status}
                              {folderIsPrivate(note.folder, folders)
                                ? " · private folder"
                                : ""}{" "}
                              · order {note.order}
                            </p>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <Link
                              to={`/notes/${note._id}`}
                              className="text-slate-400"
                            >
                              Read
                            </Link>
                            <button
                              disabled={busy}
                              onClick={() => editNote(note._id)}
                              className="text-emerald-300"
                            >
                              Edit
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => remove("note", note)}
                              className="text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    {!folders.some(
                      (folder) => (folder.parent || null) === current,
                    ) &&
                      !notes.some(
                        (note) => (note.folder || null) === current,
                      ) && (
                        <p className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
                          This folder is empty. Create a subfolder or import
                          your first note.
                        </p>
                      )}
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminNotes;
