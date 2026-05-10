import { makeAutoObservable, runInAction } from 'mobx';
import {
  PhysicalArtwork,
  PhysicalArtist,
  PhysicalCollection,
  ArtworkInquiry,
  PhysicalMarketplaceStats,
  AvailabilityStatus,
} from '@/types/physicalArt';
import {
  mockArtworks,
  mockArtists,
  mockPhysicalCollections,
  mockPhysicalStats,
} from '@/data/physicalMockData';

export interface ArtworkFilters {
  medium: string[];
  availability: AvailabilityStatus | 'all';
  artistId: string | 'all';
  priceMin: number | null;
  priceMax: number | null;
}

export class PhysicalMarketplaceStore {
  artworks: PhysicalArtwork[] = [];
  artists: PhysicalArtist[] = [];
  collections: PhysicalCollection[] = [];
  stats: PhysicalMarketplaceStats | null = null;

  filters: ArtworkFilters = {
    medium: [],
    availability: 'all',
    artistId: 'all',
    priceMin: null,
    priceMax: null,
  };

  selectedArtworkId: string | null = null;
  selectedArtistId: string | null = null;
  inquirySubmitting = false;
  inquirySuccess = false;
  inquiryError: string | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData() {
    runInAction(() => {
      this.loading = true;
    });
    // Simulate async load — replace with real API calls
    setTimeout(() => {
      runInAction(() => {
        this.artworks = mockArtworks;
        this.artists = mockArtists;
        this.collections = mockPhysicalCollections;
        this.stats = mockPhysicalStats;
        this.loading = false;
      });
    }, 0);
  }

  get filteredArtworks(): PhysicalArtwork[] {
    return this.artworks.filter((artwork) => {
      if (
        this.filters.availability !== 'all' &&
        artwork.availability !== this.filters.availability
      ) {
        return false;
      }
      if (this.filters.artistId !== 'all' && artwork.artistId !== this.filters.artistId) {
        return false;
      }
      if (this.filters.medium.length > 0) {
        const match = this.filters.medium.some((m) =>
          artwork.medium.toLowerCase().includes(m.toLowerCase())
        );
        if (!match) return false;
      }
      if (this.filters.priceMin !== null && typeof artwork.price === 'number') {
        if (artwork.price < this.filters.priceMin) return false;
      }
      if (this.filters.priceMax !== null && typeof artwork.price === 'number') {
        if (artwork.price > this.filters.priceMax) return false;
      }
      return true;
    });
  }

  get selectedArtwork(): PhysicalArtwork | null {
    if (!this.selectedArtworkId) return null;
    return this.artworks.find((a) => a.id === this.selectedArtworkId) ?? null;
  }

  get selectedArtist(): PhysicalArtist | null {
    if (!this.selectedArtistId) return null;
    return this.artists.find((a) => a.id === this.selectedArtistId) ?? null;
  }

  getArtistById(id: string): PhysicalArtist | undefined {
    return this.artists.find((a) => a.id === id);
  }

  getArtworkById(id: string): PhysicalArtwork | undefined {
    return this.artworks.find((a) => a.id === id);
  }

  getArtworksByArtist(artistId: string): PhysicalArtwork[] {
    return this.artworks.filter((a) => a.artistId === artistId);
  }

  setFilter<K extends keyof ArtworkFilters>(key: K, value: ArtworkFilters[K]) {
    this.filters[key] = value;
  }

  toggleMediumFilter(medium: string) {
    const idx = this.filters.medium.indexOf(medium);
    if (idx === -1) {
      this.filters.medium.push(medium);
    } else {
      this.filters.medium.splice(idx, 1);
    }
  }

  clearFilters() {
    this.filters = {
      medium: [],
      availability: 'all',
      artistId: 'all',
      priceMin: null,
      priceMax: null,
    };
  }

  selectArtwork(id: string | null) {
    this.selectedArtworkId = id;
  }

  selectArtist(id: string | null) {
    this.selectedArtistId = id;
  }

  async submitInquiry(inquiry: ArtworkInquiry) {
    runInAction(() => {
      this.inquirySubmitting = true;
      this.inquiryError = null;
      this.inquirySuccess = false;
    });
    try {
      // Replace with real API call: await axios.post('/api/inquire', inquiry)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      runInAction(() => {
        this.inquirySuccess = true;
        this.inquirySubmitting = false;
      });
    } catch {
      runInAction(() => {
        this.inquiryError = 'Unable to send inquiry. Please try again or contact us directly.';
        this.inquirySubmitting = false;
      });
    }
  }

  resetInquiry() {
    this.inquirySubmitting = false;
    this.inquirySuccess = false;
    this.inquiryError = null;
  }

  get availableMediums(): string[] {
    const mediums = new Set<string>();
    this.artworks.forEach((a) => {
      a.medium.split(',').forEach((m) => mediums.add(m.trim()));
    });
    return Array.from(mediums).sort();
  }
}
