import { render, screen } from '@testing-library/react';
import App from './App';

test('renders WeatherScope header', () => {
  render(<App />);
  const headerElement = screen.getByText(/WeatherScope/i);
  expect(headerElement).toBeInTheDocument();
});
