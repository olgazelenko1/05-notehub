import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { fetchNotes, deleteNote } from "../../services/noteService";
import { type NoteResponse } from "../../types/note";

export default function App() {
  const [page, setPage] = useState(1);
  const perPage = 12;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<NoteResponse>({
    queryKey: ["notes", page],
    queryFn: () => fetchNotes(page, perPage),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", page] });
    },
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <h1>NoteHub</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes.</p>}
      {data && data.results.length > 0 && (
        <NoteList notes={data.results} onDelete={handleDeleteNote} />
      )}
      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
