import FitScoreIndicator from '../FitScoreIndicator';

const mockSignals = [
  { name: 'Industry Match', matched: true, value: 'SaaS' },
  { name: 'Company Size', matched: true, value: '50-200' },
  { name: 'Geographic Match', matched: true, value: 'North America' },
  { name: 'Budget Range', matched: false },
  { name: 'Timing', matched: true, value: 'Q1 2025' },
  { name: 'Tech Stack', matched: false },
];

export default function FitScoreIndicatorExample() {
  return (
    <div className="max-w-md p-8">
      <FitScoreIndicator
        score={72}
        signals={mockSignals}
        threshold={70}
      />
    </div>
  );
}
