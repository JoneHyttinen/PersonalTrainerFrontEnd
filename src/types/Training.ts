export interface Training {
  date: string;
  duration: number;
  activity: string;
  _links: {
    self: {
      href: string;
    };
    training: {
      href: string;
    };
    customer: {
      href: string;
    };
  };
}
