import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { fetchNotes, deleteNote } from "../../services/noteService";
import { type NoteResponse } from "../../types/note";
import css from "./App.module.css";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const [page, setPage] = useState(1);
  const perPage = 12;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<NoteResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", page, debouncedSearch],
      });
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

      <SearchBox value={search} onChange={setSearch} />

      <button className={css.button} onClick={handleOpenModal}>
        Create note +
      </button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes.</p>}

      {data && data.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
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
