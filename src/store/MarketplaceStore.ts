import { makeAutoObservable, runInAction } from 'mobx';
import { Ordinal, Collection, Gallery, MarketplaceStats, PriceData } from '@/types/ordinals';
import {
  mockOrdinals,
  mockCollections,
  mockGalleries,
  mockStats,
  mockPriceData,
} from '@/data/mockData';

export class MarketplaceStore {
  // State
  ordinals: Ordinal[] = [];
  collections: Collection[] = [];
  galleries: Gallery[] = [];
  featuredCollections: Collection[] = [];
  stats: MarketplaceStats | null = null;
  priceData: PriceData | null = null;

  // UI State
  loading = false;
  error: string | null = null;
  selectedOrdinal: Ordinal | null = null;
  searchQuery = '';
  sortBy: 'price' | 'newest' | 'oldest' | 'rarity' = 'newest';
  filterBy: {
    priceRange: [number, number];
    collection: string | null;
    mediaType: string | null;
  } = {
    priceRange: [0, 1000000],
    collection: null,
    mediaType: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  async fetchOrdinals() {
    this.loading = true;
    this.error = null;

    try {
      // Simulate API delay for realistic loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      runInAction(() => {
        this.ordinals = mockOrdinals;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch ordinals';
        this.loading = false;
      });
    }
  }

  async fetchCollections() {
    this.loading = true;

    try {
      // Simulate API delay for realistic loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      runInAction(() => {
        this.collections = mockCollections;
        this.featuredCollections = mockCollections.filter((c: Collection) => c.verified);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch collections';
        this.loading = false;
      });
    }
  }

  async fetchGalleries() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      runInAction(() => {
        this.galleries = mockGalleries;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch galleries';
      });
    }
  }

  async fetchStats() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      runInAction(() => {
        this.stats = mockStats;
      });
    } catch (error) {
      console.error('Failed to fetch marketplace stats:', error);
    }
  }

  async fetchPriceData() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      runInAction(() => {
        this.priceData = mockPriceData;
      });
    } catch (error) {
      console.error('Failed to fetch price data:', error);
    }
  }

  // UI Actions
  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  setSortBy(sortBy: typeof this.sortBy) {
    this.sortBy = sortBy;
  }

  setFilterBy(filter: Partial<typeof this.filterBy>) {
    this.filterBy = { ...this.filterBy, ...filter };
  }

  selectOrdinal(ordinal: Ordinal | null) {
    this.selectedOrdinal = ordinal;
  }

  clearError() {
    this.error = null;
  }

  // Computed values
  get filteredOrdinals() {
    let filtered = this.ordinals;

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ordinal) =>
          ordinal.metaTitle?.toLowerCase().includes(query) ||
          ordinal.inscriptionId.toLowerCase().includes(query) ||
          ordinal.collection?.toLowerCase().includes(query)
      );
    }

    // Collection filter
    if (this.filterBy.collection) {
      filtered = filtered.filter((ordinal) => ordinal.collection === this.filterBy.collection);
    }

    // Media type filter
    if (this.filterBy.mediaType) {
      filtered = filtered.filter((ordinal) => ordinal.mediaType === this.filterBy.mediaType);
    }

    // Price range filter
    filtered = filtered.filter((ordinal) => {
      const price = ordinal.price || 0;
      return price >= this.filterBy.priceRange[0] && price <= this.filterBy.priceRange[1];
    });

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price':
          return (b.price || 0) - (a.price || 0);
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'rarity':
          return a.inscriptionNumber - b.inscriptionNumber;
        default:
          return 0;
      }
    });

    return filtered;
  }

  get listedOrdinals() {
    return this.ordinals.filter((ordinal) => ordinal.listed);
  }

  get totalValue() {
    return this.listedOrdinals.reduce((sum, ordinal) => sum + (ordinal.price || 0), 0);
  }
}
