import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import CodeBlock from "../CodeBlock";
import { notesHeaders } from "../../lib/notesApi";
import "katex/dist/katex.min.css";

const NoteImage = ({ src, alt, admin }) => {
  const [result, setResult] = useState(null);
  const protectedAsset = /^\/api\/notes\/assets\/[a-f0-9]{24}\/\d+$/.test(
    src || "",
  );
  const requestPath =
    protectedAsset && admin
      ? src.replace("/api/notes/assets/", "/api/notes/admin/assets/")
      : src;
  useEffect(() => {
    if (!protectedAsset) return;
    const controller = new AbortController();
    let objectUrl;
    axios
      .get(requestPath, {
        signal: controller.signal,
        headers: admin ? notesHeaders() : {},
        responseType: "blob",
        timeout: 15000,
      })
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(data);
        setResult({ path: requestPath, url: objectUrl });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ path: requestPath, error: true });
      });
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [requestPath, protectedAsset, admin]);
  if (!protectedAsset)
    return (
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  if (result?.path !== requestPath)
    return (
      <span className="block p-4 text-sm text-slate-500">Loading image…</span>
    );
  if (result.error)
    return (
      <span className="block p-4 text-sm text-slate-500">
        Image unavailable: {alt}
      </span>
    );
  return <img src={result.url} alt={alt || ""} />;
};
const NoteMarkdown = ({ content = "", admin = false }) => (
  <div data-note-content className="prose prose-invert prose-emerald max-w-none prose-headings:scroll-mt-28 prose-img:rounded-lg break-words [&_.katex-display]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeSlug]}
      components={{
        code: CodeBlock,
        pre: ({ children }) => <div className="not-prose my-5 min-w-0 overflow-x-auto rounded-xl bg-slate-900 [&>code]:block [&>code]:whitespace-pre [&>code]:p-3.5" tabIndex={0} aria-label="Code block">{children}</div>,
        img: ({ src, alt }) => <NoteImage src={src} alt={alt} admin={admin} />,
        a: ({ href, children }) => (
          <a href={href} rel="noopener noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
export default NoteMarkdown;
