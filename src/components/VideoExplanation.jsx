import React from 'react';
import { useTranslation } from 'react-i18next';

export default function VideoExplanation() {
  const { t } = useTranslation();

  const videoUrl = "https://www.youtube.com/embed/0OIG5oykHx4";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('video_explanation_title')}
        </h2>
      </div>

      <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 lg:p-8 mb-8">
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe 
            src={videoUrl} 
            title="Educational Video"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-md"
          ></iframe>
        </div>
      </div>

      <div className="text-center">
        <p className="text-blue-200 max-w-2xl mx-auto">
        باش تموقليهم راه هاد الفيديو مصايب ب notebooklm ماشي ريان ليصايبو ولكن ريان صايبو غير بprompt
        </p>
      </div>
    </div>
  );
}