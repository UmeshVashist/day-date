export interface MaintenanceConfig {
  isMaintenance: boolean // true = maintenance mode ACTIVE (website off for visitors), false = website is LIVE (working for all)
  title: string
  message: string
  estimatedEndTime: string
  contactInfo: string
  allowAdminBypass: boolean
  updatedAt: string
  updatedBy: string
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  isMaintenance: false, // Default is LIVE
  title: "System Maintenance in Progress",
  message: "We are currently upgrading Day & Date System with new features and precision improvements. We will be back online shortly!",
  estimatedEndTime: "30-45 Minutes",
  contactInfo: "support@day-date.com",
  allowAdminBypass: true,
  updatedAt: new Date().toISOString(),
  updatedBy: "Owner",
}

export const ADMIN_DEFAULT_PASSCODE = "Umesh@1212"
export const ADMIN_COOKIE_NAME = "dd_admin_authorized"
export const MAINTENANCE_COOKIE_NAME = "dd_site_maintenance"
