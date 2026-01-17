import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface UserCoins {
  userId: string;
  balance: number;
  totalEarned: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastContributionDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'award' | 'crown' | 'medal' | 'zap' | 'heart' | 'target' | 'flame';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: 'contributions' | 'streak' | 'milestone' | 'community' | 'special';
  requirement: number; // e.g., 5 contributions, 10000 naira total, etc.
  requirementType: 'contribution_count' | 'total_amount' | 'streak_days' | 'level' | 'special';
}

export interface UserAchievement {
  id: string;
  odotUserId: string;
  achievementId: string;
  unlockedAt: Date;
  notified: boolean;
}

// ============================================
// ACHIEVEMENT DEFINITIONS
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  // Contribution Count Achievements
  {
    id: 'first_contribution',
    title: 'First Steps',
    description: 'Made your first contribution',
    icon: 'star',
    rarity: 'common',
    points: 50,
    category: 'contributions',
    requirement: 1,
    requirementType: 'contribution_count'
  },
  {
    id: 'five_contributions',
    title: 'Getting Started',
    description: 'Made 5 contributions',
    icon: 'award',
    rarity: 'common',
    points: 100,
    category: 'contributions',
    requirement: 5,
    requirementType: 'contribution_count'
  },
  {
    id: 'ten_contributions',
    title: 'Dedicated Partner',
    description: 'Made 10 contributions',
    icon: 'medal',
    rarity: 'rare',
    points: 200,
    category: 'contributions',
    requirement: 10,
    requirementType: 'contribution_count'
  },
  {
    id: 'twenty_five_contributions',
    title: 'Impact Champion',
    description: 'Made 25 contributions',
    icon: 'trophy',
    rarity: 'epic',
    points: 500,
    category: 'contributions',
    requirement: 25,
    requirementType: 'contribution_count'
  },
  {
    id: 'fifty_contributions',
    title: 'Legendary Giver',
    description: 'Made 50 contributions',
    icon: 'crown',
    rarity: 'legendary',
    points: 1000,
    category: 'contributions',
    requirement: 50,
    requirementType: 'contribution_count'
  },

  // Total Amount Achievements (in Naira)
  {
    id: 'total_10k',
    title: 'Rising Star',
    description: 'Contributed ₦10,000 total',
    icon: 'star',
    rarity: 'common',
    points: 100,
    category: 'milestone',
    requirement: 10000,
    requirementType: 'total_amount'
  },
  {
    id: 'total_50k',
    title: 'Impact Maker',
    description: 'Contributed ₦50,000 total',
    icon: 'target',
    rarity: 'rare',
    points: 300,
    category: 'milestone',
    requirement: 50000,
    requirementType: 'total_amount'
  },
  {
    id: 'total_100k',
    title: 'Philanthropist',
    description: 'Contributed ₦100,000 total',
    icon: 'heart',
    rarity: 'epic',
    points: 600,
    category: 'milestone',
    requirement: 100000,
    requirementType: 'total_amount'
  },
  {
    id: 'total_500k',
    title: 'Legacy Builder',
    description: 'Contributed ₦500,000 total',
    icon: 'crown',
    rarity: 'legendary',
    points: 1500,
    category: 'milestone',
    requirement: 500000,
    requirementType: 'total_amount'
  },

  // Streak Achievements
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Maintained a 3-month contribution streak',
    icon: 'flame',
    rarity: 'common',
    points: 75,
    category: 'streak',
    requirement: 3,
    requirementType: 'streak_days'
  },
  {
    id: 'streak_6',
    title: 'Consistency King',
    description: 'Maintained a 6-month contribution streak',
    icon: 'flame',
    rarity: 'rare',
    points: 200,
    category: 'streak',
    requirement: 6,
    requirementType: 'streak_days'
  },
  {
    id: 'streak_12',
    title: 'Year of Impact',
    description: 'Maintained a 12-month contribution streak',
    icon: 'zap',
    rarity: 'legendary',
    points: 500,
    category: 'streak',
    requirement: 12,
    requirementType: 'streak_days'
  },

  // Level Achievements
  {
    id: 'level_5',
    title: 'Rising Partner',
    description: 'Reached Level 5',
    icon: 'medal',
    rarity: 'common',
    points: 150,
    category: 'milestone',
    requirement: 5,
    requirementType: 'level'
  },
  {
    id: 'level_10',
    title: 'Veteran Partner',
    description: 'Reached Level 10',
    icon: 'trophy',
    rarity: 'rare',
    points: 400,
    category: 'milestone',
    requirement: 10,
    requirementType: 'level'
  },
  {
    id: 'level_25',
    title: 'Elite Partner',
    description: 'Reached Level 25',
    icon: 'crown',
    rarity: 'legendary',
    points: 1000,
    category: 'milestone',
    requirement: 25,
    requirementType: 'level'
  }
];

// ============================================
// LEVELING SYSTEM
// ============================================

/**
 * Calculate XP required for a specific level
 * Uses a curve: Level 1 = 100 XP, each level requires 1.5x more
 */
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Calculate total XP required to reach a level
 */
export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

/**
 * Calculate level from total XP
 */
export function getLevelFromXP(totalXP: number): { level: number; currentXP: number; xpToNext: number } {
  let level = 1;
  let remainingXP = totalXP;
  
  while (remainingXP >= getXPForLevel(level)) {
    remainingXP -= getXPForLevel(level);
    level++;
  }
  
  return {
    level,
    currentXP: remainingXP,
    xpToNext: getXPForLevel(level)
  };
}

/**
 * Calculate coins earned from a contribution
 * Base: 1 coin per ₦100, with bonuses
 */
export function calculateCoinsFromContribution(amount: number, streak: number = 0): number {
  const baseCoins = Math.floor(amount / 100);
  const streakBonus = Math.floor(baseCoins * (streak * 0.05)); // 5% bonus per streak month
  return baseCoins + streakBonus;
}

/**
 * Calculate XP earned from a contribution
 */
export function calculateXPFromContribution(amount: number, streak: number = 0): number {
  const baseXP = Math.floor(amount / 50); // 1 XP per ₦50
  const streakBonus = Math.floor(baseXP * (streak * 0.1)); // 10% bonus per streak month
  return baseXP + streakBonus;
}

// ============================================
// FIRESTORE OPERATIONS
// ============================================

/**
 * Initialize or get user coins document
 */
export async function initializeUserCoins(userId: string): Promise<UserCoins> {
  const userCoinsRef = doc(db, 'userCoins', userId);
  const docSnap = await getDoc(userCoinsRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      userId,
      balance: data.balance || 0,
      totalEarned: data.totalEarned || 0,
      level: data.level || 1,
      xp: data.xp || 0,
      xpToNextLevel: data.xpToNextLevel || 100,
      streak: data.streak || 0,
      lastContributionDate: data.lastContributionDate?.toDate() || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }
  
  // Create new document
  const newUserCoins: Omit<UserCoins, 'lastContributionDate' | 'createdAt' | 'updatedAt'> & {
    lastContributionDate: null;
    createdAt: ReturnType<typeof Timestamp.now>;
    updatedAt: ReturnType<typeof Timestamp.now>;
  } = {
    userId,
    balance: 0,
    totalEarned: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    lastContributionDate: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  await setDoc(userCoinsRef, newUserCoins);
  
  return {
    ...newUserCoins,
    lastContributionDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Subscribe to user coins (real-time)
 */
export function subscribeToUserCoins(
  userId: string,
  callback: (userCoins: UserCoins | null) => void
): () => void {
  const userCoinsRef = doc(db, 'userCoins', userId);
  
  return onSnapshot(userCoinsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        userId,
        balance: data.balance || 0,
        totalEarned: data.totalEarned || 0,
        level: data.level || 1,
        xp: data.xp || 0,
        xpToNextLevel: data.xpToNextLevel || 100,
        streak: data.streak || 0,
        lastContributionDate: data.lastContributionDate?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Award coins and XP to a user (called when contribution is approved)
 */
export async function awardCoinsAndXP(
  userId: string,
  contributionAmount: number
): Promise<{ coinsEarned: number; xpEarned: number; newLevel: number | null; newAchievements: Achievement[] }> {
  const userCoins = await initializeUserCoins(userId);
  
  const coinsEarned = calculateCoinsFromContribution(contributionAmount, userCoins.streak);
  const xpEarned = calculateXPFromContribution(contributionAmount, userCoins.streak);
  
  const newTotalXP = userCoins.xp + xpEarned;
  const levelInfo = getLevelFromXP(userCoins.totalEarned + coinsEarned); // Use total earned for level calc
  
  const userCoinsRef = doc(db, 'userCoins', userId);
  
  // Check if this is a new month contribution for streak
  const now = new Date();
  let newStreak = userCoins.streak;
  
  if (userCoins.lastContributionDate) {
    const lastDate = userCoins.lastContributionDate;
    const monthDiff = (now.getFullYear() - lastDate.getFullYear()) * 12 + (now.getMonth() - lastDate.getMonth());
    
    if (monthDiff === 1) {
      // Consecutive month - increase streak
      newStreak = userCoins.streak + 1;
    } else if (monthDiff > 1) {
      // Missed a month - reset streak
      newStreak = 1;
    }
    // Same month - keep streak
  } else {
    newStreak = 1; // First contribution
  }
  
  const newLevel = levelInfo.level > userCoins.level ? levelInfo.level : null;
  
  await updateDoc(userCoinsRef, {
    balance: increment(coinsEarned),
    totalEarned: increment(coinsEarned),
    xp: newTotalXP,
    level: levelInfo.level,
    xpToNextLevel: levelInfo.xpToNext,
    streak: newStreak,
    lastContributionDate: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  // Check for new achievements
  const newAchievements = await checkAndAwardAchievements(userId);
  
  return {
    coinsEarned,
    xpEarned,
    newLevel,
    newAchievements
  };
}

/**
 * Get user's unlocked achievements
 */
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const achievementsQuery = query(
    collection(db, 'userAchievements'),
    where('userId', '==', userId),
    orderBy('unlockedAt', 'desc')
  );
  
  const snapshot = await getDocs(achievementsQuery);
  const achievements: UserAchievement[] = [];
  
  snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
    const data = docSnap.data();
    achievements.push({
      id: docSnap.id,
      odotUserId: data.userId,
      achievementId: data.achievementId,
      unlockedAt: data.unlockedAt?.toDate() || new Date(),
      notified: data.notified || false
    });
  });
  
  return achievements;
}

/**
 * Check and award any new achievements the user qualifies for
 */
export async function checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
  const userCoins = await initializeUserCoins(userId);
  const existingAchievements = await getUserAchievements(userId);
  const existingIds = new Set(existingAchievements.map(a => a.achievementId));
  
  // Get user's contribution stats
  const paymentsQuery = query(
    collection(db, 'payments'),
    where('userId', '==', userId),
    where('status', '==', 'approved')
  );
  const paymentsSnapshot = await getDocs(paymentsQuery);
  
  let contributionCount = 0;
  let totalAmount = 0;
  
  paymentsSnapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
    const data = docSnap.data();
    contributionCount++;
    totalAmount += data.amount || 0;
  });
  
  const newAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (existingIds.has(achievement.id)) continue;
    
    let qualifies = false;
    
    switch (achievement.requirementType) {
      case 'contribution_count':
        qualifies = contributionCount >= achievement.requirement;
        break;
      case 'total_amount':
        qualifies = totalAmount >= achievement.requirement;
        break;
      case 'streak_days':
        qualifies = userCoins.streak >= achievement.requirement;
        break;
      case 'level':
        qualifies = userCoins.level >= achievement.requirement;
        break;
    }
    
    if (qualifies) {
      // Award achievement
      const userAchievementRef = doc(collection(db, 'userAchievements'));
      await setDoc(userAchievementRef, {
        odotUserId: userId,
        achievementId: achievement.id,
        unlockedAt: Timestamp.now(),
        notified: false
      });
      
      // Award bonus coins for achievement
      const userCoinsRef = doc(db, 'userCoins', userId);
      await updateDoc(userCoinsRef, {
        balance: increment(achievement.points),
        totalEarned: increment(achievement.points)
      });
      
      newAchievements.push(achievement);
    }
  }
  
  return newAchievements;
}

/**
 * Get achievement details by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get all achievements with user progress
 */
export async function getAllAchievementsWithProgress(userId: string): Promise<(Achievement & { unlocked: boolean; unlockedAt?: Date })[]> {
  const userAchievements = await getUserAchievements(userId);
  const unlockedMap = new Map(userAchievements.map(ua => [ua.achievementId, ua.unlockedAt]));
  
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    unlocked: unlockedMap.has(achievement.id),
    unlockedAt: unlockedMap.get(achievement.id)
  }));
}

/**
 * Subscribe to user achievements (real-time)
 */
export function subscribeToUserAchievements(
  userId: string,
  callback: (achievements: UserAchievement[]) => void
): () => void {
  const achievementsQuery = query(
    collection(db, 'userAchievements'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(achievementsQuery, (snapshot) => {
    const achievements: UserAchievement[] = [];
    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnap.data();
      achievements.push({
        id: docSnap.id,
        odotUserId: data.userId,
        achievementId: data.achievementId,
        unlockedAt: data.unlockedAt?.toDate() || new Date(),
        notified: data.notified || false
      });
    });
    callback(achievements);
  });
}
