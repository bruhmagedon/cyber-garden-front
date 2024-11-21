import { Container } from './Container';

interface EventCardProps {
   className?: string;
}

export const EventCard = ({ className }: EventCardProps) => {
   return <>{localStorage.getItem('token') && <div>card</div>}</>;
};
