import { CVData } from '@/types/cv';

export function PlaceholderPreview({ data }: { data: CVData }) {
  return (
    <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-300">
      <p className="text-gray-600">Template preview: {data.personal.firstName} {data.personal.lastName}</p>
    </div>
  );
}

export function PlaceholderPDF({ data }: { data: CVData }) {
  return null;
}
