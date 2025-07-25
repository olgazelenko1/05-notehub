import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { fetchNotes } from "../../services/noteService";
import { type NoteResponse } from "../../types/api";
import css from "./App.module.css";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const [page, setPage] = useState(1);
  const perPage = 12;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<NoteResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.wrapper}>
      <h1>NoteHub</h1>

      <div className={css.header}>
        <SearchBox value={search} onChange={handleSearchChange} />
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {isLoading && <p className={css.centered}>Loading...</p>}
      {isError && <p className={css.centered}>Error loading notes.</p>}

      {data && data.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {data && data.totalPages > 1 && (
        <div className={css.centered}>
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
