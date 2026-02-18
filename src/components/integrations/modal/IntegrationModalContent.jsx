import React from 'react';
import GoogleCalendarConfig from '../GoogleCalendarConfig';
import YouTubeConfig from '../YouTubeConfig';
import GoogleDriveConfig from '../GoogleDriveConfig';
import GoogleSheetsConfig from '../GoogleSheetsConfig';
import GoogleDocsConfig from '../GoogleDocsConfig';
import GoogleSlidesConfig from '../GoogleSlidesConfig';
import LinkedInConfig from '../LinkedInConfig';
import TikTokConfig from '../TikTokConfig';
import SlackConfig from '../SlackConfig';
import HubSpotConfig from '../HubSpotConfig';

const configMap = {
  googlecalendar: GoogleCalendarConfig,
  youtube: YouTubeConfig,
  googledrive: GoogleDriveConfig,
  googlesheets: GoogleSheetsConfig,
  googledocs: GoogleDocsConfig,
  googleslides: GoogleSlidesConfig,
  linkedin: LinkedInConfig,
  tiktok: TikTokConfig,
  slack: SlackConfig,
  hubspot: HubSpotConfig,
};

export default function IntegrationModalContent({ integration, isConnected }) {
  if (!isConnected) return null;
  
  const ConfigComponent = configMap[integration.type];
  return ConfigComponent ? <ConfigComponent /> : null;
}