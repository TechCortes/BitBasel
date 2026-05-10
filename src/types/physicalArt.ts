export type AvailabilityStatus = 'available' | 'reserved' | 'sold';
export type PriceDisplay = number | 'POA';
export type DimensionUnit = 'cm' | 'in';

export interface Dimensions {
  height: number;
  width: number;
  depth?: number;
  unit: DimensionUnit;
}

export interface ProvenanceEntry {
  year: number;
  description: string;
  institution?: string;
}

export interface ExhibitionEntry {
  year: number;
  title: string;
  venue: string;
  city: string;
}

export interface PhysicalArtwork {
  id: string;
  title: string;
  artistId: string;
  year: number;
  medium: string;
  dimensions: Dimensions;
  edition?: string;
  images: string[];
  price: PriceDisplay;
  currency: 'USD' | 'EUR';
  availability: AvailabilityStatus;
  provenance: ProvenanceEntry[];
  exhibitionHistory: ExhibitionEntry[];
  certificateOfAuthenticity: boolean;
  curatorNote?: string;
  framed: boolean;
  condition: string;
  tags: string[];
  relatedArtworkIds?: string[];
}

export interface ArtistCV {
  year: number;
  description: string;
  category: 'education' | 'solo' | 'group' | 'award' | 'residency' | 'publication';
}

export interface PhysicalArtist {
  id: string;
  name: string;
  bio: string;
  shortBio: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  medium: string[];
  cv: ArtistCV[];
  avatar: string;
  website?: string;
  instagram?: string;
  represented: boolean;
}

export interface PhysicalCollection {
  id: string;
  title: string;
  subtitle?: string;
  curator: string;
  artworkIds: string[];
  coverImage: string;
  description: string;
  openDate: string;
  closeDate?: string;
  location: string;
}

export interface ArtworkInquiry {
  artworkId: string;
  artworkTitle: string;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  message: string;
  shippingCountry: string;
}

export interface PhysicalMarketplaceStats {
  totalArtworks: number;
  totalArtists: number;
  totalCollections: number;
  availableWorks: number;
}
