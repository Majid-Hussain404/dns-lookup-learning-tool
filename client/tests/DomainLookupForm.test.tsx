import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DomainLookupForm } from '../src/components/DomainLookupForm';

describe('DomainLookupForm Component', () => {
  it('renders input field, record type buttons, and presets', () => {
    const handleLookup = vi.fn();
    render(<DomainLookupForm onLookup={handleLookup} isLoading={false} />);

    expect(screen.getByPlaceholderText(/e\.g\. example\.com/i)).toBeInTheDocument();
    expect(screen.getByText('Resolve Record')).toBeInTheDocument();
    expect(screen.getByText('AAAA')).toBeInTheDocument();
    expect(screen.getByText('MX')).toBeInTheDocument();
  });

  it('validates empty domain input and shows error message', () => {
    const handleLookup = vi.fn();
    render(<DomainLookupForm onLookup={handleLookup} isLoading={false} />);

    const submitBtn = screen.getByText('Resolve Record');
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter a domain name to lookup/i)).toBeInTheDocument();
    expect(handleLookup).not.toHaveBeenCalled();
  });

  it('calls onLookup when a valid domain is entered and form is submitted', () => {
    const handleLookup = vi.fn();
    render(<DomainLookupForm onLookup={handleLookup} isLoading={false} />);

    const input = screen.getByPlaceholderText(/e\.g\. example\.com/i);
    fireEvent.change(input, { target: { value: 'wikipedia.org' } });

    // Select MX record type
    const mxBtn = screen.getByText('MX');
    fireEvent.click(mxBtn);

    const submitBtn = screen.getByText('Resolve Record');
    fireEvent.click(submitBtn);

    expect(handleLookup).toHaveBeenCalledWith('wikipedia.org', 'MX');
  });

  it('clicking a preset suggestion chip triggers lookup immediately', () => {
    const handleLookup = vi.fn();
    render(<DomainLookupForm onLookup={handleLookup} isLoading={false} />);

    const googleChip = screen.getByText('google.com');
    fireEvent.click(googleChip);

    expect(handleLookup).toHaveBeenCalledWith('google.com', 'A');
  });
});
