import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GrammarRectifier from './GrammarRectifier';
import { checkGrammar } from '../utils/api';

jest.mock('../utils/api', () => ({
  checkGrammar: jest.fn(),
}));

describe('GrammarRectifier Component', () => {
  it('displays grammar errors from the API', async () => {
    checkGrammar.mockResolvedValue([
      {
        message: 'Grammar error here.',
        bad: 'an error',
        suggestions: ['a correction'],
        offset: 10,
        length: 8,
      },
    ]);

    render(<GrammarRectifier />);

    const textarea = screen.getByPlaceholderText('Start typing...');
    userEvent.type(textarea, 'This is an error.');

    await waitFor(() => {
      expect(checkGrammar).toHaveBeenCalledWith('This is an error.');
    });

    const highlightedText = screen.getByText('an error');
    expect(highlightedText).toHaveClass('grammar-error');
  });
});