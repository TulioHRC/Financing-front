import styled from "styled-components";

const Row = styled.div<{ $interactive: boolean }>`
  display: inline-flex;
  gap: 2px;
`;

const Star = styled.i<{ $interactive: boolean }>`
  color: #fbbb28;
  font-size: inherit;
  cursor: ${(props) => (props.$interactive ? "pointer" : "default")};

  &:hover {
    transform: ${(props) => (props.$interactive ? "scale(1.15)" : "none")};
  }
`;

const starClassName = (position: number, value: number): string => {
  if (value >= position) return "fas fa-star";
  if (value >= position - 0.5) return "fas fa-star-half-alt";
  return "far fa-star";
};

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, max = 5, onChange }) => {
  const positions = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <Row $interactive={!!onChange}>
      {positions.map((position) => (
        <Star
          key={position}
          className={starClassName(position, value)}
          $interactive={!!onChange}
          onClick={onChange ? () => onChange(position) : undefined}
        />
      ))}
    </Row>
  );
};

export default StarRating;
