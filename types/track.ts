export interface Track {
  name: string
  album: {
    images: { 
      url: string 
    }[]
    artists: {
      name: string
    }[]
    external_urls: {
      spotify: string
    }
  }
}