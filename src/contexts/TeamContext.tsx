import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  bio?: string;
  profile_image_url?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    [key: string]: string;
  };
  department?: string;
  hire_date?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  expertise?: string[];
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

interface TeamContextType {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  getActiveTeamMembers: () => TeamMember[];
  getFeaturedTeamMembers: () => TeamMember[];
  refreshTeamMembers: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team members from Supabase on mount
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
      const error = err as { code?: string; message?: string };
      if (error?.code === '42P01' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        setError('Team members table not found. Please run the team-setup.sql script in your Supabase SQL editor to create the required tables.');
      } else {
        setError(error?.message || 'Failed to fetch team members. Please check your Supabase connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          ...memberData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev => [...prev, data]);
    } catch (err) {
      console.error('Error adding team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to add team member');
      throw err;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('team_members')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev =>
        prev.map(member =>
          member.id === id ? { ...member, ...data } : member
        )
      );
    } catch (err) {
      console.error('Error updating team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to update team member');
      throw err;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTeamMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Error deleting team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete team member');
      throw err;
    }
  };

  const getActiveTeamMembers = () => {
    return teamMembers.filter(member => member.is_active);
  };

  const getFeaturedTeamMembers = () => {
    return teamMembers.filter(member => member.is_featured && member.is_active);
  };

  const refreshTeamMembers = async () => {
    await fetchTeamMembers();
  };

return (
    <TeamContext.Provider value={{
      teamMembers,
      loading,
      error,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      getActiveTeamMembers,
      getFeaturedTeamMembers,
      refreshTeamMembers
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};