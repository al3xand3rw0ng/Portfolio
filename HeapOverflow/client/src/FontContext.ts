import { createContext } from 'react';

/**
 * Interface representing the context type for font size management.
 *
 * - fontSize: A string value that represents the current font size of the application.
 * - handleToggleFont: A function that toggles the font size of the application.
 */
interface FontContextType {
  fontSize: string;
  handleToggleFont: () => void;
  resetFont: () => void;
  setFontSize: (size: string) => void;
}

const FontContext = createContext<FontContextType | null>(null);

export default FontContext;
