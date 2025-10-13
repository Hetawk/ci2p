/**
 * Automatic ORCID Sync Service
 * Automatically syncs ORCID publications in the background
 */

import { syncUserOrcidPublications } from "./orcid-sync";
import { prisma } from "./prisma";

/**
 * Check if a user needs ORCID sync (hasn't been synced in 24 hours)
 */
export async function shouldSyncUser(userId: string): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      orcidEnabled: true,
      orcidId: true,
      orcidSyncedAt: true,
    },
  });

  if (!profile?.orcidEnabled || !profile.orcidId) {
    return false;
  }

  // Sync if never synced or last sync was more than 24 hours ago
  if (!profile.orcidSyncedAt) {
    return true;
  }

  const hoursSinceSync =
    (Date.now() - profile.orcidSyncedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceSync >= 24;
}

/**
 * Automatically sync a user's ORCID publications if needed
 * This is non-blocking and safe to call on page loads
 */
export async function autoSyncUserIfNeeded(userId: string): Promise<void> {
  try {
    const needsSync = await shouldSyncUser(userId);

    if (needsSync) {
      // Run sync in background without blocking
      syncUserOrcidPublications(userId).catch((error) => {
        console.error(
          `Background ORCID sync failed for user ${userId}:`,
          error
        );
      });
    }
  } catch (error) {
    console.error("Error checking if user needs ORCID sync:", error);
  }
}

/**
 * Sync all users who need syncing (for cron jobs)
 */
export async function autoSyncAllUsersIfNeeded(): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where: {
        profile: {
          orcidEnabled: true,
          orcidId: { not: null },
        },
      },
      select: { id: true },
    });

    for (const user of users) {
      const needsSync = await shouldSyncUser(user.id);
      if (needsSync) {
        // Sync in background
        syncUserOrcidPublications(user.id).catch((error) => {
          console.error(
            `Background ORCID sync failed for user ${user.id}:`,
            error
          );
        });
      }
    }
  } catch (error) {
    console.error("Error in auto sync all users:", error);
  }
}
