import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export const notesHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const notesAdminRequest = async (method, path, data) => {
  const response = await axios({
    method,
    url: `/api/notes/admin${path}`,
    data,
    headers: notesHeaders(),
    timeout: path === "/import" ? 60000 : 15000,
  });
  return response.data;
};
export const refreshNotes = async () => {
  await queryClient.cancelQueries({ queryKey: ["notes"] });
  queryClient.removeQueries({ queryKey: ["notes", "public"] });
  await queryClient.invalidateQueries({ queryKey: ["notes"] });
};
export const clearNotes = () =>
  queryClient.removeQueries({ queryKey: ["notes"] });
export const useNotesData = (path, { admin = false, enabled = true } = {}) =>
  useQuery({
    queryKey: ["notes", admin ? "admin" : "public", path],
    enabled,
    staleTime: admin ? 0 : 5 * 60 * 1000,
    gcTime: admin ? 0 : 30 * 60 * 1000,
    queryFn: async ({ signal }) => {
      const { data } = await axios.get(
        `/api/notes${admin ? "/admin" : ""}${path}`,
        { signal, headers: admin ? notesHeaders() : {}, timeout: 15000 },
      );
      return data;
    },
  });

export const folderPath = (id, folders) => {
  const path = [],
    seen = new Set();
  let current = id;
  while (current && !seen.has(current)) {
    seen.add(current);
    const folder = folders.find((folder) => folder._id === current);
    if (!folder) break;
    path.unshift(folder);
    current = folder.parent;
  }
  return path;
};
export const folderIsPrivate = (id, folders) =>
  folderPath(id, folders).some((folder) => folder.visibility === "private");
