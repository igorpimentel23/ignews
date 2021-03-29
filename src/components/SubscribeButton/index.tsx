import { Session } from 'next-auth';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import api from '../../services/api';
import getStripejs from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

interface SessionProps extends Session {
  activeSubscription: unknown;
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession() as [SessionProps | null | undefined, boolean];
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (session?.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripejs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
