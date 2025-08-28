import { useLocalStorage } from 'usehooks-ts';

export default function DarkModeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));

  return (
    <input
      type="checkbox"
      checked={theme === 'dark'}
      onChange={toggleTheme}
      className="toggle border-white text-white checked:border-indigo-900 checked:bg-indigo-900 checked:text-white"
    />
  );
}
