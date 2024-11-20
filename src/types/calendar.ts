export interface Tag {
    id: string;
    name: string;
    color: string;
  }
  
  export interface CalendarNote {
    id: string;
    content: string;
    date: Date;
    time?: string;
    tags: Tag[];
  }