import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
}

export default function SearchBox({
  onChange,
  value,
  placeholder,
}: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="search"
      className={css.searchInput}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}
