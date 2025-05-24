import dynamic from 'next/dynamic';
const QuestionView = dynamic(() => import('@/components/questions/view'), { ssr: false });
export default function QuestionDetailPage() {
  return <QuestionView />;
}
