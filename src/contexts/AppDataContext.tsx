
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeedbackType } from '@/pages/Index';

export interface SwiperProfile {
  id: string;
  name: string;
  age: string;
  study: string;
  gender: string;
}

export interface StartupProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  usp: string;
  mission: string;
  vision: string;
  industry: string;
  founded: string;
  employees: string;
  logo: string;
  image: string;
}

export interface FeedbackRequest {
  id: string;
  startupId: string;
  startupName: string;
  swiperId: string;
  swiperName: string;
  feedbackType: string;
  scheduledDate: string;
  scheduledTime: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  teamsLink?: string;
}

export interface SwiperStartupInteraction {
  swiperId: string;
  swiperName: string;
  startupId: string;
  coinAllocation: number;
  feedbackPreference: FeedbackType;
  hasLiked: boolean;
}

interface AppDataContextType {
  swiperProfiles: SwiperProfile[];
  startupProfiles: StartupProfile[];
  feedbackRequests: FeedbackRequest[];
  swiperInteractions: SwiperStartupInteraction[];
  currentSwiperId: string | null;
  currentStartupId: string | null;
  
  addSwiperProfile: (profile: SwiperProfile) => void;
  addStartupProfile: (profile: StartupProfile) => void;
  setCurrentSwiper: (id: string) => void;
  setCurrentStartup: (id: string) => void;
  addSwiperInteraction: (interaction: SwiperStartupInteraction) => void;
  createFeedbackRequest: (request: Omit<FeedbackRequest, 'id'>) => void;
  updateFeedbackRequest: (id: string, updates: Partial<FeedbackRequest>) => void;
  getSwiperInteractionsForStartup: (startupId: string) => SwiperStartupInteraction[];
  getFeedbackRequestsForSwiper: (swiperId: string) => FeedbackRequest[];
  getFeedbackRequestsForStartup: (startupId: string) => FeedbackRequest[];
  getCurrentSwiperProfile: () => SwiperProfile | null;
  getCurrentStartupProfile: () => StartupProfile | null;
  logout: () => void;
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
  const [startupProfiles, setStartupProfiles] = useState<StartupProfile[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [swiperInteractions, setSwiperInteractions] = useState<SwiperStartupInteraction[]>([]);
  const [currentSwiperId, setCurrentSwiperId] = useState<string | null>(null);
  const [currentStartupId, setCurrentStartupId] = useState<string | null>(null);

  const addSwiperProfile = (profile: SwiperProfile) => {
    setSwiperProfiles(prev => [...prev, profile]);
  };

  const addStartupProfile = (profile: StartupProfile) => {
    setStartupProfiles(prev => [...prev, profile]);
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

  const getCurrentSwiperProfile = () => {
    if (!currentSwiperId) return null;
    return swiperProfiles.find(profile => profile.id === currentSwiperId) || null;
  };

  const getCurrentStartupProfile = () => {
    if (!currentStartupId) return null;
    return startupProfiles.find(profile => profile.id === currentStartupId) || null;
  };

  const logout = () => {
    setCurrentSwiperId(null);
    setCurrentStartupId(null);
  };

  return (
    <AppDataContext.Provider value={{
      swiperProfiles,
      startupProfiles,
      feedbackRequests,
      swiperInteractions,
      currentSwiperId,
      currentStartupId,
      addSwiperProfile,
      addStartupProfile,
      setCurrentSwiper,
      setCurrentStartup,
      addSwiperInteraction,
      createFeedbackRequest,
      updateFeedbackRequest,
      getSwiperInteractionsForStartup,
      getFeedbackRequestsForSwiper,
      getFeedbackRequestsForStartup,
      getCurrentSwiperProfile,
      getCurrentStartupProfile,
      logout,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
