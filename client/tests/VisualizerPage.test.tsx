import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VisualizerPage } from '../src/pages/VisualizerPage';

describe('VisualizerPage Component', () => {
  it('renders visualizer title, disclaimer, and initial step', () => {
    render(<VisualizerPage />);

    expect(screen.getByText('DNS Resolution Visualizer')).toBeInTheDocument();
    expect(screen.getByText(/Conceptual Educational Model Notice/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 8/i)).toBeInTheDocument();
  });

  it('navigates to next and previous steps when control buttons are clicked', () => {
    render(<VisualizerPage />);

    const nextBtn = screen.getByTitle('Next Step');
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Step 2 of 8/i)).toBeInTheDocument();

    const prevBtn = screen.getByTitle('Previous Step');
    fireEvent.click(prevBtn);

    expect(screen.getByText(/Step 1 of 8/i)).toBeInTheDocument();
  });

  it('switches to Cache Hit scenario when tab is selected', () => {
    render(<VisualizerPage />);

    const cacheHitBtn = screen.getByText(/Scenario B: Cache Hit/i);
    fireEvent.click(cacheHitBtn);

    expect(screen.getByText(/Step 1 of 3/i)).toBeInTheDocument();
  });
});
