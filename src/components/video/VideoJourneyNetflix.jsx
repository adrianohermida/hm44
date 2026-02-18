import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import VideoPlayer from './VideoPlayer';
import VideoThumbnailSidebar from './VideoThumbnailSidebar';
import VideoCarouselMobile from './VideoCarouselMobile';
import VideoProgress from './VideoProgress';
import VideoCompletionModal from './VideoCompletionModal';

export default function VideoJourneyNetflix({ episodes }) {
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('video_progress');
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedEpisodes(progress.completed || []);
      setCurrentEpisode(progress.current || 0);
    }
  }, []);

  const handleEpisodeComplete = () => {
    const newCompleted = [...completedEpisodes, currentEpisode];
    setCompletedEpisodes(newCompleted);
    
    localStorage.setItem('video_progress', JSON.stringify({
      completed: newCompleted,
      current: currentEpisode + 1
    }));

    if (currentEpisode === episodes.length - 1) {
      setShowModal(true);
    } else {
      setCurrentEpisode(prev => prev + 1);
    }
  };

  return (
    <>
      <VideoProgress current={completedEpisodes.length} total={episodes.length} />
      
      <div className="flex gap-6">
        <div className="flex-1">
          <VideoCarouselMobile episodes={episodes} currentEpisode={currentEpisode} completedEpisodes={completedEpisodes} onSelectEpisode={setCurrentEpisode} />
          <VideoPlayer videoUrl={episodes[currentEpisode].url} onComplete={handleEpisodeComplete} />
        </div>
        <VideoThumbnailSidebar episodes={episodes} currentEpisode={currentEpisode} completedEpisodes={completedEpisodes} onSelectEpisode={setCurrentEpisode} />
      </div>

      <VideoCompletionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onSchedule={() => window.open('https://wa.me/5551996032004?text=Completei a jornada educacional e quero agendar uma consulta!', '_blank')}
        onSubmitCase={() => navigate(createPageUrl('Dashboard'))}
      />
    </>
  );
}