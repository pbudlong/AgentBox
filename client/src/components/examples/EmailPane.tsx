import EmailPane from '../EmailPane';
import type { EmailMessage } from '@shared/schema';

const mockMessages: EmailMessage[] = [
  {
    id: '1',
    from: 'pete.b.seller@agentbox.ai',
    to: 'aria.h.buyer@agentbox.ai',
    subject: 'Introduction - Sales Platform',
    body: 'Hi Aria, I noticed your company is in the SaaS space. We help teams like yours close deals faster with our sales platform. Would love to chat if it makes sense.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    threadId: 'thread-1',
  },
  {
    id: '2',
    from: 'aria.h.buyer@agentbox.ai',
    to: 'pete.b.seller@agentbox.ai',
    subject: 'Re: Introduction - Sales Platform',
    body: 'Thanks for reaching out. To confirm fit, could you share your current integration capabilities and a rough pricing range?',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    threadId: 'thread-1',
  },
];

export default function EmailPaneExample() {
  return (
    <div className="h-[600px]">
      <EmailPane
        title="Seller Agent"
        email="pete.b.seller@agentbox.ai"
        messages={mockMessages}
        status="thinking"
      />
    </div>
  );
}
