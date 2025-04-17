import { ChangeEvent, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage the state and logic for a header search input.
 * It handles input changes and triggers a search action on 'Enter' key press.
 *
 * @returns val - the current value of the input.
 * @returns setVal - function to update the value of the input.
 * @returns handleInputChange - function to handle changes in the input field.
 * @returns handleKeyDown - function to handle 'Enter' key press and trigger the search.
 * @returns handleSearchKeyDown - function to handle 'Enter' key press and trigger the search.
 * @returns isPromptOpen - the state of the prompt.
 * @returns setIsPromptOpen - function to set the state of the prompt.
 */
const useHeader = () => {
  const navigate = useNavigate();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const { user } = useUserContext();
  const [val, setVal] = useState<string>('');

  /**
   * Function to handle changes in the input field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  /**
   * Function to handle 'Enter' key press and trigger the search.
   *
   * @param e - the event object.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const searchParams = new URLSearchParams();
      searchParams.set('search', e.currentTarget.value);

      navigate(`/home?${searchParams.toString()}`);
    }
  };

  /**
   * Function to handle 'Enter' key press and trigger the search.
   * @param e - the event object.
   */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (user?.username === 'Guest') {
        setIsPromptOpen(true);
        return;
      }
      handleKeyDown(e); // Proceed with search if not a guest
    }
  };

  return {
    val,
    setVal,
    handleInputChange,
    handleKeyDown,
    handleSearchKeyDown,
    isPromptOpen,
    setIsPromptOpen,
  };
};

export default useHeader;
