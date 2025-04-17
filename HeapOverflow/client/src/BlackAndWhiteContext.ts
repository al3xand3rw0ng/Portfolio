import { createContext } from 'react';

/**
 * Interface representing the context type for black and white mode management.
 *
 * - isBlackAndWhite: A boolean value that indicates whether the application is in black and white mode.
 * - handleToggleBlackAndWhite: A function that toggles the black and white mode of the application.
 */
interface BlackAndWhiteContextType {
  isBlackAndWhite: boolean;
  handleToggleBlackAndWhite: () => void;
  resetBlackAndWhite: () => void;
  setBlackAndWhite: (isBlackAndWhite: boolean) => void;
}

const BlackAndWhiteContext = createContext<BlackAndWhiteContextType | null>(null);

export default BlackAndWhiteContext;
