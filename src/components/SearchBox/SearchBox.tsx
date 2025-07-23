import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void; // опціонально, щоб обробляти клік по кнопці
}

export default function SearchBox({
  value,
  onChange,
  onSearch,
}: SearchBoxProps) {
  return (
    <div className={css.searchWrapper}>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className={css.button} onClick={onSearch}>
        Search
      </button>
    </div>
  );
}
