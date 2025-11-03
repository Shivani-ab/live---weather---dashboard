import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Weather Dashboard title', () => {
  render(<App />);
  const titleElement = screen.getByText(/weather dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
