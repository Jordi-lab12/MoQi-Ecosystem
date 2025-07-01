
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Startup, FeedbackType } from '@/pages/Index';

export interface SwiperProfile {
  id: string;
  name: string;
  age: string;
  study: string;
  gender: string;
}

export interface FeedbackRequest {
  id: string;
  startupId: string;
  startupName: string;
  swiperId: string;
  feedbackType: string;
  scheduledDate: string;
  scheduledTime: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  teamsLink?: string;
}

export interface SwiperStartupInteraction {
  swiperId: string;
  startupId: string;
  coinAllocation: number;
  feedbackPreference: FeedbackType;
  hasLiked: boolean;
}

interface AppDataContextType {
  swiperProfiles: SwiperProfile[];
  feedbackRequests: FeedbackRequest[];
  swiperInteractions: SwiperStartupInteraction[];
  currentSwiperId: string | null;
  currentStartupId: string | null;
  
  addSwiperProfile: (profile: SwiperProfile) => void;
  setCurrentSwiper: (id: string) => void;
  setCurrentStartup: (id: string) => void;
  addSwiperInteraction: (interaction: SwiperStartupInteraction) => void;
  createFeedbackRequest: (request: Omit<FeedbackRequest, 'id'>) => void;
  updateFeedbackRequest: (id: string, updates: Partial<FeedbackRequest>) => void;
  getSwiperInteractionsForStartup: (startupId: string) => SwiperStartupInteraction[];
  getFeedbackRequestsForSwiper: (swiperId: string) => FeedbackRequest[];
  getFeedbackRequestsForStartup: (startupId: string) => FeedbackRequest[];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [swiperProfiles, setSwiperProfiles] = useState<SwiperProfile[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [swiperInteractions, setSwiperInteractions] = useState<SwiperStartupInteraction[]>([]);
  const [currentSwiperId, setCurrentSwiperId] = useState<string | null>(null);
  const [currentStartupId, setCurrentStartupId] = useState<string | null>(null);

  const addSwiperProfile = (profile: SwiperProfile) => {
    setSwiperProfiles(prev => [...prev, profile]);
  };

  const setCurrentSwiper = (id: string) => {
    setCurrentSwiperId(id);
  };

  const setCurrentStartup = (id: string) => {
    setCurrentStartupId(id);
  };

  const addSwiperInteraction = (interaction: SwiperStartupInteraction) => {
    setSwiperInteractions(prev => {
      const existing = prev.find(i => i.swiperId === interaction.swiperId && i.startupId === interaction.startupId);
      if (existing) {
        return prev.map(i => 
          i.swiperId === interaction.swiperId && i.startupId === interaction.startupId 
            ? { ...i, ...interaction }
            : i
        );
      }
      return [...prev, interaction];
    });
  };

  const createFeedbackRequest = (request: Omit<FeedbackRequest, 'id'>) => {
    const newRequest: FeedbackRequest = {
      ...request,
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setFeedbackRequests(prev => [...prev, newRequest]);
  };

  const updateFeedbackRequest = (id: string, updates: Partial<FeedbackRequest>) => {
    setFeedbackRequests(prev => 
      prev.map(req => req.id === id ? { ...req, ...updates } : req)
    );
  };

  const getSwiperInteractionsForStartup = (startupId: string) => {
    return swiperInteractions.filter(interaction => interaction.startupId === startupId);
  };

  const getFeedbackRequestsForSwiper = (swiperId: string) => {
    return feedbackRequests.filter(req => req.swiperId === swiperId);
  };

  const getFeedbackRequestsForStartup = (startupId: string) => {
    return feedbackRequests.filter(req => req.startupId === startupId);
  };

  return (
    <AppDataContext.Provider value={{
      swiperProfiles,
      feedbackRequests,
      swiperInteractions,
      currentSwiperId,
      currentStartupId,
      addSwiperProfile,
      setCurrentSwiper,
      setCurrentStartup,
      addSwiperInteraction,
      createFeedbackRequest,
      updateFeedbackRequest,
      getSwiperInteractionsForStartup,
      getFeedbackRequestsForSwiper,
      getFeedbackRequestsForStartup,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
